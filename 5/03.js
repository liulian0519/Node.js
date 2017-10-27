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
//处理留言
app.post("/tijiao",function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        console.log("收到了"+ fields.xingming + "  "+ fields.liuyan);
    })
})
app.listen(3000);