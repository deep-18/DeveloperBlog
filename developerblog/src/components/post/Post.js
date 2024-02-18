import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'
import { getPostS } from '../../actions/post'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const PostS = ({getPostS, post: {post,loading}, match}) => {
    useEffect(() => {
        console.log(match.params.id)
        getPostS(match.params.id)
    }, [getPostS])
    return loading || post === null ? <Spinner /> : <Fragment>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
        <div className="comments">
            {post.comment.map(cmt => (
                <CommentItem key={cmt.id} comment={cmt} postId={post._id} />
            ))}
        </div>
    </Fragment>
}

PostS.propTypes = {
    getPostS: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps,{getPostS})(PostS)
