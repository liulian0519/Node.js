var express = require("express");
var formidable = require("formidable");
var app = express();
var db = require("./model/db.js");
//设置模板引擎
app.set("views engine","ejs");

//
app.use(express.static("./public"));
app.get("/",function(req,res,next){
    res.render("index");
});
app.get("/du",function(req,res,next){
    db.find("liuyanben",{},function(err,result){
        res.json({"result":result});
    });
});
//处理留言
app.post("/tijiao",function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        //写入数据库
        db.insertOne("liuyanben",{
            "xingming":fields.xingming,
            "liuyan":fields.liuyan
        },function(err,result){
            if(err){
                res.json({"result":-1});   //这是给Ajax看的
                return;
            }
            res.json({"result":1});
        });

    });
});
app.listen(3000);