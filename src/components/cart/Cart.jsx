import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart } from '../../redux/slices/cartSlice'
import { Link } from 'react-router-dom'
import useTitle from '../custom/useTitle'

export default function Cart() {
    const { cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()
    
    useTitle('Cart')

    return (
        <div className='container'>
            <div className="row my-5">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            {
                                !cartItems.length ? 
                                    <div className="alert alert-info col-md-4 mx-auto mt-2">
                                        Your cart is empty!
                                    </div>
                                :
                                <div>
                                    <table className="table table-responsive">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Picture</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{ index += 1 }</td>
                                                        <td>
                                                        <img src={item.image} 
                                                                alt={item.title} 
                                                                className='img-fluid rounded'  
                                                                width={60}
                                                                height={60}  
                                                            />
                                                        </td>
                                                        <td>{ item.title }</td>
                                                        <td className='fw-bold'>${ item.price }</td>
                                                        <td>
                                                            <i className="bi bi-bag-x text-danger"
                                                                style={{cursor: 'pointer'}}    
                                                                onClick={() => dispatch(removeFromCart(item))}
                                                            ></i>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            <tr>
                                                <td colSpan={4} className='text-center fw-bold'>
                                                    Total
                                                </td>
                                                <td colSpan={5} className='text-center fw-bold'>
                                                    <span className="border border-dark text-danger rounded p-1 fw-bold">
                                                        ${
                                                            cartItems.reduce((acc, item) => acc += item.price, 0)
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-end align-items-center">
                                        <Link to="/checkout" 
                                            className='btn btn-primary rounded-0'>
                                            Checkout
                                        </Link>
                                        <Link to="/" 
                                            className='btn btn-dark rounded-0 mx-1'>
                                            Continue shopping
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
