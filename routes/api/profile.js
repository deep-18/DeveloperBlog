const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')

const Profile = require('../../models/profile')
const User = require('../../models/Users')
const Post = require('../../models/Post')
//@route  GET api/profile/me
//@desc   GET CURRENT USER PROFILE
//@access PRIVATE
router.get('/me',auth, async (req,res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name','avatar'])
        console.log(profile)
        if(!profile){
            return res.status(400).json({ msg:  "there is no profile for this user"})
        }
        res.json(profile)
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})
//@route  POST api/profile
//@desc   GET CURRENT USER PROFILE
//@access PRIVATE
router.post('/',[auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubuser,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    //Build Profile Objects
    const profileFields = {};
    profileFields.user =  req.user.id
    if(company){
        profileFields.company = company
    }
    if(website){
        profileFields.website = website
    }
    if(location){
        profileFields.location = location
    }
    if(bio){
        profileFields.bio = bio
    }
    if(status){
        profileFields.status = status
    }
    if(githubuser){
        profileFields.githubuser = githubuser
    }
    if(skills){
        profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }
    //Build Social Objects

    profileFields.social = {}
    if(youtube){
        profileFields.social.youtube = youtube
    }
    if(twitter){
        profileFields.social.twitter = twitter
    }
    if(instagram){
        profileFields.social.instagram = instagram
    }
    if(facebook){
        profileFields.social.facebook = facebook
    }
    if(linkedin){
        profileFields.social.linkedin = linkedin
    }

    try{
        let profile = await Profile.findOne({ user: req.user.id})

        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate({ user: req.user.id}, { $set: profileFields}, {new: true});
            return res.json(profile)
        }

        //Create
        profile = new Profile(profileFields);

        await profile.save()
        res.json(profile)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})

//@route  GET api/profile/user/user:id
//@desc   GET PROFILE BY USER ID
//@access PUBLIC
router.get('/user/:user_id',async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name','avatar'])
        if(!profile) return res.status(400).json({ msg: 'Profile Not Found'})
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Profile Not Found'})
        }
        res.status(500).send('Server Error')
    }
})

//@route  GET api/profile
//@desc   GET ALl PROFILE
//@access PUBLIC
router.get('/',async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name','avatar'])
        res.json(profiles)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})
//@route  Delete api/profile
//@desc   DELETE PROFILE/USER AND POST
//@access PUBLIC
router.delete('/',auth, async (req,res) => {
    try {
        //@todo Remove User Posts
        await Post.deleteMany({ user: req.user.id })
        //Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id})
        await User.findOneAndRemove({ _id: req.user.id})
        res.json({ msg: 'User Deleted Successfully'})
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

//@route  PUT api/profile/experience
//@desc   ADD profile experience
//@access PRIVATE
router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From Date is required').not().isEmpty()
]], async (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
       return res.status(400).json({ errors: errors.array()})
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description    
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id})
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

//@route  Delete api/experience/:exp_id
//@desc   DELETE Experience
//@access Private
router.delete('/experience/:exp_id',auth, async (req,res) => {
    try {
        //@todo Remove User Posts
        //Remove Profile
        const profile = await Profile.findOne({ user: req.user.id})

        //Get the remove index
        const removeindex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        
        profile.experience.splice(removeindex,1)
        await profile.save()
        res.json({ msg: 'User Experience Deleted Successfully'})
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})


//@route  PUT api/profile/education
//@desc   DADD profile education
//@access PRIVATE
router.put('/education',[auth,[
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of Study is required').not().isEmpty(),
    check('from','From Date is required').not().isEmpty()
]], async (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
       return res.status(400).json({ errors: errors.array()})
    }

    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description    
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id})
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

//@route  Delete api/education/"edu_id"
//@desc   DELETE education
//@access Private
router.delete('/education/:edu_id',auth, async (req,res) => {
    try {
        //@todo Remove User Posts
        //Remove Profile
        const profile = await Profile.findOne({ user: req.user.id})

        //Get the remove index
        const removeindex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        
        profile.education.splice(removeindex,1)
        await profile.save()
        res.json({ msg: 'User Education Deleted Successfully'})
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})


//GITHUB AUNTHENTICATION REMAINING
module.exports = router;