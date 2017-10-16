﻿/*静态资源文件管理*/

var http = require("http");
var l1 = require("url");
var fs = require("fs");
var path = require("path");
var server=http.createServer(function(req,res){
	//得到用户路径
	var pathname=l1.parse(req.url).pathname;
	//默认首页
	if(pathname=="/"){
		pathname="index.html";
	}
	//拓展名
	var extname = path.extname(pathname);
	//读取文件
	fs.readFile("./static/"+pathname,function(err,data){
		if(err){
			//如果文件不存在 404返回
			fs.readFile("./static/404.html",function(err,data){
				res.writeHead(404,{"content-type":"text/html;charset=UEF8"});
				res.end(data);
			});
			return;
		};
		var mime = getMime(extname);
		res.writeHead(200,{"content-type":mime});
		res.end(data);
	});
	
	
	
});

server.listen(3000,"127.0.0.1");


function getMime(extname){
	switch(extname){
		//不完整
		case ".html" : return "text/html";
			break;
		case ".jpg" : return "image/jpg";
			break;
		case ".css" : return "text/css";
			break;
	}
}