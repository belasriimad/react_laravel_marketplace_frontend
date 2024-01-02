import { PaymentElement } from "@stripe/react-stripe-js"
import { useState } from "react"
import { useStripe, useElements } from "@stripe/react-stripe-js"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BASE_URL, getConfig } from "../../helpers/config"
import axios from "axios"
import { clearCartItems } from "../../redux/slices/cartSlice"
import { setCurrentUser } from "../../redux/slices/userSlice"
import { toast } from "react-toastify"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { cartItems } = useSelector(state => state.cart)
  const { token, user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const placeOrder = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/store/order`,
        {
            pictures: cartItems,
            user_id: user?.id
        }, getConfig(token))
        dispatch(clearCartItems())
        dispatch(setCurrentUser(response.data.user))
        setIsProcessing(false)
        toast.success('Payment done successfully.', {
            position: toast.POSITION.TOP_RIGHT
        })
        navigate('/profile')
    } catch (error) {
        setIsProcessing(false)
        console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsProcessing(true)

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
      },
      redirect: "if_required",
    })

    if (
      (response.error && response.error.type === "card_error") ||
      (response.error && response.error.type === "validation_error")
    ) {
      setMessage(response.error.message)
    } else if (response.paymentIntent.id) {
      //store the order
      placeOrder()
    }

    setIsProcessing(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}
