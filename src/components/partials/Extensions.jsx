import React from 'react'

export default function Extensions({extensions, setPictureExt, pictureExt, setCategoryId}) {
  return (
    <>
        <h6>
            {
                pictureExt && <span
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                        setCategoryId('')
                        setPictureExt('')
                    }}
                    className="text-capitalize text-danger fw-bold mx-1">
                    All
                </span>
            }
            Extensions
        </h6>
        <ul className="list-group">
            {
                extensions?.map((item, index) => (
                    <li key={index} className="list-group-item border-0">
                        <div className="form-check flex-grow-1">
                            <input type="radio" 
                                className="form-check-input"
                                value={item.ext}
                                name='ext'
                                onChange={(e) => {
                                    setCategoryId('')
                                    setPictureExt(e.target.value)
                                }}
                                checked={ item.ext == pictureExt }
                                id={index} />
                            <label htmlFor={index} 
                                className='form-check-label'>
                                    { item.ext }
                            </label>
                        </div>
                    </li>
                ))
            }
        </ul>
    </>
  )
}
