var formidable = require("formidable");
var db = require("../models/db.js");
var md5 = require("../models/md5");
// /首页
exports.showIndex = function(req,res,next){
    res.render("index");
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
                res.send("1");
            })
        })
    })

}