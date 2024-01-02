import React, { useContext } from 'react'
import { ReviewContext } from './context/reviewContext'
import { Rating } from 'react-simple-star-rating'

export default function AddUpdateReview() {
    const {addReview, review, setReview, updating, handleRating,
        clearReview, updateReview} = useContext(ReviewContext)

    return (
        <div className='row my-5'>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header bg-white text-center">
                        <h5 className="mt-2">
                            {
                                updating ? 'Edit' : 'Add' 
                            }{" "} your review
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => updating ? updateReview(e) : addReview(e)}>
                            <div className="mb-3">
                                <textarea 
                                    name="comment" 
                                    cols="30" 
                                    rows="5"
                                    onChange={(e) => setReview({
                                        ...review, comment: e.target.value
                                    })}   
                                    value={review.comment} 
                                    className='form-control'
                                    placeholder='Review'
                                ></textarea>
                            </div>
                            <div className="mb-2">
                            <Rating
                                initialValue={review.rating}
                                onClick={handleRating}
                                size={32}
                            />
                            </div>
                            <div className="mb-2">
                                {
                                    updating ?
                                            <>
                                                <button className="btn btn-sm btn-warning mx-2">
                                                    Update
                                                </button>
                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => clearReview()}>
                                                    Cancel 
                                                </button>
                                            </>
                                        :
                                            <button className="btn btn-sm btn-primary"
                                                disabled={!review.comment || review.rating === 0}>
                                                Add
                                            </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
