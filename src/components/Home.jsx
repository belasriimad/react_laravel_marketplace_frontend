import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../helpers/config'
import Spinner from './layouts/Spinner'
import Categories from './partials/Categories'
import useCategories from './custom/useCategories'
import Extensions from './partials/Extensions'
import { Link } from 'react-router-dom'
import useTitle from './custom/useTitle'

export default function Home() {
    const [pictures, setPictures] = useState([])
    const [extensions, setExtensions] = useState([])
    const [loading, setLoading] = useState(false)
    const categories = useCategories(1)
    const [categoryId, setCategoryId] = useState('') 
    const [pictureExt, setPictureExt] = useState('') 
    const [picturesToShow, setPicturesToShow] = useState(6) 

    useTitle('Home')

    useEffect(() => {
        setLoading(true)
        const fetchPictures = async () => {
            setPicturesToShow(6)
            try {
                if(categoryId) {
                    const response = await axios.get(`${BASE_URL}/pictures/category/${categoryId}`)
                    setPictures(response.data.data)
                    setLoading(false)
                }else if(pictureExt) {
                    const response = await axios.get(`${BASE_URL}/pictures/extensions/${pictureExt}`)
                    setPictures(response.data.data)
                    setLoading(false)
                }else {
                    const response = await axios.get(`${BASE_URL}/pictures`)
                    setPictures(response.data.data)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        const fetchExtensions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/extensions`)
                setExtensions(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPictures()
        fetchExtensions()
    }, [categoryId, pictureExt])


    const loadMorePictures = () => {
        if(picturesToShow > pictures.length) {
            return; 
        }else {
            setPicturesToShow(prevPicturesToShow => prevPicturesToShow += 6)
        }
    }

    return (
        <div className='container'>
            {
                loading ?
                    <Spinner />
                :
                <div className="row my-5">
                    <div className="col-md-8">
                        <div className="row">
                            {
                                pictures?.slice(0, picturesToShow).map(picture => (
                                    <div key={picture.id} className="col-md-6 mb-2">
                                        <Link to={`/picture/${picture.id}`}>
                                            <div className="card">
                                                <img 
                                                    src={picture.image_path} 
                                                    alt={picture.title}
                                                    className='card-img-top'
                                                    height={300}
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            picturesToShow < pictures.length && 
                                <div className="d-flex justify-content-center my-3">
                                    <button 
                                        onClick={() => loadMorePictures()}
                                        className="btn btn-sm btn-dark">
                                        Load More
                                    </button>
                                </div>
                        }
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header bg-white">
                                <h5 className="text-center mt-2">
                                    <i className="bi bi-filter-circle"></i> Filters
                                </h5>
                            </div>
                            <div className="card-body">
                                <Categories categories={categories} 
                                    categoryId={categoryId}
                                    setPictureExt={setPictureExt}
                                    setCategoryId={setCategoryId} />
                                <hr />
                                <Extensions extensions={extensions}
                                    setCategoryId={setCategoryId}
                                    setPictureExt={setPictureExt}
                                    pictureExt={pictureExt} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
