var express = require("express");
var app = express();
var db = require("./model/db.js")
var session = require("express-session");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.set("views engine","ejs");

app.get("/",function(req,res){
    // res.render("denglu");
    if(req.session.login == "1"){
        res.send("欢迎" + req.session.username);
    }else{
        res.send("没有登陆成功");
    }
});
app.get("/login",function(req,res){
    res.render("denglu");
});
app.get("/checklogin",function(req,res){
// res.send("jkkkk");
    var tianxiedeusername = req.query.username;
    var tianxiedepassword = req.query.password;

    // 根据用户填写的用户名，去数据库里面查找 读取密码
    // 如果读取的密码和填写的密码一样 则登陆成功
    // 如果不一致 则登陆失败
    // 如果根本没有找到  则用户名填写错误
    db.find("users",{"username":tianxiedeusername},function(err,result){
        // console.log(result);
        if(result.length == 0){
            res.send("用户名输入错误，没有这个人啊！！");
            return;
        }
        var shujukudepassword = result[0].password;
        if(shujukudepassword == tianxiedepassword) {
            req.session.login = "1";
            req.session.username = result[0].username;
            res.send("登陆成功 你是" + result[0].username);

        }else{
            res.send("密码错误");
        }
    })

});
app.listen(3000);