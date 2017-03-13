function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}
var asdf;
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
                asdf = item;
            });

            if(results.items.length == 0){
                $('#results').html('<p class="not-found">Sorry, no results found.</p>');
            }
            var url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + asdf.id.videoId + "&key=AIzaSyA8Qk6dVeO2sGMH2cX5ujy5z6Xii3wTv5U&part=contentDetails"
            $.ajax({
                async: false,
                type: 'GET',
                url: url1,
                success: function(data) {
                    if (data.items.length > 0) {
                        console.log(convert_time(data.items[0].contentDetails.duration));
                    }
                }
            });

       });
	})
});

function init(){
	gapi.client.setApiKey('AIzaSyA8Qk6dVeO2sGMH2cX5ujy5z6Xii3wTv5U');
	gapi.client.load('youtube', 'v3', function(){

	})
}

function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    var h = Math.floor(duration / 3600);
    var m = Math.floor(duration % 3600 / 60);
    var s = Math.floor(duration % 3600 % 60);
    //return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    return h*3600 + m*60 + s;
}