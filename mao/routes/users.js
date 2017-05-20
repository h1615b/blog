var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient
var db_str='mongodb://localhost:27017/boke'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post('/form',function(req,res,next){

	var user=req.body['user']
	var pass=req.body['pass']
	var insterdata=function(db,callback){
		var con=db.collection('mao')
		var data=[{user:user,pass:pass}]
		if(user&&pass!=''){
				con.insert(data,function(err,result){
						if(err){
							console.log('获取失败')
						}else{
							callback(result)
						}
				})
		}else{
			res.render('register',{num:'<div class="tips">tip:用户名和密码不能为空哦O(∩_∩)O~</div>'})
		}
	}		

	mongodb.connect(db_str,function(err,db){
		if(err){
			console.log(err)
		}else{
			console.log('链接成功')
			insterdata(db,function(result){
				console.log(result)
			})
			res.redirect('/login')
			db.close()
		}
	})
})

//登陆

router.post('/login',function(req,res,next){
	var finddata=function(db,callback){
		var con=db.collection('mao')
		var data={user:req.body['user'],pass:req.body['pass']}
		con.find(data).toArray(function(err,result){
			callback(result)
		})
	}
	mongodb.connect(db_str,function(err,db){
		if(err){
			console.log('err')
		}else{
			console.log('链接成功')
			finddata(db,function(result){
			
						if(result.length>0){
							req.session.user=result[0].user
						
								res.redirect('/')
								db.close()
							
						}else{
							res.render('login',{num2:'<div class="tips">请输入正确的用户名和密码</div>'})
						}
			
			})
		}
	})
})

module.exports = router;
