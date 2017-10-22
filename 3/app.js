var express = require("express");
var app = express();
var router = require("./controllers")

//设置模板引擎
app.set("view engine","ejs");

app.use(express.static("./public"));
//首页
app.get("/",router.showIndex);
app.get("/:photoname",router.showphoto);

app.listen(3000);
