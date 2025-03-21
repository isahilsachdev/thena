"use client";

import React from 'react'
import UserDetails from '../components/UserDetails'
import Header from '../components/Header'

const UserDetailsPage = () => {
  return (
    <>
    <Header />
    <div className='bg-[#1B1D1E] min-h-screen py-10'>
      <UserDetails />
    </div>
    </>
  )
}

export default UserDetailsPage