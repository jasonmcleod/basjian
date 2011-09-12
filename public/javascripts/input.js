var input = {
  keyboard : [],
  mouse: {}
};
$(function() {
   $(document).keydown(function (e) {
    input.keyboard[e.keyCode]=true;
    if(e.keyCode>=37 && e.keyCode<=40) {
      e.preventDefault();
    }
    if ( e.keyCode == 84 || e.keyCode == 67 ) { // chat triggers
      //GAME.chat.prompt();
    }
  }).keyup(function (e) {
    input.keyboard[e.keyCode] = false;
  })
  document.addEventListener("mousedown", function(e) {
    input.mouse[e.button] = true;
    //e.preventDefault();
  }, false);
  document.addEventListener("mouseup", function(e) {
    input.mouse[e.button] = false
    //e.preventDefault();
  },false);
  document.addEventListener("mousemove", function(e) {
    input.mouse.x = e.pageX;
    input.mouse.y = e.pageY;
    //e.preventDefault();
  },false);

  $(document).bind("contextmenu", function (e) {
    //return false;
  });
});