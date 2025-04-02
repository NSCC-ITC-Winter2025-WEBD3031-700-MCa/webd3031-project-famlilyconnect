import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
interface ButtonGroupProps {
  userId: string
}

export function ButtonGroup({ userId }: { userId: string}) {
    const router = useRouter();

    function handleView(){
      router.push(`/admin/members/view/${userId}`)  
    }

    function handleEdit(){
      router.push(`/admin/members/edit/${userId}`)
    }
  return (
    <div className="flex gap-1">
      <Button onClick={handleView} variant="outline" className="rounded-l-md bg-green-500">View</Button>
      <Button onClick={handleEdit} variant="outline" className="-ml-px bg-blue-500">Edit</Button>
      <Button variant="outline" className="rounded-r-md -ml-px bg-red-500">Delete</Button>
    </div>
  );
}
