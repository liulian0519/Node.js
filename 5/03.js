var express = require("express");
var formidable = require("formidable");
var app = express();
var ObjectId = require('mongodb').ObjectID;
var db = require("./model/db.js");
//设置模板引擎
app.set("views engine","ejs");

//
app.use(express.static("./public"));
app.get("/",function(req,res,next) {
    db.getAllCount("liuyanben", function (count) {
        res.render("index", {
            "pageamount": Math.ceil(count / 4)
        });
    });
});
//读取所有留言
app.get("/du",function(req,res,next){
    // var pagesize = 3;
    //可以接受一个参数
    var page = parseInt(req.query.page);
    db.find("liuyanben",{},{"sort":{"shijian":-1},"pageamount":3,"page":page},function(err,result){
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
            "liuyan":fields.liuyan,
            "shijian":new Date()
        },function(err,result){
            if(err){
                res.json({"result":-1});   //这是给Ajax看的
                return;
            }
            res.json({"result":1});
        });

    });
});

app.get("/shanchu",function(req,res,next){
    var id = req.query.id;
    db.deleteMany("liuyanben",{"_id":ObjectId(id)},function(err,result){
        // res.send("删除成功");
        res.redirect("/");
    });
})
app.listen(3000);