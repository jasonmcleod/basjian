game.ui = {
    bind:function() {
        // test crap    
        $("canvas").live("click",function() {
          game.socket.emit("dom.click",2)
        });
    }
}