(function(){
  function load(script) {
    document.write('<'+'script src="'+script+'" type="text/javascript"><' + '/script>');
  }

  load('/js/models.js');
  load('/js/rings.js');
  load('/js/script.js');
  
})();