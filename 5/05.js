var express = require("express");
var app = express();
var formidable = require("formidable");
var db = require("./model/db.js")

var md5 = require("./model/md5.js");

app.set("views engine","ejs");

app.use(express.static("./public"));

//注册页面
app.get("/regist",function(req,res,next){
    res.render("regist");
});
//登陆页面
app.get("/login",function(req,res,next){
    res.render("login");
});

//执行注册
app.get("/doregist",function(req,res,next){

    var dengluming = req.query.dengluming;
    var mima = req.query.mima;
    // console.log(dengluming + mima);
    //加密
    mima = md5(md5(mima).substr(4,7) + md5(mima));
    //用户名 密码 存入数据库
    db.insertOne("users",{
        "dengluming" : dengluming,
        "mima" : mima
    },function(err,result){
        if(err){
            res.send("-1");
            return;
        }
        res.send("1");
    })
});
app.post("/dologin",function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        // res.send(fields.dengluming);
        var dengluming = fields.dengluming;
        var mima = fields.mima;
        mima = md5(md5(mima).substr(4,7) + md5(mima));
        //检索数据库 按登录名查看密码是否正确
        db.find("users",{"dengluming":dengluming},function(err,result){
            if(result.length == 0){
                res.send("-2"); //-2 表示没有这个人
                return;
            }
            var shujukuzhongmima = result[0].mima;
            // console.log(shujukuzhongmima);
            //加密  与数据库中的密码进行比对
            if(mima == shujukuzhongmima){
                res.send("1");
            }else{
                res.send("-1");
            }

        })
    });
     return;
});
app.listen(3000);