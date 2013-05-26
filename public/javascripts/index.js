(function() {
    $('form').on('submit', function(e) {
        e.preventDefault();
        var form = $(this);
        
        $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize()
        }).done(function( msg ) {
            alert(msg + ' added!');
        });
    });


    if (window.WebSocket || window.MozWebSocket) {
        var url = "ws://host:3000".replace("host", window.location.hostname);
        var ws = window.WebSocket ? new WebSocket(url) : new MozWebSocket(url);
        var timer;
        ws.onopen = function() {
            console.log('WebSocket open');
            //重要:无数据时保持连接心跳
            timer = setInterval(function() {
                if (ws.readyState === 1 && ws.bufferedAmount === 0) {
                    ws.send("KeepAlive");
                }
            }, 20000);
        };
        ws.onmessage = function(evt) {
            var data = evt.data;
        };
        ws.onclose = function() {
            clearInterval(timer);
            console.log("socket closed");
        };
    }
})();