const userModel = require('../models/userModel');
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const secretKey = "Natee";
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

const login = async (req, res) => {
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        console.log('User:', user); // Add this line
        console.log(email,password)
        if(!user){
            return res.status(404).json({message: 'User Not Found'})
        }
        
        // Create and sign the JWT token
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('isPasswordValid:', isPasswordValid); // Add this line
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid Password' });
        }
        
        res.status(200).json({
            success:true,
            user,
            token,
            message: 'Login Success'
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            error,
            message: 'Login Failed',
        })
    }
}

const register = async (req, res) => {
    try {
      const newUser = new userModel(req.body);
      await newUser.save();
  
      res.status(201).json({
        success: true,
        newUser,
        message: "Register Success",
      });
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          error,
          message: "Email already in use",
        });
      } else {
        res.status(400).json({
          success: false,
          error,
          message: "Register Failed",
        });
      }
    }
  };
  

  const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, secretKey);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = {login, register, authenticate};
