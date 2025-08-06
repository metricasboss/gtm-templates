/**
 * AdEventTracker - Rastreador Vanilla JS de Eventos de Anúncios
 * 
 * Inspirado no jQuery iframeTracker mas implementado em JavaScript puro
 * Rastreia impressões visíveis e cliques em iframes de anúncios com confiabilidade
 */
(function() {
    // Configurações - você pode personalizar estes valores
    var config = window._adsTrackingConfig || {
        impressionEventName: 'ad_custom_impression',
        clickEventName: 'ad_custom_click',
        debug: true
    };
    
    // Variáveis de estado
    var trackedIframes = [];          // Lista de iframes rastreados
    var focusRetriever = null;        // Elemento usado para recuperar o foco
    var isIE8OrOlder = false;         // Detectar IE8 ou inferior
    var page_link = window.location.href;
    var lastFocusTime = 0;            // Última vez que a página teve foco
    var blurDetectionDelay = 100;     // Tempo para considerar um blur como clique
    
    // Dados de rastreamento (impressões x cliques)
    var trackingInfo = {};            // Armazena informações de impressões para uso em cliques
    
    // Função de log
    function log() {
        if (config.debug && console && console.log) {
            console.log.apply(console, arguments);
        }
    }
    
    log('🚀 AdEventTracker: Inicializando rastreador vanilla JS de eventos de anúncios...');
    
    // Verificar se GPT está disponível para rastreamento de impressões
    var hasGPT = typeof googletag !== 'undefined';
    if (!hasGPT) {
        log('⚠️ AdEventTracker: googletag não encontrado! O rastreamento de impressões não será habilitado.');
    } else {
        log('✓ AdEventTracker: googletag encontrado. Rastreamento de impressões será habilitado.');
    }
    
    // Verificar se a camada de dados existe, caso contrário, criar
    window.dataLayer = window.dataLayer || [];
    
    // === FUNÇÕES COMUNS ===
    
    // Determinar posição do anúncio na página
    function getAdPosition(element) {
        if (!element) return 'unknown';
        
        // Se for um ID de slot, verificar pelo texto
        if (typeof element === 'string') {
            var slotId = element;
            if (slotId.indexOf('top') !== -1 || slotId.indexOf('header') !== -1) return 'top';
            if (slotId.indexOf('sidebar') !== -1 || slotId.indexOf('side') !== -1) return 'sidebar';
            if (slotId.indexOf('content') !== -1) return 'in_content';
            if (slotId.indexOf('bottom') !== -1 || slotId.indexOf('footer') !== -1) return 'bottom';
            
            // Tentar obter o elemento com este ID
            element = document.getElementById(slotId);
            if (!element) return 'unknown';
        }
        
        // Determinar posição baseada na posição do elemento no viewport
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight * 0.25) return 'top';
        if (rect.top < viewportHeight * 0.75) return 'middle';
        return 'bottom';
    }
    
    // === INICIALIZAÇÃO DO RASTREADOR ===
    
    // Inicializar o rastreador
    function initTracker() {
        // Detectar browser antigo
        try {
            isIE8OrOlder = navigator.userAgent.match(/(msie) ([\w.]+)/i) && 
                           parseInt(navigator.userAgent.match(/(msie) ([\w.]+)/i)[2]) < 9;
        } catch (ex) {}
        
        // Criar o recuperador de foco (um input escondido usado para detectar perda de foco)
        var focusRetrieverDiv = document.createElement('div');
        focusRetrieverDiv.style.cssText = 'position:fixed; top:0; left:0; overflow:hidden;';
        
        var focusRetrieverInput = document.createElement('input');
        focusRetrieverInput.id = 'ad_focus_retriever';
        focusRetrieverInput.type = 'text';
        focusRetrieverInput.setAttribute('readonly', 'true');
        focusRetrieverInput.style.cssText = 'position:absolute; left:-300px;';
        
        focusRetrieverDiv.appendChild(focusRetrieverInput);
        document.body.appendChild(focusRetrieverDiv);
        
        focusRetriever = document.getElementById('ad_focus_retriever');
        
        // Ouvir evento de blur da janela
        window.addEventListener('focus', function() {
            lastFocusTime = Date.now();
        });
        
        window.addEventListener('blur', function(e) {
            // Se o blur ocorreu muito rápido após o último focus, ignorar
            // isso evita falsos positivos
            if (Date.now() - lastFocusTime > blurDetectionDelay) {
                windowLoseFocus(e);
            }
        });
        
        // Adicionar ouvintes para todos os iframes de anúncios existentes
        trackAllAdIframes();
        
        // Configurar observador para detectar novos iframes
        setupFrameObserver();
        
        log('✅ AdEventTracker: Sistema de rastreamento inicializado com sucesso');
    }
    
    // === RASTREAMENTO DE IMPRESSÕES (GPT) ===
    if (hasGPT) {
        // Extrair informações do Prebid para um slot
        function getPrebidInfo(slot) {
            return {
                bidder: slot.getTargeting('hb_bidder')[0] || null,
                cpm: parseFloat(slot.getTargeting('hb_pb')[0] || 0),
                deal: slot.getTargeting('hb_deal')[0] || null,
                size: slot.getTargeting('hb_size')[0] || null,
                adid: slot.getTargeting('hb_adid')[0] || null
            };
        }
        
        // Obter dados de targeting de um slot
        function getSlotTargeting(slot) {
            const targeting = {};
            const keys = slot.getTargetingKeys();
            
            keys.forEach(function(key) {
                targeting[key] = slot.getTargeting(key);
            });
            
            return targeting;
        }
        
        // Configurar listener de evento de impressão para GPT
        googletag.cmd.push(function() {
            log('✅ AdEventTracker: Configurando listener de impressão de anúncios GPT...');
            
            // Configurar listener de impressão visível
            googletag.pubads().addEventListener('impressionViewable', function(event) {
                const slot = event.slot;
                const slotId = slot.getSlotElementId();
                const adUnitPath = slot.getAdUnitPath();
                
                // Extrair dados do Prebid
                const prebidInfo = getPrebidInfo(slot);
                
                // Criar objeto de dados da impressão
                const impressionData = {
                    event: config.impressionEventName,
                    adData: {
                        slot_id: slotId,
                        ad_unit_path: adUnitPath,
                        position: getAdPosition(slotId),
                        timestamp: new Date().toISOString(),
                        prebid_bidder: prebidInfo.bidder,
                        prebid_cpm: prebidInfo.cpm > 0 ? prebidInfo.cpm.toFixed(2) : 0,
                        prebid_deal: prebidInfo.deal,
                        prebid_size: prebidInfo.size,
                        targeting: getSlotTargeting(slot),
                        page_url: window.location.href,
                        interaction_type: 'impression'
                    }
                };
                
                // Enviar dados para a camada de dados
                window.dataLayer.push(impressionData);
                
                // Log de console
                if (config.debug) {
                    console.groupCollapsed('📊 Impressão de Anúncio Detectada');
                    console.log('Slot ID: %c' + slotId, 'font-weight: bold');
                    console.log('Ad Unit Path: %c' + adUnitPath, 'font-weight: bold');
                    console.log('Posição: ' + getAdPosition(slotId));
                    
                    console.log('Dados enviados para dataLayer com evento: ' + config.impressionEventName);
                    console.groupEnd();
                }
                
                // Armazena informações para o tracker de cliques
                trackingInfo[slotId] = {
                    slot_id: slotId,
                    ad_unit_path: adUnitPath,
                    position: getAdPosition(slotId),
                    prebid_bidder: prebidInfo.bidder,
                    prebid_cpm: prebidInfo.cpm > 0 ? prebidInfo.cpm.toFixed(2) : 0
                };
                
                // Garante que os iframes do anúncio são rastreados para cliques
                trackAdIframe(slotId);
            });
        });
    }
    
    // === RASTREAMENTO DE CLIQUES EM IFRAMES ===
    
    // Rastrear todos os iframes de anúncios existentes
    function trackAllAdIframes() {
        // Procura por todos os iframes que correspondem aos padrões de anúncios
        var adIframes = document.querySelectorAll('iframe[src^="https://googleads.g.doubleclick.net"], iframe[src*="google"], iframe[data-google-query-id]');
        
        log('🔎 AdEventTracker: Encontrados ' + adIframes.length + ' iframes de anúncios');
        
        // Adiciona rastreamento para cada iframe
        for (var i = 0; i < adIframes.length; i++) {
            addTrackingToIframe(adIframes[i]);
        }
    }
    
    // Rastrear iframes específicos de um slot GPT
    function trackAdIframe(slotId) {
        if (!slotId) return;
        
        // Busca o iframe dentro do contêiner do slot
        var slotContainer = document.getElementById(slotId);
        if (!slotContainer) return;
        
        var iframes = slotContainer.querySelectorAll('iframe');
        
        log('🔍 AdEventTracker: Encontrados ' + iframes.length + ' iframes no slot ' + slotId);
        
        // Adiciona rastreamento para cada iframe dentro do slot
        for (var i = 0; i < iframes.length; i++) {
            addTrackingToIframe(iframes[i]);
        }
    }
    
    // Adicionar rastreamento a um iframe específico
    function addTrackingToIframe(iframe) {
        // Verificar se o iframe já está sendo rastreado
        if (trackedIframes.indexOf(iframe) !== -1) {
            return;
        }
        
        var iframeId = iframe.id || 'unknown_' + Math.random().toString(36).substr(2, 9);
        
        // Adicionar à lista de iframes rastreados
        trackedIframes.push(iframe);
        
        log('👁️ AdEventTracker: Rastreando iframe: ' + iframeId);
        
        // Eventos para detectar hover sobre o iframe
        iframe.addEventListener('mouseover', function(e) {
            iframe._adOver = true;
            retrieveFocus();
        });
        
        iframe.addEventListener('mouseout', function(e) {
            iframe._adOver = false;
            retrieveFocus();
        });
    }
    
    // Configurar observador para novos iframes 
    function setupFrameObserver() {
        // Observer para mudanças no DOM que podem adicionar novos iframes
        if (window.MutationObserver) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        // Verifica se novos iframes foram adicionados
                        setTimeout(trackAllAdIframes, 500);
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            log('🔄 AdEventTracker: Observador de DOM configurado para novos iframes');
        } else {
            // Fallback para browsers antigos
            setInterval(trackAllAdIframes, 1500);
            log('⚠️ AdEventTracker: MutationObserver não suportado, usando fallback');
        }
    }
    
    // Recuperar o foco para a página principal
    function retrieveFocus() {
        if (document.activeElement && document.activeElement.tagName === "IFRAME") {
            if (focusRetriever) {
                focusRetriever.focus();
            }
        }
    }
    
    // Chamado quando a janela perde o foco
    function windowLoseFocus(e) {
        log('👆 AdEventTracker: Detecção de perda de foco da janela');
        
        // Verificar todos os iframes rastreados
        for (var i = 0; i < trackedIframes.length; i++) {
            var iframe = trackedIframes[i];
            if (iframe._adOver) {
                log('👆 AdEventTracker: Clique em anúncio detectado em iframe');
                
                // Obter informações para o evento de clique
                var adInfo = getAdInfoFromIframe(iframe);
                
                // Enviar evento de clique para a camada de dados
                window.dataLayer.push({
                    'event': config.clickEventName,
                    'adData': {
                        'slot_id': adInfo.slot_id,
                        'ad_unit_path': adInfo.ad_unit_path,
                        'ad_link': adInfo.src,
                        'ad_location': page_link,
                        'ad_position': adInfo.position,
                        'ad_width': adInfo.width,
                        'ad_height': adInfo.height,
                        'ad_query_id': adInfo.query_id,
                        'prebid_bidder': adInfo.prebid_bidder,
                        'prebid_cpm': adInfo.prebid_cpm,
                        'timestamp': new Date().toISOString(),
                        'interaction_type': 'click'
                    }
                });
                
                if (config.debug) {
                    console.groupCollapsed('👆 Clique em Anúncio Detectado');
                    console.log('Iframe: %c' + adInfo.id, 'font-weight: bold');
                    console.log('Slot ID: %c' + adInfo.slot_id, 'font-weight: bold');
                    if (adInfo.ad_unit_path) {
                        console.log('Ad Unit Path: %c' + adInfo.ad_unit_path, 'font-weight: bold');
                    }
                    console.log('Posição: ' + adInfo.position);
                    console.log('Dados enviados para dataLayer com evento: ' + config.clickEventName);
                    console.groupEnd();
                }
            }
        }
    }
    
    // Extrair informações de um iframe para o evento de clique
    function getAdInfoFromIframe(iframe) {
        var id = iframe.id || '';
        var src = iframe.getAttribute('src') || '';
        var queryId = iframe.getAttribute('data-google-query-id') || '';
        var width = iframe.width || iframe.clientWidth || 0;
        var height = iframe.height || iframe.clientHeight || 0;
        var position = 'unknown';
        
        // Tentar determinar o slot_id com base no ID do iframe ou dos elementos pais
        var slotId = '';
        var adUnitPath = '';
        var prebidBidder = '';
        var prebidCpm = 0;
        
        // Verificar se é um iframe de anúncio do Google GPT
        if (id.indexOf('google_ads_iframe_') === 0) {
            // O ID do iframe segue o formato: google_ads_iframe_/123456/ad_unit_0
            slotId = id.replace('google_ads_iframe_', '').split('_').slice(0, -1).join('_');
            
            // Procurar pelo elemento pai que é o contêiner do anúncio
            var parent = iframe.parentNode;
            while (parent && !slotId) {
                if (parent.id && parent.id.indexOf('div-gpt-ad') === 0) {
                    slotId = parent.id;
                    break;
                }
                parent = parent.parentNode;
            }
        }
        
        // Se encontramos um slotId, verificar se temos informações de rastreamento para ele
        if (slotId && trackingInfo[slotId]) {
            adUnitPath = trackingInfo[slotId].ad_unit_path || '';
            position = trackingInfo[slotId].position || getAdPosition(iframe);
            prebidBidder = trackingInfo[slotId].prebid_bidder || '';
            prebidCpm = trackingInfo[slotId].prebid_cpm || 0;
        } else {
            position = getAdPosition(iframe);
        }
        
        return {
            id: id,
            src: src,
            slot_id: slotId,
            ad_unit_path: adUnitPath,
            query_id: queryId,
            width: width,
            height: height,
            position: position,
            prebid_bidder: prebidBidder,
            prebid_cpm: prebidCpm
        };
    }
    
    // Executar a inicialização quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracker);
    } else {
        initTracker();
    }
    
})();