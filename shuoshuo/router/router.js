var formidable = require("formidable");
var db = require("../models/db.js");
var md5 = require("../models/md5");
var path = require("path");
var fs = require("fs");
var gm = require("gm");
// /首页
exports.showIndex = function(req,res,next){

    //console.log(req.session.login);
    //查找头像
    if(req.session.login == "1") {
        //如果登陆
        var username = req.session.username;
        var login = true;
    }else {
        //没有登陆
        var username = "";
        var login = false;
    }
    db.find("users",{username:username},function(err,result) {
        if(result.length == 0){
            var avatar ="moren.jpg";
        }else{
            var avatar = result[0].avatar
        }
        res.render("index", {
            "login": login,
            "username": username,
            "active": "首页",
            "avatar": avatar, //登陆人的头像
        });
    });
}
//注册页
exports.showRegist= function(req,res,next){
    res.render("regist",{
        "login" : req.session.login == "1" ? true : false ,
        "username" : req.session.login == "1" ? req.session.username : "",
        "active" : "注册"

    });
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
                "avatar" : "moren.jpg"
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
    res.render("login",{
        "login" : req.session.login == "1" ? true : false ,
        "username" : req.session.login == "1" ? req.session.username : "",
        "active" : "登陆"

    });
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
//设置头像页面 必须保持是登陆状态
exports.showSetavatar = function (req,res,next) {
    if(req.session.login != "1" ){
        res.send("请登录后再访问");
        return;
    }
    res.render("setavatar",{
        "login" :  true ,
        "username" : req.session.username || "小花花",
        "active" : "修改头像"

    });
}
//设置头像
exports.dosetavatar = function(req,res,next){
   var form = new formidable.IncomingForm();
   form.uploadDir = path.normalize(__dirname + "/../avatar");
   form.parse(req,function(err,fields,files){
       var oldpath = files.touxiang.path;
       var newpath = path.normalize(__dirname + "/../avatar") + "/" + req.session.username + ".jpg";
       fs.rename(oldpath,newpath,function (err) {
           if(err){
               res.send("失败");
               return;
           }
           req.session.avatar = req.session.username + ".jpg";
           //跳转到切的页面
            res.redirect("/cut");
       })
   })
}
exports.showCut = function (req,res) {
    res.render("cut",{
        avatar : req.session.avatar
    });
}
//执行切图
exports.docut = function(req,res,next){
    //这个页面接收几个GET请求参数
    //w、h、x、y
    var filename = req.session.avatar;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;

    gm("./avatar/" + filename)
        .crop(w,h,x,y)
        .resize(100,100,"!")
        .write("./avatar/" + filename,function(err){
            if(err){
                console.log(err)
                res.send("-1");
                return;
            }
            //更改数据库中的avatar
            db.updateMany("users",{"username":req.session.username},{
                $set:{"avatar" : req.session.avatar}},function (err,result) {
                res.send("1");
            });


        })
}
exports.doPost = function(req,res,next){
    if(req.session.login != "1" ){
        res.send("请登录后再访问");
        return;
    }
    var username= req.session.username
    var form = new formidable.IncomingForm();
    form.parse(req,function (err,fields,files) {
        var content = fields.content;
        db.insertOne("posts",{
            "usernmae": username,
            "datetime":new Date(),
            "content":content
        },function(err,result){
            if(err){
                res.send("-3") //服务器错误
                return;
            }
            res.send("1");
        })
    })
}
//列出说说
exports.getAllshuoshuo= function (req,res,next) {
    var page = req.query.page;
    db.find("posts",{},{"pageamount":6,"page":page,"sort":{"datetime":-1}},function (err,result) {
        res.json(result);
    });
}
//列出某个用户信息
exports.getuserinfo= function (req,res,next) {
    var username = req.query.username;
    db.find("users",{"username":username},function (err,result) {
        // console.log(result)
        var obj = {
            "username":result[0].username,
            "avatar":result[0].avatar,
            "_id":result[0]._id
        };
        res.json(obj);
    });
}

//说说总数
exports.getshuoshuoamount = function(req,res,next){
    db.getAllCount("posts",function (count) {
        res.send(count.toString());
    })
}

//个人主页
exports.showUser = function (req,res,next) {
    var user =  req.params["user"];
    db.find("posts",{"usernmae":user},function (err,result) {
       db.find("users",{"username":user},function(err,result2){
           res.render("user",{
               "login":req.session.login == "1" ? true : false,
               "username":req.session.login == "1" ? req.session.username : "",
               "user" : user,
               "active" : "我的说说",
               "cirenshuoshuo":result,
               "cirentouxiang" : result2[0].avatar
           });
       })

    });

}
//显示成员列表
exports.showUserlist = function(req,res,next){
    db.find("users",{},function(err,result){
        res.render("userlist",{
            "login":req.session.login == "1" ? true : false,
            "username":req.session.login == "1" ? req.session.username : "",
            "active" : "成员列表",
            "suoyouchengyuan":result
        });
    })
}