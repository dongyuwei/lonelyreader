(function() {
    var Task = {
        ws : null,
        init : function(){
            $(document).bind("mobileinit", function(){
                $.extend($.mobile,{
                    subPageUrlKey : 'category',
                    allowCrossDomainPages : true
                });
                
            });

            this.moveToUncategorized().addRssUrl().getArticle();
        },
        moveToUncategorized : function(){
            //move uncategorized feed item to `uncategorized` category
            var list = $('#feedTree > li > ul > .item');
            $('#feedTree > li > ul').append($('<li class="category">uncategorized<ul id="uncategorized"></ul></li>'));
            var uncategorized = $('#uncategorized')[0];
            $.each(list,function(i,item){
                uncategorized.appendChild(item);
            });

            return this;
        },
        addRssUrl : function(){
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

            return this;
        },
        getArticle : function(){
            var item, ws;
            setTimeout(function(){
                ws = Task.connectWebSocket();
            },1000);
            $('#feedTree .item').click(function(){
                setTimeout(function(){//wait for new page render
                    $.mobile.loading('show');
                },20);
                
                item = $(this);
                ws.send(JSON.stringify({
                    action : 'getArticle',
                    url : decodeURIComponent(item.data('url')),
                    id : item.attr('id')
                }));
            });

            return this;
        },
        connectWebSocket : function(){
            if(this.ws){
                return this.ws;
            }
            if (window.WebSocket || window.MozWebSocket) {
                var url = "ws://host:3000".replace("host", window.location.hostname);
                var ws = window.WebSocket ? new WebSocket(url) : new MozWebSocket(url);
                var timer;
                ws.onopen = function() {
                    //重要:无数据时保持连接心跳
                    timer = setInterval(function() {
                        if (ws.readyState === 1 && ws.bufferedAmount === 0) {
                            ws.send("KeepAlive");
                        }
                    }, 20000);
                };
                ws.onmessage = function(evt) {
                    Task.onMessage(evt.data,ws);
                };
                ws.onerror = ws.onclose = function() {
                    Task.ws = null;
                    clearInterval(timer);
                    alert('WebSocket connection lost! Please refresh page.');
                };
            }

            this.ws = ws;
            return ws;
        },
        onMessage : function(data,ws){
            data = JSON.parse(data);
            console.log(data);
            if(data.error){
                $.mobile.loading('hide');
                return alert(data.error);
            }
            
            $('#content_' + data.id).append(this.template(
                '<li data-role="collapsible"  data-collapsed="true">' + 
                    '<h3>#{title}</h3>' +
                    '<div>' +
                        '<span>#{date}</span> by <em>#{author}</em>' +
                        '<a class="ui-li-aside" target="_blank" href="#{link}">Original Link</a>' + 
                        '#{description}' +
                    '</div>' + 
                '</li>', data));
            setTimeout(function(){
                $('#content_' + data.id).collapsibleset('refresh');
                $.mobile.loading('hide');
            },20);
        },
        template: function (tmpl, data) {
            return tmpl.replace(/(#\{(.*?)\})/g, function () {
                return data[arguments[2]] || "";
            });
        }
    };
    
    Task.init();
    
})();
