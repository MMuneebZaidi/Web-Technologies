$(document).ready(function() {
    $('img').hover(function() {
        var title = $(this).attr('src');
        $('#img-text').html(title);
    }, function() {
        $('#img-text').html('');
    });
});