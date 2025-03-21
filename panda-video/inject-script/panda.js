((w) => {
    w.dataLayer = w.dataLayer || [];
    const listener_events = [
        'panda_play',
        'panda_pause',
        'panda_ended',
        'panda_progress',
        'panda_captionsenabled',
        'panda_captionsdisabled',
        'panda_error'
    ];

    w.addEventListener("message", (event) => {   
        const { data } = event
        if (listener_events.includes(data.message)) {
            w.dataLayer.push({
                event: data.message,
                video: data.video,
                currentTime: data.currentTime,
            });
        }
    }, false);
})(window)