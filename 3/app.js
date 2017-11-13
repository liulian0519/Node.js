/*ok*/
var express = require("express");
var app = express();
var router = require("./controllers")

//设置模板引擎
app.set("view engine","ejs");

app.use(express.static("./public"));
app.use(express.static("./uploads"));
//首页
app.get("/",router.showIndex); //路由
app.get("/:photoname",router.showphoto);
app.get("/up",router.showup); //路由

app.post("/up",router.dopost);


app.use(function(req,res){

    res.render("err",{
        "baseurl":req.pathname
    });
})
app.listen(3000);
