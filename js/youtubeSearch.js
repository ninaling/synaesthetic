function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

$(function(){
	$('form').on('submit', function(e){
		e.preventDefault();

		var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: encodeURIComponent($('#search').val()).replace(/%20/g, "+"),
            maxResults: 5,
            order: 'viewCount',
            publishedAfter: '2015-01-01T00:00:00Z'
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
                	]
                ));
            });
          });
       });
	})
});

function init(){
	gapi.client.setApiKey('AIzaSyA8Qk6dVeO2sGMH2cX5ujy5z6Xii3wTv5U');
	gapi.client.load('youtube', 'v3', function(){

	})
}