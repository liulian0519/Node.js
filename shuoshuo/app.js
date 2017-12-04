var express = require("express")
var app = express();
var router = require("./router/router.js")
var session = require("express-session")
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
//模板引擎
app.set("view engine","ejs");
//静态页面
app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));
//路由表
app.get("/",router.showIndex);                  //显示首页
app.get("/regist",router.showRegist);           //显示注册页
app.post("/doregist",router.doregist);          //执行注册
app.get("/login",router.showLogin);             //显示登陆页
app.post("/dologin",router.dologin);            //执行登陆
app.get("/setavatar",router.showSetavatar);     //显示设置头像页
app.post("/dosetavatar",router.dosetavatar);    //执行设置头像
app.get("/cut",router.showCut);                 //显示剪裁页面
app.get("/docut",router.docut);                 //执行剪裁
app.post("/post",router.doPost);                //发表说说
app.get("/getAllshuoshuo",router.getAllshuoshuo);//列出所有说说
app.get("/getuserinfo",router.getuserinfo);      //得到用户信息
app.get("/getshuoshuoamount",router.getshuoshuoamount); //得到说说总数



app.listen(3000);