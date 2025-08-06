((w) => {
    // Carrega o script da Panda Video
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://player.pandavideo.com.br/api.v2.js";
    document.head.appendChild(script);

    // Inicializa o dataLayer
    w.dataLayer = w.dataLayer || [];
    
    // Lista de eventos a serem monitorados
    const listener_events = [
        'panda_play',
        'panda_pause',
        'panda_ended',
        'panda_progress',
        'panda_captionsenabled',
        'panda_captionsdisabled',
        'panda_error',
        'panda_timeupdate',
        'panda_canplay'
    ];

    // Armazena os players e suas durações
    const players = {};

    // Inicializa o player quando o script for carregado
    script.onload = () => {
        console.log("Panda Video API loaded");
    };

    // Listener para mensagens
    w.addEventListener("message", (event) => {   
        const { data } = event;
        
        if (!listener_events.includes(data.message) || !data.video) {
            return; // Ignora eventos que não estão na lista ou sem ID de vídeo
        }
        
        const videoId = data.video;
        
        // Se o player ainda não existe para este vídeo, cria-o
        if (!players[videoId]) {
            console.log(`Initializing player for video ${videoId}`);
            
            try {
                players[videoId] = {
                    instance: new PandaPlayer(`panda-${videoId}`, {
                        onReady: () => {
                            const duration = players[videoId].instance.duration;
                            players[videoId].duration = duration;
                            console.log(`Player ${videoId} ready, duration: ${duration}`);
                            
                            // Processa o evento atual após o player estar pronto
                            processEvent(data);
                        }
                    }),
                    duration: 0
                };
            } catch (error) {
                console.error(`Failed to create player for video ${videoId}:`, error);
            }
        } else {
            // O player já existe, processa o evento
            processEvent(data);
        }
        
        // Função para processar eventos e enviar para o dataLayer
        function processEvent(eventData) {
            const playerData = players[eventData.video];
            
            if (playerData && playerData.instance) {
                // Usa a duração armazenada ou tenta obter novamente
                const duration = playerData.duration || playerData.instance.duration;
                
                console.log(`Event: ${eventData.message}, Video: ${eventData.video}, Duration: ${duration}`);
                
                w.dataLayer.push({
                    event: eventData.message,
                    video: eventData.video,
                    currentTime: Math.round(eventData.currentTime),
                    duration: Math.round(duration),
                    progress: Math.round((eventData.currentTime * 100) / duration)
                });
            }
        }
    }, false);

})(window);