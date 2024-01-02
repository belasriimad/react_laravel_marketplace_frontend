import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BASE_URL } from '../../helpers/config'
import { setCurrentUser, setLoggedInOut, setToken } from '../../redux/slices/userSlice'
import useTitle from '../custom/useTitle'

export default function Login() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [errors,setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useTitle('Login')

  useEffect(() => {
    if(isLoggedIn) navigate('/')
  }, [isLoggedIn, navigate])


  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErrors([])
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, user)
      setLoading(false)
      if(!response.data.error) {
        dispatch(setLoggedInOut(true))
        dispatch(setCurrentUser(response.data.user))
        dispatch(setToken(response.data.access_token))
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        })
        navigate('/')
      }else {
        toast.error(response.data.error, {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    } catch (error) {
      setLoading(false)
      if(error?.response?.status === 422) {
          setErrors(error.response.data.errors)
      }
      console.log(error)
    }
  }


  return (
    <div className='container'>
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="text-center mt-2">
                Login
              </h5>
            </div>
            <div className="card-body">
              <form className="mt-5" onSubmit={(e) => loginUser(e)}>
                <div className="mb-3">
                  <label htmlFor="email" 
                      className='form-label'>Email*</label>
                  <input type="email" name="email" id="email"
                      className='form-control'
                      onChange={(e) => setUser({
                          ...user, email: e.target.value
                      })}
                  />
                  { useValidation(errors, 'email')}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" 
                      className='form-label'>Password*</label>
                  <input type="password" name="password" id="password"
                      className='form-control'
                      onChange={(e) => setUser({
                          ...user, password: e.target.value
                      })}
                  />
                  { useValidation(errors, 'password')}
                </div>
                <div className="mb-3">
                      {
                          loading ?
                              <Spinner />
                          :
                          <button type="submit"
                              className='btn btn-sm btn-dark'>
                              Submit
                          </button>
                      }
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
