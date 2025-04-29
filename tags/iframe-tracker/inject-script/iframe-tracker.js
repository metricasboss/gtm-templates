(function() {
  // Obter configuração
  var config = window._iframeTrackerConfig || { 
    eventName: 'ad_click',
    debug: false
  };
  
  // Função de log
  function log() {
    if (config.debug && console && console.log) {
      console.log.apply(console, arguments);
    }
  }
  
  log('[IframeTracker] Inicializando com config:', config);
  
  // IframeTracker constructor
  function IframeTracker() {
    // State
    this.focusRetriever = null;  // Element used for restoring focus on window
    this.focusRetrieved = false; // Says if the focus was retrieved on the current page
    this.handlersList = [];      // Store a list of every trackers
    
    // Init on creation
    log('[IframeTracker] Inicializando tracker');
    this.init();
  }
  
  // Initialize prototype
  IframeTracker.prototype = {
    // Init (called once on document ready)
    init: function() {
      var self = this;
      log('[IframeTracker] Executando função init');
      
      // Listening window blur
      log('[IframeTracker] Configurando event listeners da janela');
      window.addEventListener('blur', function(e) {
        log('[IframeTracker] Janela perdeu foco - chamando windowLoseFocus');
        self.windowLoseFocus(e);
      });
      
      // Focus retriever (get the focus back to the page, on mouse move)
      log('[IframeTracker] Criando elemento de recuperação de foco');
      this.focusRetriever = document.createElement('input');
      this.focusRetriever.setAttribute('id', 'focus_retriever');
      this.focusRetriever.setAttribute('type', 'text');
      this.focusRetriever.setAttribute('readonly', 'true');
      
      var div = document.createElement('div');
      div.style.position = 'fixed';
      div.style.top = '0';
      div.style.left = '0';
      div.style.overflow = 'hidden';
      
      this.focusRetriever.style.position = 'absolute';
      this.focusRetriever.style.left = '-300px';
      
      div.appendChild(this.focusRetriever);
      document.body.appendChild(div);
      log('[IframeTracker] Elemento de recuperação de foco adicionado ao DOM');
      
      this.focusRetrieved = false;
      
      // Auto-track all iframes
      this.trackAllIframes();
    },
    
    // Track all iframes in the page
    trackAllIframes: function() {
      log('[IframeTracker] Iniciando rastreamento automático de todos os iframes');
      var iframes = document.querySelectorAll('iframe');
      
      if (iframes.length === 0) {
        log('[IframeTracker] Nenhum iframe encontrado na página');
        return;
      }
      
      log('[IframeTracker] Encontrados', iframes.length, 'iframes para rastrear');
      
      // Create a handler for all iframes
      var handler = {
        blurCallback: function() {
          log('[IframeTracker] Callback de blur chamado, iframe foi clicado');
          // Será definido dinamicamente para cada iframe
        }
      };
      
      // Setup tracking for each iframe
      for (var i = 0; i < iframes.length; i++) {
        this.trackSingleIframe(iframes[i]);
      }
      
      // Monitor for dynamically added iframes
      this.observeDOMForIframes();
    },
    
    // Setup tracking for a single iframe
    trackSingleIframe: function(iframe) {
      if (!iframe) return;
      
      var self = this;
      var iframeId = iframe.id || '';
      var iframeClasses = iframe.className || '';
      var iframeSrc = iframe.src || '';
      var queryId = iframe.getAttribute('data-google-query-id') || '';
      
      log('[IframeTracker] Configurando rastreamento para iframe:', iframeId || '(sem id)', iframeSrc);
      
      // Create a unique handler for this iframe
      var handler = {
        over: false,
        target: iframe,
        blurCallback: function() {
          log('[IframeTracker] Clique detectado no iframe:', iframeId || '(sem id)');
          
          // Obter o valor atualizado de data-google-query-id
          var currentQueryId = iframe.getAttribute('data-google-query-id') || '';
          
          // Push to dataLayer
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': config.eventName,
            'iframe_id': iframeId,
            'iframe_classes': iframeClasses,
            'iframe_src': iframeSrc,
            'query_id': currentQueryId
          });
          
          log('[IframeTracker] Evento enviado para dataLayer:', config.eventName);
          log('[IframeTracker] query_id:', currentQueryId);
        }
      };
      
      // Add to handlers list
      this.handlersList.push(handler);
      
      // Add listeners
      iframe.addEventListener('mouseover', function() {
        log('[IframeTracker] Mouseover no iframe:', iframeId || '(sem id)');
        handler.over = true;
        self.retrieveFocus();
      });
      
      iframe.addEventListener('mouseout', function() {
        log('[IframeTracker] Mouseout no iframe:', iframeId || '(sem id)');
        handler.over = false;
      });
      
      log('[IframeTracker] Rastreamento configurado para iframe:', iframeId || '(sem id)');
    },
    
    // Observe DOM for dynamically added iframes
    observeDOMForIframes: function() {
      var self = this;
      log('[IframeTracker] Iniciando observação do DOM para novos iframes');
      
      // Check periodically for new iframes
      setInterval(function() {
        var iframes = document.querySelectorAll('iframe');
        var trackedIframes = self.handlersList.map(function(handler) {
          return handler.target;
        });
        
        // Find iframes that aren't being tracked yet
        for (var i = 0; i < iframes.length; i++) {
          var iframe = iframes[i];
          var isTracked = false;
          
          for (var j = 0; j < trackedIframes.length; j++) {
            if (iframe === trackedIframes[j]) {
              isTracked = true;
              break;
            }
          }
          
          if (!isTracked) {
            log('[IframeTracker] Novo iframe detectado, configurando rastreamento');
            self.trackSingleIframe(iframe);
          }
        }
      }, 2000); // Check every 2 seconds
    },
    
    // Give back focus from an iframe to parent page
    retrieveFocus: function() {
      log('[IframeTracker] retrieveFocus chamado, elemento ativo:', 
          document.activeElement ? document.activeElement.tagName : 'none');
      
      if (document.activeElement && document.activeElement.tagName === "IFRAME") {
        log('[IframeTracker] Iframe tem o foco, recuperando para a página');
        this.focusRetriever.focus();
        this.focusRetrieved = true;
        log('[IframeTracker] Foco recuperado:', this.focusRetrieved);
      } else {
        log('[IframeTracker] Não é necessário recuperar o foco');
      }
    },
    
    // Calls blurCallback for every handler with over=true on window blur
    windowLoseFocus: function(e) {
      log('[IframeTracker] windowLoseFocus chamado, handlers:', this.handlersList.length);
      var handlersCalled = 0;
      
      for (var i = 0; i < this.handlersList.length; i++) {
        log('[IframeTracker] Verificando handler', i, 'over:', this.handlersList[i].over);
        if (this.handlersList[i].over === true) {
          log('[IframeTracker] CLIQUE EM IFRAME DETECTADO COM SUCESSO!');
          handlersCalled++;
          this.handlersList[i].blurCallback(e);
        }
      }
      
      if (handlersCalled === 0) {
        log('[IframeTracker] Nenhum handler com over=true encontrado');
      } else {
        log('[IframeTracker] Chamado blurCallback para', handlersCalled, 'handlers');
      }
    }
  };
  
  // Create and initialize tracker
  window.iframeTracker = new IframeTracker();
  
  log('[IframeTracker] Inicialização concluída');
})();