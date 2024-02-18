import axios from 'axios'
import {setAlert} from './alert'
import { ADD_POST, DELETE_POST, GET_POST, GET_POSTS,POST_ERROR, UPDATE_LIKES,ADD_COMMENT,REMOVE_COMMENT} from './type'

//GET POST
export const getPost = () => async dispatch => {
    try {
        const res = await axios.get('api/post')

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: null
        })
    }
}

//ADD LIKE
export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`api/post/like/${postId}`)
        console.log(res)
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: null
        })
    }
}

//REMOVE LIKE
export const deletePost = (id) => async dispatch => {
    try {
        const res = await axios.delete(`api/post/${id}`)

        dispatch({
            type: DELETE_POST,
            payload: id
        })

        dispatch(setAlert('Post Removed','success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: error.response.data
        })
    }
}

//DELETE POST
export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`api/post/unlike/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.status }
        })
    }
}

//ADD POST
export const addPost = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`api/post`, formData,config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post Created','success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: error.response.data
        })
    }
}

// //GET POST
export const getPostS = (id) => async dispatch => {
    try {
        const res = await axios.get(`api/post/${id}`)
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: error.response.data
        })
    }
}

//ADD COMMENT
export const addComment = (postId,formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`api/post/comment/${postId}`, formData,config)

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Comment Added','success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: error.response.data
        })
    }
}

//delete COMMENT
export const deleteComment = (postId,commentId) => async dispatch => {
    try {
        const res = await axios.delete(`api/post/comment/${postId}/${commentId}`)

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert('Comment Deleted','success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: error.response.data
        })
    }
}