(function(){
    $('form').on('submit', function(e) {
        e.preventDefault();
        $(this).ajaxSubmit({});
    });
})();