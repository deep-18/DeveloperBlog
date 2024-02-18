const express = require('express')
const router = express.Router();
const {check,validationResult} = require('express-validator')
const auth = require('../../middleware/auth');
// const Post = require('../../models/Post')
// const Profile = require('../../models/profile')
// const Users = require('../../models/Users')
const Post = require('../../models/Post')
const Users = require('../../models/Users')
const Profile = require('../../models/profile')

//@route  POST api/post
//@desc   MAKE A POST
//@access PUBLIC
router.post('/',[auth,[
    check('text','Text cannot be empty').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const user = await Users.findById(req.user.id).select('-password')
    
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save()
        res.json(post)        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

//@route  GET api/post
//@desc   GET ALL POST
//@access PRIVATE
router.get('/', auth, async (req,res) => {
    try{
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
})

//@route  GET api/post/:id
//@desc   GET POST BY ID
//@access PRIVATE
router.get('/:id', auth, async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({ msg: 'Post not found'})
        }
        res.json(post)
    }catch(err){
        console.log(err)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})

//@route  DELETE api/post/:id
//@desc   DELETE POST BY ID
//@access PRIVATE
router.delete('/:id', auth, async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        console.log(post.user,req.user.id)
        if(!post){
            return res.status(404).json({ msg: 'Post not found'})
        }
        //Check User
        if(post.user.toString() != req.user.id){
            return res.status(401).json({ msg: 'User is not authorized'})
        }
        
        await post.remove()
        res.json({ msg: "Post Removed"})
    }catch(err){
        console.log(err)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})

//@route  PUT api/post/:id
//@desc   LIKE A POST
//@access PRIVATE
router.put('/like/:id',auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if it is already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'Post Already Liked'})
        }
        post.likes.unshift({user: req.user.id})
        await post.save()
        res.json(post.likes)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send('Server Error')
    }
})
//@route  PUT api/post/:id
//@desc   DISLIKE A POST
//@access PRIVATE
router.put('/unlike/:id',auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if it is already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'Post is Not Yet Liked'})
        }

        //GET REMOVE INDEX
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
        post.likes.splice(removeIndex,1)

        await post.save()

        res.json(post.likes)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send('Server Error')
    }
})

//@route  POST api/comment/:id
//@desc   MAKE A COMMENT
//@access PRIVATE
router.post('/comment/:id',[auth,[
    check('text','Text cannot be empty').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const user = await Users.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comment.unshift(newComment)   
        await post.save()
        res.json(post.comment)        
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})
//@route  DELTE api/comment/:id
//@desc   DELETE A COMMENT
//@access Private
router.delete('/comment/:id/:comment_id',auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Pull out comment
        const comment = post.comment.find(c => c.id === req.params.comment_id)

        //Make Suer Comment Exist
        if(!comment){
            return res.status(404).json({ msg: 'Comment does not exist'}) 
        }

        //Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorized'}) 
        }

        const removeIndex = post.comment.map(c => c.user.toString()).indexOf(req.user.id)
        post.comment.splice(removeIndex,1)
        await post.save()
        res.json(post.comment)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: 'Server Error'})
    }
})
module.exports = router;