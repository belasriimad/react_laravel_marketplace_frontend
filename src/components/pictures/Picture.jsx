import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { BASE_URL } from '../../helpers/config'
import Spinner from '../layouts/Spinner'
import { addToCart } from '../../redux/slices/cartSlice'
import Reviews from '../reviews/Reviews'
import { Rating } from 'react-simple-star-rating'
import useTitle from '../custom/useTitle'

export default function Picture() {
    const [picture, setPicture] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, token} = useSelector(state => state.user) 
    const dispatch = useDispatch()
    const { id } = useParams()

    useTitle(`${picture?.title}`)

    useEffect(() => {
        const fetchPictureById = async() => {
            setLoading(true)
            try {
                const response = await axios.get(`${BASE_URL}/picture/${id}`)
                setPicture(response.data.data)
                setLoading(false)
            } catch (error) {
                if(error?.response?.status === 404) {
                    setError('The picture you are looking for does not exist.')
                }
                console.log(error)
                setLoading(false)
            }
        }
        fetchPictureById()
    },[id])


    const calculateReviewAverage = () => {
        let average = picture?.reviews.reduce((acc, review) => {
            return acc + review.rating / picture.reviews.length
        }, 0)
        return average > 0 ? average.toFixed(1) : 0
    }

    const downloadPicture = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/download/picture/${picture?.id}`,
            {
                headers: {
                    "Content-Type": `image/${picture?.ext}`,
                    "Authorization": `Bearer ${token}`
                },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', picture?.title + '.' + picture?.ext)
            document.body.appendChild(link)
            link.click()
            //clean the dom
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.log(error)
        }
    }

    const checkIfUserBoughtPicture = () => {
        const exists = user?.orders.some(order => order.picture.id === picture?.id)
        if(exists) {
            return (
                <button className="btn btn-primary"
                    onClick={() => downloadPicture()}
                    >
                    <i className="bi bi-download"></i> Download
                </button>
            )
        }else {
            return (
                <button className="btn btn-primary"
                    onClick={() => dispatch(addToCart({
                        id: picture?.id,
                        title: picture?.title,
                        price: picture?.price,
                        image: picture?.image_path,
                    }))}
                    >
                    <i className="bi bi-bag-plus"></i> Add to cart
                </button>
            )
        }
    }

    return (
        <div className='container'>
            {
                loading ? <Spinner />
                :
                error ? <div className="row my-5">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-info my-3">
                                    { error }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="row my-5">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <img src={picture?.image_path} 
                                    alt={picture?.title} 
                                    className='img-fluid rounded'    
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header bg-white">
                                <h4 className="text-center mt-2 mb-4">
                                    { picture?.title }
                                </h4>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <img src={picture?.user.image_path} 
                                            alt={picture?.user.name} 
                                            className='img-fluid rounded-circle'
                                            height={60}
                                            width={60}    
                                        />
                                        <div className="d-flex flex-column mx-2">
                                            <span className="fw-bold">
                                                { picture?.user.name }
                                            </span>
                                            <span className="text-muted">
                                                <i>
                                                    { picture?.user.pictures.length } {" "}
                                                    { picture?.user.pictures.length > 1 ? 'pictures' : 'picture'}
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="border border-dark p-2 fw-bold rounded shadow-sm">
                                            ${ picture?.price }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-center my-2">
                                    {
                                        calculateReviewAverage() > 0 && 
                                        <div className="d-flex align-items-center">
                                            <span className="mx-1 text-muted">
                                                <i>
                                                    { picture?.reviews.length } {" "}
                                                    { picture?.reviews.length > 1 ? "Ratings" : "Rating"}
                                                </i>
                                            </span>
                                            <Rating
                                                initialValue={calculateReviewAverage()}
                                                readonly size={32}
                                            />
                                            <span className='mx-1'>
                                                { calculateReviewAverage() }
                                            </span>
                                        </div>
                                    }
                                </div>
                                <div className="row my-3">
                                    <div className="d-grid gap-2 col-10 mx-auto">
                                        { checkIfUserBoughtPicture() }
                                        <Reviews picture={picture} 
                                            setLoading={setLoading} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
