function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

$(function(){

    $('input, .search-btn').focus(function() {
        $('.search-input').addClass('focus');
        $('.content').addClass('unfocus');
        $('.cancel-btn').addClass('visible');
    });

    $('.cancel-btn').on('click',function(){
        $('.search-input').removeClass('focus');
        $('.content').removeClass('unfocus');
        $('.cancel-btn').removeClass('visible');
        $('#results').html('');
        $('.search-input').val('');
    })

    $('form').on('submit', function(e){
        e.preventDefault();

        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: encodeURIComponent($('.search-input').val() + (smartsearch ? ' lyric video' : '')).replace(/%20/g, "+"),
            maxResults: 5,
            order: 'relevance'
       }); 

        request.execute(function(response) {
            var results = response.result;

            $('#results').html('');

            $.each(results.items, function(index, item) {
            $.get('tpl/item.html', function(data) {
                $('#results').append(tplawesome(data, 
                    [
                        {
                            'title': item.snippet.title,
                            'videoid': item.id.videoId,
                            'link': 'watch?v=' + item.id.videoId
                        }
                    ]));
                });
            });

            if(results.items.length == 0){
                $('#results').html('<p class="not-found">Sorry, no results found.</p>');
            }

       });
    })
});

function init(){
    gapi.client.setApiKey('AIzaSyA8Qk6dVeO2sGMH2cX5ujy5z6Xii3wTv5U');
    gapi.client.load('youtube', 'v3', function(){

    })
}