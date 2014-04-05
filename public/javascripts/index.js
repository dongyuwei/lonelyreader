(function() {
    var Task = {
        ws : null,
        init : function(){
            setTimeout(function(){
                Task.ws = Task.connectWebSocket();
            },1000);

            this.showCategory().showFeedNode();
        },
        showCategory : function(){
            var box = $('#feedTree');
            var tree = box.data('tree');

            tree.opml.body[0].outline.sort(function(a,b){
                return a.$.title.toLowerCase().localeCompare(b.$.title.toLowerCase());
            });

            var uncategorized = [], categoryNode;
            var oUncategorized = {
                "$": {
                    "title": "uncategorized",
                    "text": "uncategorized"
                },
                "outline" : []
            };
            $.each(tree.opml.body[0].outline,function(i,item){
                if(!item.outline){
                    oUncategorized.outline.push(item);
                }
            });
            tree.opml.body[0].outline.push(oUncategorized);

            $.each(tree.opml.body[0].outline,function(i,item){
                if(item.outline){//is category
                    categoryNode = $('<li class="category">' + item.$.title + '<ul></ul></li>');
                    categoryNode.find('ul').data('meta',item);
                    box.append(categoryNode);
                }
            });
            return this;
        },
        showFeedNode:function(){
            var uuid = 0;
            var feedNode,meta,url;
            $(document).bind("pagebeforechange", function( e, data ) {
                if ( typeof data.toPage === "string" ) {
                    var page = $.mobile.path.parseUrl( data.toPage ).pathname;
                    var $page = $('div[data-url="URL"]'.replace("URL",page)),
                    $header = $page.children( ":jqmData(role=header)" ),
                    $content = $page.children( ":jqmData(role=content)" );

                    var categoryBox = $content.find('ul');
                    meta = categoryBox.data('meta'), url = categoryBox.data('url');
                    if(meta && meta.outline){
                        $.each(meta.outline,function(i,item){
                            feedNode = $($.mustache(
                                '<li class="item"  id="{{{id}}}">' + 
                                    '{{{title}}} <ul data-role="collapsible-set" id="content_{{{id}}}"></ul>' + 
                                '</li>',{
                                title : item.$.title,
                                id : uuid++
                            }));
                            feedNode.find('ul').data('meta',item).data('url',item.$.xmlUrl);

                            categoryBox.append(feedNode);
                        });
                        categoryBox.listview('refresh');
                    }
                    if(url){
                        Task.getArticle(url,categoryBox.attr('id'));
                    }
                }
            });
            return this;
        },
        
        getArticle : function(url,id){
            setTimeout(function(){//wait for new page render
                $.mobile.loading('show');
            },20);
            
            Task.ws.send(JSON.stringify({
                action : 'getArticle',
                url : url,
                id : id
            }));

            return this;
        },
        connectWebSocket : function(){
            if(this.ws){
                return this.ws;
            }
            if (window.WebSocket || window.MozWebSocket) {
                var url = $.mustache("ws://{{{host}}}:{{{port}}}",{
                    host : window.location.hostname,
                    port : $('body').data('ws-port')
                });
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
                    // alert('WebSocket connection lost! Please refresh page.');
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
            
            $('#' + data.id).append(this.template(
                '<li data-role="collapsible"  data-collapsed="true">' + 
                    '<h3>#{title}</h3>' +
                    '<div>' +
                        '<span>#{date}</span> by <em>#{author}</em>' +
                        '<a class="ui-li-aside" target="_blank" href="#{link}">Original Link</a>' + 
                        '#{description}' +
                    '</div>' + 
                '</li>', data));
            setTimeout(function(){
                $('#' + data.id).collapsibleset('refresh');
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
