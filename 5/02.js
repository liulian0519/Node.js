var express = require("express");
var app = express();
var db = require("./model/db.js");
app.get("/",function(req,res){
   db.insertOne("student",{"name":"liulian"},function(err,result){
       if(err)
       {
           console.log("插入失败");
           return;
       }
       res.send("插入成功");
   });
});
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
app.listen(3000);