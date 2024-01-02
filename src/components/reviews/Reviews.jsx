import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ReviewList from './ReviewList'
import { BASE_URL, getConfig } from '../../helpers/config'
import { ReviewContext } from './context/reviewContext'
import AddUpdateReview from './AddUpdateReview'

export default function Reviews({picture, setLoading}) {
    const {user, token, isLoggedIn} = useSelector(state => state.user)
    const [review, setReview] = useState({
        picture_id: '',
        user_id: '',
        comment: '',
        rating: 0
    })
    const [updating, setUpdating] = useState(false)

    const handleRating = (rating) => {
        setReview({...review, rating})
    }

    const addReview = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = { user_id: user?.id, picture_id: picture?.id, 
                        comment: review.comment, rating: review.rating}
        try {
            const response = await axios.post(`${BASE_URL}/store/review`,
            data, getConfig(token))

            if(!response.data.error) {
                setLoading(false)
                clearReview()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }else {
                setLoading(false)
                clearReview()
                toast.error(response.data.error, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const updateReview = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = { user_id: user?.id, picture_id: picture?.id, 
                        comment: review.comment, rating: review.rating}
        try {
            const response = await axios.put(`${BASE_URL}/update/review`,
            data, getConfig(token))

            if(!response.data.error) {
                picture.reviews = picture.reviews.filter(item => item.id !== review.id)
                setLoading(false)
                clearReview()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }else {
                setLoading(false)
                clearReview()
                toast.error(response.data.error, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }


    const deleteReview = async (data) => {
        setLoading(true)

        try {
            const response = await axios.post(`${BASE_URL}/delete/review`,
            data, getConfig(token))

            if(!response.data.error) {
                picture.reviews = picture.reviews.filter(item => item.id !== data.id)
                setLoading(false)
                clearReview()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }else {
                setLoading(false)
                clearReview()
                toast.error(response.data.error, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const editReview = (data) => {
        setReview(data)
        setUpdating(true)
    }

    const clearReview = () => {
        setReview({
            picture_id: '',
            user_id: '',
            comment: '',
            rating: 0
        })

        if(updating) {
            setUpdating(false)
        }
    }

    return (
        <ReviewContext.Provider
            value={{addReview, review, setReview, updating, handleRating,
                clearReview, editReview, updateReview, deleteReview}}>
            { 
                isLoggedIn && <AddUpdateReview />  
            }      
            <ReviewList picture={picture} />
        </ReviewContext.Provider>
    )
}
