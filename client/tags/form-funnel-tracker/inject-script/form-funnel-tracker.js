/**
 * Form Funnel Tracker - Field-by-field form interaction tracking
 * Tracks focus, blur, change, submit and autocomplete events
 * Pushes structured events to dataLayer for analytics
 *
 * @author Métricas Boss
 * @license ISC
 */

(function(window) {
  'use strict';

  // Configuration will be injected by GTM template
  var config = window.__formFunnelConfig || {
    formSelector: 'form',
    trackFieldTypes: true,
    eventPrefix: 'form_funnel',
    trackFocus: true,
    trackBlur: true,
    trackChange: true,
    trackProgress: true,
    trackSubmit: true,
    trackAutocomplete: true,
    excludeFields: 'password,credit_card,cvv,ssn',
    deduplicateEvents: true,
    observerMode: 'mutation',
    enableDebug: false
  };

  var trackedForms = new WeakSet();
  var eventCache = {};
  var formIndexCounter = 0;

  /**
   * Debug logger
   */
  function debugLog(message, data) {
    if (config.enableDebug) {
      console.log('[Form Funnel Tracker] ' + message, data || '');
    }
  }

  /**
   * Push event to dataLayer
   */
  function pushEvent(eventData) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
    debugLog('Event pushed:', eventData);
  }

  /**
   * Check if field should be tracked
   */
  function shouldTrackField(field) {
    if (!field || !field.name) return false;

    var excludedFields = config.excludeFields.toLowerCase().split(',').map(function(f) {
      return f.trim();
    });

    var fieldName = (field.name || '').toLowerCase();
    var fieldType = (field.type || '').toLowerCase();

    // Check if field name or type is in exclusion list
    for (var i = 0; i < excludedFields.length; i++) {
      if (fieldName.indexOf(excludedFields[i]) !== -1 || fieldType.indexOf(excludedFields[i]) !== -1) {
        debugLog('Field excluded:', field.name);
        return false;
      }
    }

    return true;
  }

  /**
   * Check for duplicate events
   */
  function isDuplicateEvent(formId, fieldId, action) {
    if (!config.deduplicateEvents) return false;

    var cacheKey = formId + '_' + fieldId + '_' + action;
    var now = Date.now();

    if (eventCache[cacheKey] && (now - eventCache[cacheKey]) < 500) {
      debugLog('Duplicate event prevented:', cacheKey);
      return true;
    }

    eventCache[cacheKey] = now;
    return false;
  }

  /**
   * Calculate form progress (0-100)
   */
  function calculateProgress(form) {
    if (!form) return 0;

    var totalFields = 0;
    var filledFields = 0;

    var elements = form.elements;
    for (var i = 0; i < elements.length; i++) {
      var field = elements[i];

      if (field.type === 'submit' || field.type === 'button' || field.type === 'reset') {
        continue;
      }

      if (!shouldTrackField(field)) {
        continue;
      }

      totalFields++;

      if (field.type === 'checkbox' || field.type === 'radio') {
        if (field.checked) filledFields++;
      } else if (field.value && field.value.trim().length > 0) {
        filledFields++;
      }
    }

    if (totalFields === 0) return 0;
    return Math.round((filledFields / totalFields) * 100);
  }

  /**
   * Get form identifier
   */
  function getFormIdentifier(form) {
    if (!form) return 'unknown_form';

    if (form.id) return form.id;
    if (form.name) return form.name;
    if (form.className) return form.className.split(' ')[0];

    if (!form._formIndex) {
      form._formIndex = formIndexCounter++;
    }
    return 'form_' + form._formIndex;
  }

  /**
   * Get field identifier
   */
  function getFieldIdentifier(field) {
    if (!field) return 'unknown_field';

    if (field.name) return field.name;
    if (field.id) return field.id;

    return field.type + '_' + Array.prototype.indexOf.call(field.form.elements, field);
  }

  /**
   * Get field label
   */
  function getFieldLabel(field) {
    if (!field) return '';

    if (field.labels && field.labels.length > 0) {
      return field.labels[0].innerText || field.labels[0].textContent || '';
    }

    var label = field.getAttribute('aria-label') || field.getAttribute('placeholder') || '';
    return label;
  }

  /**
   * Track field event
   */
  function trackField(field, action) {
    if (!field || !field.form) return;

    var formId = getFormIdentifier(field.form);
    var fieldId = getFieldIdentifier(field);

    if (isDuplicateEvent(formId, fieldId, action)) {
      return;
    }

    var eventData = {
      event: config.eventPrefix + '_' + action,
      form_id: formId,
      field_id: fieldId,
      field_type: field.type || 'text',
      field_name: field.name || '',
      field_label: getFieldLabel(field),
      field_value_length: (field.value || '').length,
      timestamp: Date.now()
    };

    if (config.trackProgress && action !== 'submit') {
      eventData.form_progress = calculateProgress(field.form);
    }

    pushEvent(eventData);
  }

  /**
   * Track form submit
   */
  function trackFormSubmit(form) {
    if (!form) return;

    var formId = getFormIdentifier(form);

    if (isDuplicateEvent(formId, 'form', 'submit')) {
      return;
    }

    var eventData = {
      event: config.eventPrefix + '_submit',
      form_id: formId,
      form_progress: calculateProgress(form),
      timestamp: Date.now()
    };

    pushEvent(eventData);
  }

  /**
   * Detect autocomplete
   */
  var autocompleteTimers = {};
  function detectAutocomplete(field) {
    if (!config.trackAutocomplete || !field) return;

    var fieldId = getFieldIdentifier(field);

    if (autocompleteTimers[fieldId]) {
      clearTimeout(autocompleteTimers[fieldId]);
    }

    autocompleteTimers[fieldId] = setTimeout(function() {
      if (field.value && field.value.length > 0 && document.activeElement !== field) {
        trackField(field, 'autocomplete');
      }
    }, 100);
  }

  /**
   * Attach listeners to form
   */
  function attachFormListeners(form) {
    if (!form || trackedForms.has(form)) return;

    trackedForms.add(form);
    debugLog('Tracking form:', getFormIdentifier(form));

    var elements = form.elements;
    for (var i = 0; i < elements.length; i++) {
      var field = elements[i];

      if (field.type === 'submit' || field.type === 'button' || field.type === 'reset') {
        continue;
      }

      if (!shouldTrackField(field)) {
        continue;
      }

      if (config.trackFocus) {
        field.addEventListener('focus', function(e) {
          trackField(e.target, 'focus');
        });
      }

      if (config.trackBlur) {
        field.addEventListener('blur', function(e) {
          trackField(e.target, 'blur');
        });
      }

      if (config.trackChange) {
        field.addEventListener('change', function(e) {
          trackField(e.target, 'change');
        });
      }

      if (config.trackAutocomplete) {
        field.addEventListener('input', function(e) {
          detectAutocomplete(e.target);
        });
      }
    }

    if (config.trackSubmit) {
      form.addEventListener('submit', function(e) {
        trackFormSubmit(e.target);
      });
    }
  }

  /**
   * Initialize tracking
   */
  function initTracking() {
    debugLog('Initializing form tracking...');

    try {
      var forms = document.querySelectorAll(config.formSelector);
      debugLog('Found ' + forms.length + ' forms');

      for (var i = 0; i < forms.length; i++) {
        attachFormListeners(forms[i]);
      }
    } catch (e) {
      debugLog('Error finding forms, falling back to "form" selector:', e);
      var fallbackForms = document.querySelectorAll('form');
      for (var j = 0; j < fallbackForms.length; j++) {
        attachFormListeners(fallbackForms[j]);
      }
    }

    // Setup MutationObserver for dynamic forms
    if (config.observerMode === 'mutation' && window.MutationObserver) {
      debugLog('Setting up MutationObserver for dynamic forms');

      var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];

          for (var j = 0; j < mutation.addedNodes.length; j++) {
            var node = mutation.addedNodes[j];

            if (node.nodeType !== 1) continue;

            if (node.tagName === 'FORM') {
              attachFormListeners(node);
            } else if (node.querySelectorAll) {
              var nestedForms = node.querySelectorAll(config.formSelector);
              for (var k = 0; k < nestedForms.length; k++) {
                attachFormListeners(nestedForms[k]);
              }
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }

})(window);
