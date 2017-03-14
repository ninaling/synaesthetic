(function(){
  function load(script) {
    document.write('<'+'script src="'+script+'" type="text/javascript"><' + '/script>');
  }

  load('/js/galaxyModels.js');
  load('/js/colors.js');
  load('/js/rings.js');
  load('/js/script.js');
  
})();