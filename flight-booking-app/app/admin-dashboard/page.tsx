"use client";

import React from 'react'
import AdminDashboard from '../components/AdminDashboard'
import Header from '../components/Header'

const AdminDashboardPage = () => {
  return (
    <>
    <Header />
    <div className='bg-[#1B1D1E] min-h-screen py-10'>
      <AdminDashboard />
    </div>
    </>
  )
}

export default AdminDashboardPage