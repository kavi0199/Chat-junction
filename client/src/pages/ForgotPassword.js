import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { PiLockKey } from "react-icons/pi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const URL =`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`

    try {
      const response = await axios.post(URL, { email })

      toast.success(response.data.message)

      // agar success mila toh aage badhe
      if (response.data.success) {
        navigate('/verify-otp', {
          state: { email: email }
        })
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2'>
          <PiLockKey size={80} />
        </div>

        <h3 className='text-xl text-center font-semibold'>Forgot Password</h3>

        <form onSubmit={handleSubmit} className='grid gap-4 mt-4'>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email address:</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your registered email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='bg-blue-500 text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Send OTP
          </button>
        </form>

        <p className='my-3 text-center'>
          Remember your password? <a href="/email" className='hover:text-primary font-semibold'>Login</a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage