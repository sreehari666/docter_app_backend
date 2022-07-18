var express = require('express');
var router = express.Router();
const authFunctions = require('../functions/authFunctions')
let collection=require('../config/collection')


const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',verifyLogin, function(req, res, next) {


  var len
  list_ = []
  authFunctions.getAllData(collection.APPOINTMENT_COLLECTION).then((response)=>{
    console.log(response)
    len = response.length
    console.log(len)
    if(len == 0){
      res.render('index',);
    }
    count = 0
    for(i=0;i<response.length;i++){
      console.log(response[i].patientid)
      console.log("user id")
      console.log(req.session.user._id)
      doc_id = response[i].doctorid
      console.log(doc_id)
      dt = response[i].time
      

      authFunctions.getDataById(collection.PATIENT_COLLECTION,response[i].patientid).then((value)=>{
        temp= value
        temp.time_ = dt
        
        authFunctions.getDataById(collection.DOCTOR_COLLECTION,doc_id).then((val)=>{
          if(val.code == req.session.user.doctorcode){
            list_.push(temp)
          }
          
          count = count + 1
          if(count == len){
            // console.log(list_)
            // jsonObject = list_.map(JSON.stringify);
      
            // console.log(jsonObject);
      
            // uniqueSet = new Set(jsonObject);
            // uniqueArray = Array.from(uniqueSet).map(JSON.parse);
            // console.log(uniqueArray)
            
            res.render('index', { data:list_});
            
            
          }
        })
        
      })
    }
    // res.render('index');
  })
  
});

router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/signup',(req,res)=>{
  res.render('signup')
})






router.post('/login',(req,res)=>{
  console.log(req.body)
  authFunctions.doLogin(collection.USER_COLLECTION,req.body).then((response) => {
    console.log('response')
    console.log(response)
    if (response.status) {

      req.session.user = response.user
      req.session.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginUserErr = "Invalid username or password"
      console.log("error in login")
      let Error = 'Login failed'
      res.render('login',{Error})
    }
  })
  
})
router.post('/signup',(req,res)=>{
  console.log(req.body)
   authFunctions.checkUser(collection.USER_COLLECTION,req.body).then((response) => {

     if (response) {
      let Error='You already have an account'
      res.render('signup',{Error})
     } else {
      authFunctions.doSignup(collection.USER_COLLECTION,req.body).then((response) => {

        console.log("do signup")
        console.log(response)

        req.session.user = response
        req.session.loggedIn = true
        

        if (response) {
          res.redirect('/')
        } else {
          let Error='Signup failed'
          res.render('signup',{Error})
        }
      })
    }

  })
  
})
router.get('/logout', (req, res) => {
  req.session.loggedIn = null
  res.redirect('/login')
})




module.exports = router;

