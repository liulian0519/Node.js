var file = require("../models/file.js");
exports.showIndex = function(req,res,next){

    file.getAllAlbums(function(err,allAlbums){
        if(err){
            // res.render("err");
            next();
            return;
        }
        res.render("index",{
            "albums":allAlbums
        });
    })
}
//相册页
exports.showphoto = function(req,res,next){
    //遍历相册中的所有图片
    var albumName = req.params.photoname;
    // console.log(albumName);
   // res.send("相册"+req.params.photo);
    file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
       if(err){
           // res.render("err");
           next();
           return;
       }
        res.render("album",{
            "albumname" : albumName,
            "images":   imagesArray
        });
    })

}