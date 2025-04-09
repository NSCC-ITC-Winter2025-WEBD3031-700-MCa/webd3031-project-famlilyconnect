import FamilyDetail from '@/components/FamilyDetail'
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Family group Page | Family Connect – Bringing Loved Ones Closer",

  icons: {
    icon: "images/favicon.ico", 
  },
};

const FamilyDetailPage= () => {
  return (
    <FamilyDetail />
  )
}

export default FamilyDetailPage