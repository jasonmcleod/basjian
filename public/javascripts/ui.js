game.ui = {
    bind:function() {
        // test crap
        $("canvas").live("click",function() {
          game.socket.emit("dom.click",2)
        });

        $("#viewport").single_double_click(function(e) {
            var tileX = Math.round((e.pageX-$("#viewport").offset().left)/game.sprites.w)-1;
            var tileY = Math.round((e.pageY-$("#viewport").offset().top)/game.sprites.h)-1;
            if(game.attackMode) {
                game.socket.emit('identify',{settarget:false,x:game.camera.x+tileX,y:game.camera.y+tileY});
            } else {
                game.socket.emit('identify',{settarget:false,x:game.camera.x+tileX,y:game.camera.y+tileY});
                //$("#target").hide();
            }

            },function(e) {
                e.preventDefault();
                var tileX = Math.round((e.pageX-$("#viewport").offset().left)/game.sprites.w)-1;
                var tileY = Math.round((e.pageY-$("#viewport").offset().top)/game.sprites.h)-1;
               game.socket.emit('useonmap',{x:game.camera.x+tileX,y:game.camera.y+tileY});
            }
        );

        // keyboard/mouse listeners
        clearInterval(game.intervals.movement.loop);
        game.intervals.movement.loop = setInterval(game.player.checkMovement,game.intervals.movement.rate);
    }
}

jQuery.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {
  return this.each(function(){
    var clicks = 0, self = this;
    jQuery(this).unbind("click").bind("click",function(event){
      clicks++;
      if (clicks == 1) {
        setTimeout(function(){
          if(clicks == 1) {
            single_click_callback.call(self, event);
          } else {
            double_click_callback.call(self, event);
          }
          clicks = 0;
        }, timeout || 300);
      }
    });
  });
}