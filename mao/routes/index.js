var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
//数据库地址
var db_str='mongodb://localhost:27017/boke'
/* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Express' ,user:req.session.user});
//});
router.get('/register',function(req,res,next){
	res.render('register',{num:''})
})
router.get('/login',function(req,res,next){
	res.render('login',{num2:'',num3:''})
})

router.get('/relogin',function(req,res,next){
	req.session.destroy(function(err){
		if(err){
			console.log(err)
		}else{
			res.redirect('/')
		}
	})
	
})

//存储
router.post('/',function(req,res,next){
		var user=req.session.user;
	
		if(user){
			var biaoti=req.body['biaoti']
			var con=req.body['con']			
			//插入函数
			var insertdata=function(db,callback){
				//插入集合
				var con1=db.collection('message')
				var data=[{biaoti:biaoti,con:con}]
				con1.insert(data,function(err,result){
					if(err){
						console.log('获取失败')
					}else{
						callback(result)
					}
				})
				
			}
				
			mongodb.connect(db_str,function(err,db){
					if(err){
							console.log(err)
					}else{
							console.log('链接成功')
							insertdata(db,function(result){
								console.log(result)
								res.redirect("/")
								db.close()
							})
							
					}
			})
		}else{
			
			res.send("你的登陆以过期，请重新登陆")
			
		}
})
//显示
router.get('/', function(req, res, next) {
  //链接数据库 
	mongodb.connect(db_str,function(err,db) {
			if(err){
				console.log(err);
			}else{
				//调用finddata函数
				finddata(db)
				//关闭数据库
				db.close()
			}
	})
	//查找函数
	var finddata=function(db) {
				
				var coll1=db.collection('message')
				coll1.find({}).toArray(function(err,litem) {
						if(!err){
							res.render("index",{litem:litem,user:req.session.user,title: 'Express' ,})
						}
				})
				
				
				
	}
});
module.exports = router;
