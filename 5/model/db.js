//这个模块封装了所有对数据库的常用操作
//连接数据库
var mongodb = require('mongodb');
var settings = require("../setting");

var MongoClient = require('mongodb').MongoClient;
function _connectDB(callback){
    var url =settings.dburl; //从文件中读数据库地址
    MongoClient.connect(url,function(err,db){
        if(err){
            callback(err,null);
            return;
        }
        callback(err,db);
        db.close();
    });
}
//插入数据
exports.insertOne=function(collectionName,json,callback){
    _connectDB(function(err,db){
        if(err){
            callback(err,db);
            return;
        }
        db.collection(collectionName).insertOne(json,function(err,result){
            callback(err,result);
            db.close();
        })
    })
}
//查找数据
exports.find=function(collectionName,json,C,D){
    var result=[] //结果数组
    if(arguments.length == 3){
       var callback = C;
       var skipnumber=0;
       var limit = 0;
    }else if(arguments.length ==4){
        var callback = D;
        var args = C;
        var skipnumber = args.pageamount * args.page;
        var limit=args.pageamount;

        console.log(skipnumber);
        console.log(limit);
    }else{
        throw new Error("find函数参数格式必须为3个或4个");
        return;
    }
    _connectDB(function(err,db){
        var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit);
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);

                db.close();
                return;
            }
            if(doc!=null){
                result.push(doc);   //放入结果数组
            }else{
                //遍历结束，没有更多文档了
                callback(null,result);
                db.close();
            }
        });
    });
}
//删除
exports.deleteMany=function(collectionNmae,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionNmae).deleteMany(
            json,
            function(err,results){
                callback(err,results);
                db.close();
            }
        );
    });
}
//修改
exports.updateMany=function(collectionNmae,json1,json2,callback){
    _connectDB(function(err,db){
        db.collection(collectionNmae).updateMany(
            json1,
            json2,
            function(err,results){
                callback(err,results);
        });

    })
}