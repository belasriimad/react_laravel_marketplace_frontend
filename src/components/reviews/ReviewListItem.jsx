import React, { useContext } from 'react'
import { Rating } from 'react-simple-star-rating'
import { ReviewContext } from './context/reviewContext'
import { useSelector } from 'react-redux'

export default function ReviewListItem({review}) {
    const { user } = useSelector(state => state.user)
    const { editReview, deleteReview } = useContext(ReviewContext)

    const renderReviewActions = () => (
        review?.user_id === user?.id && 
            <div className="dropdown ms-auto">
                <i className="bi bi-three-dots-vertical"
                    data-bs-toggle="dropdown"></i>
                <ul className="dropdown-menu">
                    <li>
                        <span className="dropdown-item"
                            style={{cursor: 'pointer'}}  
                            onClick={() => editReview(review)}  
                        >
                            <i className="bi bi-pen mx-2"></i> Update
                        </span>
                    </li>
                    <li>
                        <span className="dropdown-item"
                            style={{cursor: 'pointer'}}  
                            onClick={() => deleteReview(review)}  
                        >
                            <i className="bi bi-trash mx-2"></i> Delete
                        </span>
                    </li>
                </ul>
            </div>
    )

    return (
        <li className='list-group-item bg-light d-flex justify-content-start align-items-center'>
            <div className="me-2">
                <img src={review?.user?.image_path} 
                    alt="user image"
                    className='rounded-circle' 
                    width={60}
                    height={60}
                />
            </div>
            <div className="d-flex flex-column">
                <p className="m-0">
                    <i>{review?.comment}</i>
                </p>
                <Rating
                    initialValue={review?.rating}
                    readonly size={24}
                />
                <span className="text-muted">
                    { review?.created_at } by <span className="fw-bold">
                        {review?.user?.name}
                    </span>
                </span>
            </div>
            {
                renderReviewActions()
            }
        </li>
    )
}
