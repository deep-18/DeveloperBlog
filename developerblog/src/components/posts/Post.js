import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getPost } from '../../actions/post'
import PostItem from './PostItem'
import PostForm from './PostForm'

const Post = ({getPost, post: { posts,loading}}) => {
    useEffect(() => {
        getPost();
    }, [getPost])
    return loading ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">Post</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome to the Community
        </p>
        {/* PostForm */}
        <PostForm />
        <div className="posts">
            { posts.map((post) => (<PostItem key={post._id} post={post} />)) }
        </div>  
    </Fragment>
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}
const mapStatetoProps = state => ({
    post: state.post
})
export default connect(mapStatetoProps,{getPost})(Post)
