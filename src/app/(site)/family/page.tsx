
import ManageFamily from '@/components/ManageFamily'
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Family Page | Family Connect – Bringing Loved Ones Closer",
  icons: {
    icon: "images/favicon.ico", 
  },
};

const FamilyPage = () => {
  return (
    <div>
      <ManageFamily />
    </div>
  )
}

export default FamilyPage