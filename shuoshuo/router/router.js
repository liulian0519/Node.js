var formidable = require("formidable");
var db = require("../models/db.js");
var md5 = require("../models/md5");

// /首页
exports.showIndex = function(req,res,next){

    console.log(req.session.login);
    res.render("index",{
        "login" : req.session.login == "1" ? true : false ,
         "username" : req.session.login == "1" ? req.session.username : ""

    });
}
//注册页
exports.showRegist= function(req,res,next){
    res.render("regist");
}
//注册业务
exports.doregist = function(req,res,next){
    //得到用户所填写的
    //在数据库中查找 是否有这个人
    //如果没有 保存
    var form = formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var username = fields.username;
        var password = fields.password;

        db.find("users",{"username":username},function (err,result) {
            if(err){
                res.send("-3");
                return;
            }
            if(result.length != 0){
                res.send("-1"); //被占用
                return;
            }
            password = md5(md5(password) + "liulian");
            //保证数据库中没有这个人
            db.insertOne("users",{
                "username":username,
                "password":password,
            },function(err,result){
                if(err){
                    res.send("-3");
                    return;
                }
                req.session.login = "1";
                req.session.username = username;

                res.send("1"); //注册成功 写入session

            })
        })
    })

}

//登录页
exports.showLogin = function (req,res,next) {
    res.render("login");
}
//登录页面的执行业务
exports.dologin = function (req,res,next) {
    //得到用户输入的用户名
    //查询数据库中是否存在
    //对比密码是否正确
   var form  = new formidable.IncomingForm();
   form.parse(req,function (err,fields,files) {
       var username = fields.username;
       var password = fields.password;
       var jiamihou = md5(md5(password) + "liulian");
       // console.log(username,password);
       db.find("users",{"username":username},function (err,result) {
           if(err){
               res.send("-5") //服务器错误
               return
           }
           if(result.length == 0){
               //没有在这个人
               res.send("-1"); //用户名不存在
               return
           }
           //存在该用户，匹配密码是否正确
           if(jiamihou == result[0].password){
               req.session.login = "1";
               req.session.username = username;
               res.send("1"); //登陆成功
               return;
           }else{
               res.send("-2"); //密码错误
               return;
           }

       })
   });
}