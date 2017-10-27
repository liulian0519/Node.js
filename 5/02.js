var express = require("express");
var app = express();
var db = require("./model/db.js");
增
app.get("/charu",function(req,res){
   db.insertOne("student",{"name":"liulian"},function(err,result){
       if(err)
       {
           console.log("插入失败");
           return;
       }
       res.send("插入成功");
   });
});
//查
app.get("/du",function(req,res){
    var page = parseInt(req.query.page);
    console.log(page);
    db.find("student",{},function(err,result){
        if(err){
            console.log(err);
        }

        res.send(result)
    });
});
//删除
app.get("/shan",function(req,res){
    var student_id=req.query.id;
    db.deleteMany("student",{"student_id":student_id},function(err,result){
        res.send(result);
    });
});
//修改
app.get("/xiugai",function(req,res){
    // var student_id=req.query.id;
    db.updateMany("student",{"student_id":"123456"},{
        $set:{"name":"liulianlian"},
    },function(err,result){
        if(err){
            console.log(err);
            db.close();
        }
        res.send(result);
    });
});
app.listen(3000);