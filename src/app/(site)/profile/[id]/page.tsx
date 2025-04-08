import Breadcrumb from '@/components/Common/Breadcrumb'
import Profile from '@/components/Profile';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title:
    "Profile Page",
  description: "This is Profile page description",
  icons: {
    icon: "images/favicon.ico",
  },
};

const ProfilePage = () => {
  return (
    <>
    <Breadcrumb pageName="Profile Page" />
    <Profile />
  </>
  )
}

export default ProfilePage