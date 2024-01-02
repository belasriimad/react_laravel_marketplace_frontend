import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setCurrentUser, setLoggedInOut, setToken } from '../../redux/slices/userSlice'
import { BASE_URL, getConfig } from '../../helpers/config'
import axios from 'axios'
import { toast } from 'react-toastify'
import SearchBox from '../search/SearchBox'

export default function Header() {
    const { isLoggedIn, user, token} = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const getLoggedInUser = async() => {
            try {
                const response = await axios.get(`${BASE_URL}/user`, 
                    getConfig(token))
                dispatch(setCurrentUser(response.data.user))
            } catch (error) {
                if(error?.response?.status === 401) {
                    dispatch(setLoggedInOut(false))
                    dispatch(setCurrentUser(null))
                    dispatch(setToken(''))
                }
                console.log(error)
            }
        }
        if (token) getLoggedInUser()
    },[token])

    const logoutUser = async() => {
        try {
            const response = await axios.post(`${BASE_URL}/user/logout`, null, 
                getConfig(token))
            dispatch(setLoggedInOut(false))
            dispatch(setCurrentUser(null))
            dispatch(setToken(''))
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">React Stock Images</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                                    aria-current="page" to="/">
                                <i className="bi bi-house"></i> Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
                                    to="/upload">
                                <i className="bi bi-upload"></i> Upload</Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
                                    to="/cart">
                                <i className="bi bi-cart"></i> ({ cartItems.length })</Link>
                            </li>
                            {
                                isLoggedIn ?
                                    <>
                                        <li className="nav-item">
                                            <Link 
                                                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                                to="/profile">
                                            <i className="bi bi-person"></i> { user?.name } </Link>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link border-0 bg-light"
                                                onClick={() => logoutUser()}>
                                            <i className="bi bi-person-fill-down"></i> Logout</button>
                                        </li>
                                    </>
                                :
                                    <>
                                        <li className="nav-item">
                                            <Link 
                                                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                                                to="/register">
                                            <i className="bi bi-person-add"></i> Register</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link 
                                                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                                to="/login">
                                            <i className="bi bi-person-fill-up"></i> Login</Link>
                                        </li>
                                    </>
                            }
                        </ul>
                        <ul className='navbar-nav ml-auto mb-2 mb-lg-0'>
                            <li className='nav-item'>
                                <Link className="nav-link" data-bs-toggle="offcanvas" 
                                    to="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                                    <i className="bi bi-search"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <SearchBox />
        </>
    )
}
