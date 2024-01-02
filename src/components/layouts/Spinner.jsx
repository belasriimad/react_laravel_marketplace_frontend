import React from 'react'

export default function Spinner() {
    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
