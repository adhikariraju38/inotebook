const express = require("express");
const User = require("../models/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser =require('../middleware/fetchuser');

const JWT_SECRET="rajuisagoodb@oy";
// ROUTE 1: create a user using: POST "/api/auth/createUser". No login Required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with the same email exist already
    try {
        //catch a error
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      //Create a new User
      const salt =await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt);

      user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: secPass,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authToken=jwt.sign(data,JWT_SECRET);

      res.json({authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error occured");
    }
  }
);

//ROUTER 2: Authenticate a user using: POST "/api/auth/login". No login Required
router.post(
  '/login',
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannnot be blank").exists(),
  ],
  async (req, res) => {
     //if there are errors, return bad request and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const{email,password}=req.body;
     try{
      let user=await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Please try to login with correct credentials"});
      }
      const passwordCompare=await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false
        return res.status(400).json({success,error:"Please try to login with correct credentials"});
      }
      const data={
        user:{
          id:user.id
        }
      }
      const authToken=jwt.sign(data,JWT_SECRET);
      success=true
      res.json({success,authToken});
     }catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error occured");
    }
    
    });

    //ROUTE 3: Get logged in user details using: POST "/api/auth/getuser". Login Required
    router.post(
      "/getuser",fetchuser, async (req, res) => {
    try {
      userId=req.user.id;
      const user =await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error occured");
    }
  })

  //ROUTE 4: Forgot password using: POST "/api/auth/forgetpassword". No Login Required
  router.post('/forgetpassword',
  [
    body("email", "Enter a valid email").isEmail(),
  ], async (req, res) => {
    try {
      const { email } = req.body;
  
      const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
  
      // Find the user with the provided email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: 'User not found' });
      }
  
      // Generate a reset token and expiration date
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetExpiration = Date.now() + 3600000; // 1 hour
      user.resetToken = resetToken;
      user.resetExpiration = resetExpiration;
      await user.save();

      
  
      // Send an email to the user with the reset link
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'iamheretoresetemail@gmail.com',
          pass: 'ksbpresahkzkfaka',
        },
      });
  
      const mailOptions = {
        from: 'iamheretoresetemail@gmail.com',
        to: email,
        subject: 'Password reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://localhost:5000/api/auth/resetpassword/${resetToken}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          console.log(response);
          res.send('An e-mail has been sent to ' + email + ' with further instructions.');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'An error occurred' });
    }
  });

  //ROUTE 5: Reset password using: POST "/api/auth/resetpassword". No Login Required
  
router.post('/resetpassword/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find the user with the provided reset token
    const user = await User.findOne({ resetToken: token, resetExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).send({ error: 'Invalid token' });
    }

    // Hash the new password and save it to the user's record
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetExpiration = undefined;
    await user.save();

    

    res.send('Your password has been reset successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  }
});
  
  
module.exports = router;
