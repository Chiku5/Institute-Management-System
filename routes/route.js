var express = require('express');
var router = express.Router();
var con  = require('../lib/db');



router.get('/',function(req,res,next){
    res.render('index');
});
router.get('/admin-login',function(req,res,next){
    // res.render('admin-login', {'msg':""});
    let admin=req.session.admin;
    if(admin)
    {
        res.render('admin-login', {'msg':""});
    }
    else{
    res.render('admin-login',{msg:""});
    }
});
router.post('/admin-login',function(req,res,next){
    var uid= req.body.uid;
    var pass = req.body.pass;
    let sql="select COUNT(*) AS count1 from `admin` where `uid`='"+uid+"' and `pwd`='"+pass+"'";


    con.query(sql,function(error,result){
        if(result[0].count1==0)
        {
            res.render('admin-login',{'msg':"invalid userid or password"});
        }
        else
        {
            req.session.admin=uid;
            res.redirect('admin-dashboard');
        }
    });
});
router.get('/admin-dashboard',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var sql="select COUNT(*) AS count1 from student";
        con.query(sql,function(error,result){
            if(error) throw error;
            else{
                var sql2="select COUNT(*) AS count1 from courses";
                con.query(sql2,function(error,result2){
                    res.render('admin-dashboard',{'name':admin,'se':result[0].count1,'co':result2[0].count1});
                })
            }
        })
       
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/add-student',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        res.render('add-student');
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/view-student',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var q1= "select * from student";
        con.query(q1,function(error,result){
        if(error) throw error
        res.render('view-student',{'name':admin,result:result,'msg':""}); 
    });
       
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/delete-student',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    { 
        var id= req.query.id;
        var sql=" select * from student where id= '"+id+"' ";
        con.query(sql,function(error,result){
        if(error) throw error
        res.render('delete-student',{'name':admin,result:result}); 
    });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/register-student',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        res.render('register-student',{'name':admin, 'msg':""});
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.post('/register-student',function(req,res,next){
    let admin=req.session.admin;
    let name =req.body.name;
    let phone =req.body.phone;
    let email =req.body.email;
    let gender =req.body.gender;
    if(admin)
    {
        let q1="select COUNT(*) AS count1 from `student` where `email`='"+email+"' or `phone`='"+phone+"'";
        con.query(q1,function(error,result)
        {
            if(result[0].count1==0)
            {
                let form_data={name:name,email:email,phone:phone,gender:gender};

               // console.log(error);
               let q2="INSERT INTO `student` SET ?" ;
               con.query(q2,form_data,function(error,result2)
               {
               res.render('register-student',{'name':admin,'msg':"Student registered successfully."});
               });
            }
            else
            {
                res.render('register-student',{'name':admin,'msg':"Email or Phone No. already exists!"});
            }
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    

});
router.get('/update-student',function(req,res,next){

    let admin=req.session.admin;
    if(admin)
    {
        var id= req.query.id;
        var sql=" select * from student where id= '"+id+"' ";
        con.query(sql,[id],function(error,result){
            if(error) throw error;  
            res.render('update-student',{'name':admin, 'msg':"You can now update the student details.", result:result});
        });
        
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/all-courses',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var sql= "select * from courses";
        con.query(sql,function(error,result){
            if (error) throw error;
            res.render('all-courses',{'name':admin,result:result,'msg':""});
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/delete-course',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var id=req.query.id;
        var sql= "select * from courses where id= '"+id+"' ";
        con.query(sql,function(error,result){
            if (error) throw error;
            res.render('delete-course',{'name':admin,result:result});
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/deleteCourse-confirm',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var id=req.query.id;
        var sql= "DELETE FROM `courses` WHERE `courses`.`id` = '"+id+"' ";
        con.query(sql,function(error,result){
            if (error) throw error;
            else{
                var sql2= "select * from courses";
                con.query(sql2,function(error,result2){
                    if(error) throw error;
                    res.render('all-courses',{'name':admin,result:result2,'msg':"Selected Course has been successfully deleted"});
                })
            }
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/update-course',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var id=req.query.id;
        var sql= "select * from courses where id= '"+id+"' ";
        con.query(sql,function(error,result){
            if (error) throw error;
            res.render('update-course',{'name':admin,result:result,'msg':"You can now update course details."});
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.post('/update-course',function(req,res,next){
    let admin=req.session.admin;
    var name=req.body.name;
    var duration=req.body.duration;
    var tfee=req.body.tfee;
    var dfee=req.body.dfee;
    var id= req.body.id;
    if(admin)
    {
        let sql="update `courses` SET ? where `id`='"+id+"'" ;
        let form_data={name:name,duration:duration,tfee:tfee,dfee:dfee};
        con.query(sql,form_data,function(error,result)
        {
            if(error) throw error;
            else{
                let sql2="select * from courses where `id`='"+id+"'" ;
                con.query(sql2,function(error,result2){
                    if(error) throw error;
                    res.render('update-course',{'name':admin,'msg':"Course details updated successfully!",result:result2});
                })
            }
        });
    }
    else{
        res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.get('/add-course',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        res.render('add-course',{'name':admin, 'msg':""});
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});
router.post('/add-course',function(req,res,next){
    let admin=req.session.admin;
    let name =req.body.name;
    var duration=req.body.duration;
    var tfee=req.body.tfee;
    var dfee=req.body.dfee;
    if(admin)
    {
        let sql="select COUNT(*) AS count1 from `courses` where `name`='"+name+"' ";
        con.query(sql,function(error,result)
        {
            if(result[0].count1==0)
            {
                let form_data={name:name,duration:duration,tfee:tfee,dfee:dfee};
                let sql2="INSERT INTO `courses` SET ?" ;
                con.query(sql2,form_data,function(error,result2)
                {
                res.render('add-course',{'name':admin,'msg':"New Course has added successfully."});
                });
            }
            else
            {
                res.render('add-course',{'name':admin,'msg':"Course already exists!"});
            }
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    

});

router.get('/add-order',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {   
        
        res.render('add-order',{'name':admin, 'msg':""});
        
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});

router.get('/deleteStudent-confirm',function(req,res,next){
    let admin=req.session.admin;
    if(admin)
    {
        var id=req.query.id;
        var sql= "DELETE FROM `student` WHERE `student`.`id` = '"+id+"' ";
        con.query(sql,function(error,result){
            if (error) throw error;
            else{
                var sql2= "select * from student";
                con.query(sql2,function(error,result2){
                    if(error) throw error;
                    res.render('view-student',{'name':admin,result:result2,'msg':"Selected student has been successfully deleted."});
                })
            }
        });
    }
    else{
    res.render('admin-login',{msg:"Please log in first!"});
    }
    
});

module.exports = router;
