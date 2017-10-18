var http = require("http");
var formidable = require('formidable');
var dateFormat = require('dateformat');
var path = require("path");
var fs = require("fs")
var util = require("util");
var server = http.createServer(function(req,res){
    if(req.url == "/dopost" && req.method.toLowerCase()=="post"){
        var form = new formidable.IncomingForm();



        form.uploadDir="./uploads";
        form.parse(req, function(err, fields, files) {


            // console.log(fields);
            // console.log(files);
            // res.write('received upload:\n\n');
            // res.end(util.inspect({fields: fields, files: files}));
            var ttt=dateFormat(new Date(), "yyyymmddHHMMss");
            var ran = parseInt(Math.random()*89999+10000)
            var extname = path.extname(files.tupian.name);
            //改名
            var oldpath =__dirname + "/" + files.tupian.path;
            var newpath = __dirname+ "/uploads/" + ttt + ran + extname;
            //console.log(newpath);
            // console.log(oldpath);
            fs.rename(oldpath,newpath,function(err,data){
                if(err){
                    throw Error("failre");
                }
                res.writeHead(200, {'content-type': 'text/html'});
                res.end("success");
            });

        });

        return;
    }
    else if(req.url == "/"){
        fs.readFile("./form.html",function(err,data){
            res.writeHead(200, {'content-type': 'text/html'});
            res.end(data);
        })
    }else{
        res.writeHead(404, {'content-type': 'text/html'});
        res.end("404");
    }

});
server.listen(80,"192.168.1.155");