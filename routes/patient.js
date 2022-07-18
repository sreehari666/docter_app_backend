var express = require('express');
var router = express.Router();
const authFunctions = require('../functions/authFunctions')
let collection=require('../config/collection');
const { response } = require('../app');


//app api code



router.post('/patient-login',(req,res)=>{
    console.log(req.body)
    authFunctions.doLogin(collection.PATIENT_COLLECTION,req.body).then((response) => {
      console.log('response')
      console.log(response)
      if (response.status) {
  
        req.session.patient = response.patient
        req.session.patientloggedIn = true
        res.send({success:true,msg:"Login successfull",userid:response.user["_id"]})
        //res.redirect('/')
      } else {
        req.session.patientloginUserErr = "Invalid username or password"
        console.log("error in login")
        let Error = 'Login failed'
        res.send({success:false,msg:Error})
        //res.render('login',{Error})
      }
    })
    
  })
  
  
  router.post('/patient-signup',(req,res)=>{
    console.log(req.body)
     authFunctions.checkUser(collection.PATIENT_COLLECTION,req.body).then((response) => {
  
       if (response) {
        //let Error='You already have an account'
        //res.render('signup',{Error})
        res.send({msg:"You already have an account"})
       } else {
        authFunctions.doSignup(collection.PATIENT_COLLECTION,req.body).then((response) => {
  
          console.log("do signup")
          console.log(response)
  
          req.session.patient = response
          req.session.patientloggedIn = true
          
  
          if (response) {
            res.send({success:true,userid:response["insertedId"]})
            //res.redirect('/')
          } else {
            //let Error='Signup failed'
            //res.render('signup',{Error})
            res.send({success:false,userid:""})
          }
        })
      }
  
    })
    
  })

  router.get('/get-doctor-details',(req,res)=>{
    authFunctions.getAllData(collection.DOCTOR_COLLECTION).then((response)=>{
      console.log(response)
      console.log(response.length)
      res.send({data:response,length:response.length})
    })
  })
 
  router.get('/get-patient-data/:id',(req,res)=>{
    console.log(req.params.id)
    authFunctions.getDataById(collection.PATIENT_COLLECTION,req.params.id).then((response)=>{
      console.log(response)
      res.send(response)
    })
  })
  router.get('/get-doctor-data/:id',(req,res)=>{
    console.log(req.params.id)
    authFunctions.getDataById(collection.DOCTOR_COLLECTION,req.params.id).then((response)=>{
      console.log(response)
      res.send(response.name)
    })
  })


  router.post('/appointment',(req,res)=>{

    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    var data = req.body
    data.time = datetime
    console.log(data)

    authFunctions.addData(collection.APPOINTMENT_COLLECTION,data).then((response)=>{
      console.log(response.acknowledged)
      if(response.acknowledged == true){
        res.send("yes")
      }else{
        res.send(null)
      }
      
    })

  })

  router.get('/get-appointments/:id',(req,res)=>{

    authFunctions.getAllData(collection.APPOINTMENT_COLLECTION).then((response)=>{
      console.log(response)
      list = []
      
      for(i=0;i<response.length;i++){
        if(response[i].patientid == req.params.id){
   
              obj = {"patientid":response[i].patientid,
                  "doctorid":response[i].doctorid,
                  "time":response[i].time,
              }
              list.push(obj)
            
        }
      }
      console.log(list)
      res.send({data:list,length:list.length})
    })

  })

  router.get('/patient-logout', (req, res) => {
    req.session.patientloggedIn = null
    res.send(true)
  })
  
module.exports = router;  