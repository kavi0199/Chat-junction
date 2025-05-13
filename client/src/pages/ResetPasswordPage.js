import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleReset = async (e) => {
    e.preventDefault()

    // Step 2: check if both passwords match
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match")
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reset-password`, {
        userId: location.state._id,
        password: password,
      })

      toast.success(res.data.message)
      if (res.data.success) {
        navigate("/email") // or login page
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <h3 className='text-xl text-center font-semibold'>Reset Your Password</h3>

        <form onSubmit={handleReset} className='grid gap-4 mt-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>New Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter new password'
              className='bg-slate-100 px-2 py-1 focus:outline-blue-500'
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='confirmPassword'>Confirm New Password:</label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
              className='bg-slate-100 px-2 py-1 focus:outline-blue-500'
              required
            />
          </div>

          <button
            type='submit'
            className='bg-blue-500 text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage