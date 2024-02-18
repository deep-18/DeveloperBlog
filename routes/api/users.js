const express = require('express')
const router = express.Router();
const {check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const gravator = require('gravatar')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/Users')
//@route  POST api/users
//@desc   register Users
//@access PUBLIC
router.post('/',[
    check('name', 'name is required').not().isEmpty(),
    check('email', 'enter valid email').isEmail(),
    check('password', 'Enter passwprd with more then 6 characters').isLength({min: 6})   
], 
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {name, email, password} = req.body;

    try{
        let user = await User.findOne({email})
        
        //See if user exist
        if(user){
            res.status(400).json({ errors: [{ msg: 'User already Exist'}]})
        }
        //Get user Avatar
        const avatar = gravator.url('email', {
            s: "200",
            r: "pg",
            d: "mm"
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
        //Encrypt passsword
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password,salt);

        await user.save()
        //Return json webtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 36000000}, (err,token) => {
            if(err) throw err;
            res.json({ token })
        })

    } catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;