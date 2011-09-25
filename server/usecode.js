var usecode = {
    setFixture:function(id,fixture) {
        server.world_fixtures[id].fixture = parseInt(fixture);
        console.log(fixture)
        //io.broadcast({setfixture:{id:id,fixture:fixture}});
    }
}
exports.usecode = usecode;