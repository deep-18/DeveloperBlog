const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
//@route  GET api/auth
//@desc   FIND USER
//@access PUBLIC
router.get('/',auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    }catch(err){    
        console.log(err.message)
        res.status(500).json({ msg: "Server Error"})
    }
})
//@route  GET api/auth
//@desc   LOGIN
//@access PUBLIC
router.post('/',[
    check('email', 'enter valid email').isEmail(),
    check('password', 'Password is required').exists()   
], 
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password} = req.body;

    try{
        let user = await User.findOne({email})
        
        //See if user exist
        if(!user){
           return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]})
        }
        
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]})
        }

        //Return json webtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, (err,token) => {
            if(err) throw err;
            res.json({ token })
        })

    } catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})
module.exports = router;