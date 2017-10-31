var file = require("../models/file.js");
var formidable = require("formidable");
var path =require("path");
var fs = require("fs");
var dateFormat = require('dateformat');

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
//显示上传
exports.showup=function(req,res){
    file.getAllAlbums(function(err,albums){
        res.render("up",{
            "albums":albums
        });
    })

}
//上传表单

exports.dopost=function(req,res){
    var form = new formidable.IncomingForm();
    //
    form.uploadDir=path.normalize(__dirname + "/../tempup/")
    form.parse(req, function(err, fields, files,next) {
        console.log(fields);
        console.log(files);
        //改名
        if(err){
            next();
            return;
        }
        //判断尺寸大小
        var size = files.tupian.size;
        if(size>10240){
            res.send("图片不能大于10M");
            fs.unlink(files.tupian.path)
            return;
        }
        var ttt=dateFormat(new Date(), "yyyymmddHHMMss");
        var ran = parseInt(Math.random()*89999+10000)
        var extname = path.extname(files.tupian.name);
        var wenjianjia = fields.wenjianjia;
        var newpath = path.normalize(__dirname+"/../uploads/"+wenjianjia+ "/"+ttt + ran + extname)
        console.log(newpath);

        var oldpath = files.tupian.path;
        console.log(oldpath);
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("改名失败");
                return;
            }
            res.send("成功");

        })
    });

}