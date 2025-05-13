import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { PiLockKey } from 'react-icons/pi'

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  const handleVerify = async (e) => {
    e.preventDefault()
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`

    try {
      const res = await axios.post(URL, {
        email: location.state.email,
        otp
      })

      toast.success(res.data.message)
      if (res.data.success) {
        navigate("/reset-password", { state: res.data.user })
      }

    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2'>
          <PiLockKey size={80} />
        </div>

        <h3 className='text-xl text-center font-semibold'>OTP Verification</h3>

        <form onSubmit={handleVerify} className='grid gap-4 mt-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='otp'>Enter OTP:</label>
            <input
              type='text'
              id='otp'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='6-digit OTP'
              className='bg-slate-100 px-2 py-1 focus:outline-blue-500'
              required
            />
          </div>

          <button
            type='submit'
            className='bg-blue-500 text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtpPage