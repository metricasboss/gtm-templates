/**
 * GoAB Initialization Script
 * Powered by Métricas Boss
 *
 * Este script inicializa o GoAB A/B testing platform
 * Lê configuração de window.__goabConfig
 */

(function() {
  // Ler configuração do window
  var config = window.__goabConfig || {};

  // Variáveis globais do script
  var timeoutId, doc, antiFlickerRemoved, goabObj;

  doc = document;
  antiFlickerRemoved = false;

  goabObj = {
    accountId: config.accountId || '',
    timeout: config.timeout || 3000,
    version: config.version || '2.0.0',
    accountType: config.accountType || 'devs',
    debug: config.debug || false,

    log: function(msg) {
      if (this.debug && console && console.log) {
        var timestamp = new Date().toISOString().split('T')[1].replace('Z', '');
        console.log('[GoAB ' + timestamp + ']', msg);
      }
    },

    // Função para construir URL do script principal
    buildScriptUrl: function() {
      var settings = {};
      var actualAccountType, userId;

      // Tentar ler accountType override do localStorage
      try {
        settings = JSON.parse(localStorage.getItem('goab_settings') || '{}');
      } catch(e) {
        settings = {};
      }

      actualAccountType = settings.atp || this.accountType;
      userId = this.getUserId();

      return 'https://' + actualAccountType + '.goab.io/' +
             this.accountId + '/application.js' +
             '?v=' + this.version +
             '&u=' + encodeURIComponent(location.href) +
             '&t=' + Date.now() +
             (userId ? '&uid=' + encodeURIComponent(userId) : '');
    },

    // Função para ler user ID do cookie
    getUserId: function() {
      var match = doc.cookie.match(/(?:^|;)\s*goab_uid=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : '';
    },

    // Função para adicionar anti-flicker CSS
    addAntiFlicker: function() {
      var style = doc.createElement('style');
      style.id = 'goab-af';
      style.textContent = 'body{opacity:0 !important;visibility:hidden !important}';
      doc.head.appendChild(style);
      this.log('Anti-flicker CSS aplicado');
    },

    // Função para remover anti-flicker CSS
    removeAntiFlicker: function() {
      if (!antiFlickerRemoved) {
        antiFlickerRemoved = true;

        var styleEl = doc.getElementById('goab-af');
        if (styleEl) {
          styleEl.remove();
        }

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        this.log('Anti-flicker CSS removido');
      }
    },

    // Função para carregar script principal
    loadMainScript: function(url) {
      var self = this;
      var script = doc.createElement('script');

      script.src = url;
      script.crossOrigin = 'anonymous';
      script.fetchPriority = 'high';

      script.onload = script.onerror = function() {
        self.removeAntiFlicker();
      };

      try {
        doc.head.appendChild(script);
        this.log('Script principal carregando: ' + url);
      } catch(e) {
        this.log('Erro ao carregar script: ' + e);
        self.removeAntiFlicker();
      }
    },

    // Função de inicialização
    init: function() {
      var self = this;
      var checkInterval;
      var checksCount = 0;
      var maxChecks = this.timeout / 100; // Checar a cada 100ms até o timeout

      this.log('Inicializando...');

      // Aplicar anti-flicker
      this.addAntiFlicker();

      // Configurar timeout
      timeoutId = setTimeout(function() {
        clearInterval(checkInterval);
        self.log('Timeout atingido, removendo anti-flicker');
        self.removeAntiFlicker();
      }, this.timeout);

      // Polling para verificar se application.js criou/modificou window.goab
      checkInterval = setInterval(function() {
        checksCount++;

        // Verificar se window.goab foi modificado pelo application.js
        // O application.js sobrescreve window.goab com seu próprio objeto
        if (window.goab && window.goab !== self && typeof window.goab.version !== 'undefined') {
          clearInterval(checkInterval);
          self.log('Script application.js carregado e inicializado (detectado via polling)');
          self.removeAntiFlicker();
        } else if (checksCount >= maxChecks) {
          clearInterval(checkInterval);
        }
      }, 100);

      // Carregar script principal
      this.loadMainScript(this.buildScriptUrl());
    }
  };

  // Setar na window
  window.goab_code = goabObj;
  window.goab = goabObj;

  // Inicializar
  goabObj.init();

  goabObj.log('Objeto criado e inicializado');
})();
