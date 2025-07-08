(function() {
  // Extrair parâmetros da URL
  var urlParams = {};
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] && pair[1]) {
      urlParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
  }
  
  // Configurar variáveis do listener
  var originDomain = urlParams.origin || 'https://embeds.beehiiv.com';
  var debug = urlParams.debug === 'true';
  
  // Garantir que dataLayer exista
  window.dataLayer = window.dataLayer || [];
  
  // Configurar o event listener
  window.addEventListener('message', function(event) {
    if (event.origin === originDomain) {
      if (debug) {
        console.log('Beehiiv Event Listener: Evento recebido:', event.data);
      }
      
      if (event.data && event.data.type) {
        window.dataLayer.push({
          event: event.data.type,
          beehiiv_data: event.data
        });
      }
    }
  });
  
  if (debug) {
    console.log('Beehiiv Event Listener: Configurado com sucesso');
    console.log('Beehiiv Event Listener: Origem configurada: ' + originDomain);
  }
})();