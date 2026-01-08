(function() {
  'use strict';
  
  // Evita execução duplicada
  if (window.__equalWebTrackingInitialized) {
    return;
  }
  window.__equalWebTrackingInitialized = true;
  
  // Configuração (pode ser sobrescrita via window.__ewTrackingConfig)
  var config = window.__ewTrackingConfig || {};
  var settings = {
    eventName: config.eventName || 'accessibility_interaction',
    trackProfiles: config.trackProfiles !== false,
    trackFeatures: config.trackFeatures !== false,
    trackMenuActions: config.trackMenuActions !== false,
    trackButtonClick: config.trackButtonClick !== false,
    trackLanguageChange: config.trackLanguageChange !== false,
    trackWidgetLoad: config.trackWidgetLoad !== false,
    debug: config.debug || false
  };
  
  // ===========================================================================
  // MAPEAMENTO DE RECURSOS
  // ===========================================================================
  
  var TRACKING_MAP = {
    // Perfis de Acessibilidade
    profiles: {
      setBlindness: { name: 'Cegueira', category: 'accessibility_profile' },
      setMotorSkillsDisorders: { name: 'Problemas Motores', category: 'accessibility_profile' },
      setColorBlindness: { name: 'Daltonismo', category: 'accessibility_profile' },
      setVisuallyImpaired: { name: 'Baixa Visão', category: 'accessibility_profile' },
      setEpilepsyProfile: { name: 'Epilepsia', category: 'accessibility_profile' },
      setAdhd: { name: 'TDAH', category: 'accessibility_profile' },
      setLearningAndReading: { name: 'Dificuldade Leitura', category: 'accessibility_profile' },
      setElders: { name: 'Idosos', category: 'accessibility_profile' },
      setDyslexia: { name: 'Dislexia', category: 'accessibility_profile' },
      setWebsiteAdaCompliant: { name: 'Conformidade ADA', category: 'accessibility_profile' }
    },
    
    // Recursos de Leitura
    reading: {
      setTextReader: { name: 'Leitor de Texto', category: 'accessibility_reading' },
      setVoiceCommands: { name: 'Comandos de Voz', category: 'accessibility_reading' },
      setReadGuide: { name: 'Guia de Leitura', category: 'accessibility_reading' },
      setDictionary: { name: 'Dicionário', category: 'accessibility_reading' },
      setSummarize: { name: 'Resumir Conteúdo', category: 'accessibility_reading' },
      setReadableFont: { name: 'Fonte Legível', category: 'accessibility_reading' }
    },
    
    // Recursos Visuais
    visual: {
      setColorScheme: { name: 'Esquema de Cores', category: 'accessibility_visual' },
      setFontSize: { name: 'Tamanho Fonte', category: 'accessibility_visual' },
      setZoom: { name: 'Zoom', category: 'accessibility_visual' },
      settextmagnifier: { name: 'Lupa de Texto', category: 'accessibility_visual' },
      setHighlight: { name: 'Destacar Links/Títulos', category: 'accessibility_visual' },
      setAltText: { name: 'Texto Alternativo', category: 'accessibility_visual' }
    },
    
    // Cursor e Foco
    cursor: {
      setBigCursor: { name: 'Cursor Grande', category: 'accessibility_cursor' },
      setfocusMode: { name: 'Modo de Foco', category: 'accessibility_cursor' },
      setHighlightButtons: { name: 'Destacar Botões', category: 'accessibility_cursor' },
      setEnlargeButtons: { name: 'Ampliar Botões', category: 'accessibility_cursor' },
      setFlyingFocus: { name: 'Foco Visual', category: 'accessibility_cursor' }
    },
    
    // Navegação
    navigation: {
      setVirtualKeyboard: { name: 'Teclado Virtual', category: 'accessibility_navigation' },
      setNavigation: { name: 'Navegação Teclado', category: 'accessibility_navigation' },
      setPagemap: { name: 'Mapa da Página', category: 'accessibility_navigation' },
      setShortcutMenu: { name: 'Atalhos', category: 'accessibility_navigation' }
    },
    
    // Mídia
    media: {
      setMuteMedia: { name: 'Silenciar Mídia', category: 'accessibility_media' },
      setSubtitles: { name: 'Legendas', category: 'accessibility_media' }
    },
    
    // Segurança
    safety: {
      setEpilepsy: { name: 'Modo Epilepsia', category: 'accessibility_safety' }
    },
    
    // Controles do Menu
    menu: {
      ShowMenu: { name: 'Abrir Menu', category: 'accessibility_menu' },
      CloseMenu: { name: 'Fechar Menu', category: 'accessibility_menu' },
      switchOff: { name: 'Desativar Tudo', category: 'accessibility_menu' },
      expandMenu: { name: 'Expandir Menu', category: 'accessibility_menu' },
      hideA11yButton: { name: 'Ocultar Botão', category: 'accessibility_menu' }
    }
  };
  
  // ===========================================================================
  // UTILITÁRIOS
  // ===========================================================================
  
  function log() {
    if (settings.debug && console && console.log) {
      var args = ['[EqualWeb Tracking]'].concat(Array.prototype.slice.call(arguments));
      console.log.apply(console, args);
    }
  }
  
  function pushToDataLayer(action, category, label, value, extraData) {
    window.dataLayer = window.dataLayer || [];
    
    var eventData = {
      event: settings.eventName,
      accessibility_action: action,
      accessibility_category: category,
      accessibility_label: label,
      accessibility_timestamp: Date.now()
    };
    
    if (value !== undefined && value !== null) {
      eventData.accessibility_value = value;
    }
    
    if (extraData && typeof extraData === 'object') {
      for (var key in extraData) {
        if (extraData.hasOwnProperty(key)) {
          eventData['accessibility_' + key] = extraData[key];
        }
      }
    }
    
    log('Event pushed:', eventData);
    window.dataLayer.push(eventData);
  }
  
  // ===========================================================================
  // INTERCEPTAÇÃO DE MÉTODOS
  // ===========================================================================
  
  function interceptMethod(obj, methodName, trackingInfo, additionalHandler) {
    if (!obj) {
      if (settings.debug) log('Objeto null/undefined ao tentar interceptar:', methodName);
      return false;
    }

    if (typeof obj[methodName] !== 'function') {
      if (settings.debug) log('Método não é função:', methodName, '(tipo:', typeof obj[methodName], ')');
      return false;
    }

    // Verifica se já foi interceptado
    if (obj[methodName].__ewIntercepted) {
      if (settings.debug) log('Método já interceptado:', methodName);
      return false;
    }

    var original = obj[methodName];

    // Cria função wrapper
    var wrappedFunction = function() {
      var args = Array.prototype.slice.call(arguments);
      var value = args[0];
      var label = trackingInfo.name;

      // Monta label com valor quando aplicável
      if (value !== undefined && value !== null && value !== '') {
        // Para esquemas de cores, traduz os valores
        var valueMap = {
          'blackwhite': 'Preto/Branco',
          'whiteblack': 'Branco/Preto',
          'monochrome': 'Monocromático',
          'highHue': 'Alto Contraste',
          'lowHue': 'Baixo Contraste',
          'soundreder': 'Leitor Sonoro'
        };

        var displayValue = valueMap[value] || value;
        label = trackingInfo.name + ': ' + displayValue;
      }

      // Determina se está ativando ou desativando
      var isDeactivating = false;
      if (window.interdeal && window.interdeal.mode) {
        var modeKey = 'IND' + methodName.replace('set', '');
        isDeactivating = !!window.interdeal.mode[modeKey];
      }

      pushToDataLayer(
        methodName,
        trackingInfo.category,
        label,
        value,
        {
          state: isDeactivating ? 'deactivated' : 'activated',
          method: methodName
        }
      );

      // Handler adicional se fornecido
      if (typeof additionalHandler === 'function') {
        additionalHandler(methodName, args, trackingInfo);
      }

      // Executa método original
      return original.apply(this, args);
    };

    // Marca como interceptado
    wrappedFunction.__ewIntercepted = true;
    wrappedFunction.__ewOriginal = original;

    // Substitui o método (sem travar, para não dar erro)
    obj[methodName] = wrappedFunction;

    log('✓ Método interceptado:', methodName);
    return true;
  }
  
  function findMethodLocation(interdeal, methodName) {
    // Tenta encontrar o método em diferentes locais
    var locations = [
      { obj: interdeal, path: 'interdeal' },
      { obj: interdeal.a11y, path: 'interdeal.a11y' },
      { obj: interdeal.API, path: 'interdeal.API' }
    ];

    for (var i = 0; i < locations.length; i++) {
      var loc = locations[i];
      if (loc.obj && typeof loc.obj[methodName] === 'function') {
        if (settings.debug) log('Método', methodName, 'encontrado em', loc.path);
        return loc;
      }
    }

    return null;
  }

  function setupAllInterceptors(interdeal) {
    var interceptedCount = 0;
    var notFoundCount = 0;
    var notFoundMethods = [];

    log('Iniciando interceptação de métodos...');

    // Coleta todos os métodos a serem interceptados
    var allMethods = [];

    if (settings.trackProfiles) {
      for (var profile in TRACKING_MAP.profiles) {
        if (TRACKING_MAP.profiles.hasOwnProperty(profile)) {
          allMethods.push({ name: profile, info: TRACKING_MAP.profiles[profile] });
        }
      }
    }

    if (settings.trackFeatures) {
      var featureGroups = ['reading', 'visual', 'cursor', 'navigation', 'media', 'safety'];
      featureGroups.forEach(function(group) {
        var features = TRACKING_MAP[group];
        for (var feature in features) {
          if (features.hasOwnProperty(feature)) {
            allMethods.push({ name: feature, info: features[feature] });
          }
        }
      });
    }

    if (settings.trackMenuActions) {
      for (var menuAction in TRACKING_MAP.menu) {
        if (TRACKING_MAP.menu.hasOwnProperty(menuAction)) {
          allMethods.push({ name: menuAction, info: TRACKING_MAP.menu[menuAction] });
        }
      }
    }

    log('Total de métodos para interceptar:', allMethods.length);

    // Tenta interceptar cada método
    allMethods.forEach(function(method) {
      var location = findMethodLocation(interdeal, method.name);

      if (location) {
        if (interceptMethod(location.obj, method.name, method.info)) {
          interceptedCount++;
        }
      } else {
        notFoundCount++;
        notFoundMethods.push(method.name);
      }
    });

    log('✓ Total de métodos interceptados:', interceptedCount);

    if (notFoundCount > 0) {
      log('⚠ Métodos não encontrados:', notFoundCount);
      if (settings.debug && notFoundMethods.length > 0) {
        log('Lista de métodos não encontrados:', notFoundMethods.slice(0, 10).join(', '),
            notFoundMethods.length > 10 ? '...' : '');
      }
    }

    return interceptedCount;
  }
  
  // ===========================================================================
  // RASTREAMENTO DE EVENTOS DOM
  // ===========================================================================
  
  function setupDOMTracking(interdeal) {
    // Mudança de idioma
    if (settings.trackLanguageChange) {
      document.body.addEventListener('INDlanguageChanged', function() {
        var lang = interdeal.lang || interdeal.fullLangISO || 'unknown';
        pushToDataLayer(
          'language_changed',
          'accessibility_menu',
          'Idioma alterado para: ' + lang.toUpperCase(),
          lang
        );
      });
      log('Listener de idioma configurado');
    }
    
    // Clique no botão de acessibilidade
    if (settings.trackButtonClick) {
      setupButtonTracking();
    }
    
    // Eventos de dados carregados
    document.body.addEventListener('INDdataLoaded', function() {
      pushToDataLayer(
        'data_loaded',
        'accessibility_system',
        'Dados de acessibilidade carregados'
      );
    });
    
    // Menu construído
    document.body.addEventListener('INDmenuBuilt', function() {
      pushToDataLayer(
        'menu_ready',
        'accessibility_system',
        'Menu de acessibilidade pronto'
      );
    });
  }
  
  function setupButtonTracking() {
    // Tenta encontrar o botão imediatamente
    var btn = findAccessibilityButton();
    if (btn) {
      attachButtonListener(btn);
    }
    
    // Observa o DOM para quando o botão for adicionado
    var observer = new MutationObserver(function(mutations) {
      var btn = findAccessibilityButton();
      if (btn && !btn.__ewTrackingAttached) {
        attachButtonListener(btn);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function findAccessibilityButton() {
    var selectors = [
      '#INDbtnWrap',
      '.INDbtn',
      '[class*="INDbtn"]',
      '#INDWrap button',
      '[aria-label*="accessibility"]',
      '[aria-label*="acessibilidade"]'
    ];
    
    for (var i = 0; i < selectors.length; i++) {
      var btn = document.querySelector(selectors[i]);
      if (btn) return btn;
    }
    return null;
  }
  
  function attachButtonListener(btn) {
    if (btn.__ewTrackingAttached) return;
    
    btn.__ewTrackingAttached = true;
    btn.addEventListener('click', function() {
      // Verifica se menu está aberto para determinar ação
      var menuOpen = document.querySelector('#INDmenu[class*="open"]') ||
                     document.querySelector('.INDmenuOpen');
      
      pushToDataLayer(
        'button_click',
        'accessibility_menu',
        menuOpen ? 'Fechar Menu (botão)' : 'Abrir Menu (botão)'
      );
    });
    
    log('Listener do botão de acessibilidade configurado');
  }
  
  // ===========================================================================
  // INICIALIZAÇÃO
  // ===========================================================================
  
  function waitForEqualWeb(callback, maxAttempts, interval) {
    maxAttempts = maxAttempts || 100;
    interval = interval || 100;
    var attempts = 0;
    
    var check = function() {
      attempts++;
      
      if (window.interdeal && window.interdeal.a11y) {
        log('EqualWeb detectado após', attempts, 'tentativas');
        callback(window.interdeal);
      } else if (attempts < maxAttempts) {
        setTimeout(check, interval);
      } else {
        log('EqualWeb não encontrado após', maxAttempts, 'tentativas');
        // Tenta novamente quando houver mudanças no DOM
        var observer = new MutationObserver(function(mutations, obs) {
          if (window.interdeal && window.interdeal.a11y) {
            obs.disconnect();
            log('EqualWeb detectado via MutationObserver');
            callback(window.interdeal);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };
    
    check();
  }
  
  function initialize(interdeal) {
    log('Inicializando tracking...');
    log('Versão EqualWeb:', interdeal.version);
    log('Sitekey:', interdeal.sitekey);

    // Configura interceptadores
    var interceptedCount = setupAllInterceptors(interdeal);

    // Se interceptou muito poucos métodos, tenta novamente depois
    if (interceptedCount < 10) {
      log('⚠ Poucos métodos interceptados. Tentando novamente em 2 segundos...');
      setTimeout(function() {
        log('Tentativa adicional de interceptação...');
        var newCount = setupAllInterceptors(interdeal);
        log('Métodos adicionais interceptados:', newCount - interceptedCount);
      }, 2000);
    }

    // INTERCEPTAÇÃO TARDIA - após tudo carregar
    // O EqualWeb pode recriar métodos após inicialização
    setTimeout(function() {
      log('Verificando interceptações após carregamento completo...');
      var reInterceptedCount = setupAllInterceptors(interdeal);
      if (reInterceptedCount > interceptedCount) {
        log('✓ Métodos adicionais interceptados:', reInterceptedCount - interceptedCount);
      }
    }, 3000);

    // MONITORAMENTO CONTÍNUO DE SOBRESCRITA
    // Verifica periodicamente se o EqualWeb sobrescreveu os métodos
    var checkInterval = setInterval(function() {
      var testMethods = ['setTextReader', 'setDyslexia', 'ShowMenu', 'setZoom'];
      var overwritten = 0;

      testMethods.forEach(function(method) {
        if (interdeal[method] && !interdeal[method].__ewIntercepted) {
          if (settings.debug) log('⚠ Método', method, 'foi sobrescrito, reinterceptando...');
          overwritten++;
        }
      });

      if (overwritten > 0) {
        var newCount = setupAllInterceptors(interdeal);
        if (settings.debug) log('Reinterceptados:', newCount, 'métodos');
      }
    }, 2000); // Verifica a cada 2 segundos

    // Para após 30 segundos (15 verificações)
    setTimeout(function() {
      clearInterval(checkInterval);
      if (settings.debug) log('Monitoramento de sobrescrita finalizado');
    }, 30000);

    // Configura tracking de eventos DOM
    setupDOMTracking(interdeal);

    // Evento de inicialização
    if (settings.trackWidgetLoad) {
      pushToDataLayer(
        'widget_initialized',
        'accessibility_system',
        'EqualWeb Tracking Ativo',
        null,
        {
          version: interdeal.version,
          sitekey: interdeal.sitekey,
          lang: interdeal.lang,
          position: interdeal.menuPos,
          intercepted_methods: interceptedCount
        }
      );
    }

    log('Tracking inicializado com sucesso');
  }
  
  // Inicia
  log('EqualWeb Tracking Script carregado');
  log('Configurações:', settings);
  
  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForEqualWeb(initialize);
    });
  } else {
    waitForEqualWeb(initialize);
  }
  
})();