var express = require('express');
var router = express.Router();
const authFunctions = require('../functions/authFunctions')
let collection=require('../config/collection');
const { response } = require('../app');

const verifyLogin = (req, res, next) => {
    if (req.session.adminloggedIn) {
      next()
    } else {
      res.redirect('admin/admin-login')
    }
}


router.get('/',verifyLogin,(req,res)=>{
    res.render('admin')
})
router.get('/admin-login',(req,res)=>{
    res.render('admin-login')
})


router.post('/admin-login',(req,res)=>{
    console.log(req.body)
    authFunctions.doLogin(collection.ADMIN_COLLECTION,req.body).then((response) => {
      console.log('response')
      console.log(response)
      if (response.status) {
  
        req.session.admin = response.admin
        req.session.adminloggedIn = true
        res.redirect('/admin')
      } else {
        req.session.adminloginUserErr = "Invalid username or password"
        console.log("error in login")
        let Error = 'Login failed'
        res.render('admin-login',{Error})
      }
    })
    
  })


  router.post('/add-doctors',(req,res)=>{
    console.log(req.body)
    var data = req.body
    var currentdate = new Date(); 
    var temp ="DOC"+ currentdate.getDate() +  (currentdate.getMonth()+1)  
                + currentdate.getFullYear() 
                + currentdate.getHours()  
                + currentdate.getMinutes()
                + currentdate.getSeconds();
    
    data.code = temp
    console.log(data)
    var msg = ''
    authFunctions.addData(collection.DOCTOR_COLLECTION,req.body).then((response)=>{
        if(response){
            msg = 'Added successfully'
            res.render('admin',{msg})
        }else{
            msg = 'Error in adding data'
            res.render('admin',{msg})
        }
    })
  })

  router.get('/admin-logout', (req, res) => {
    req.session.adminloggedIn = null
    res.redirect('admin/admin-login')
  })

module.exports = router;