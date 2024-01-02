import React from 'react'
import ReviewListItem from './ReviewListItem'

export default function ReviewList({picture}) {
    return (
        <ul className='list-group my-5'>
            {
                picture?.reviews.map(review => (
                    <ReviewListItem key={review.id}
                        review={review} /> 
                ))
            }
        </ul>
    )
}
