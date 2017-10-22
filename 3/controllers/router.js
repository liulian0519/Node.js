var file = require("../models/file.js");
exports.showIndex = function(req,res){

    file.getAllAlbums(function(err,allAlbums){
        if(err){
            res.send(err);
            return;
        }
        res.render("index",{
            "albums":allAlbums
        });
    })
}
exports.showphoto = function(req,res){
   res.send("相册"+req.params.photo);
}