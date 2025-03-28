import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react'
interface ButtonGroupProps {
  userId: string
}

export function ButtonGroup({ userId }: { userId: string}) {
  const [user, setUser] = useState<{ name: string; email: string; id: string; role: string; } | null>(null)
  
  async function handleViewClick() {
    try{
      const res = await fetch(`/api/members/${userId}`)
      const data = await res.json();
      setUser(data)
    }catch(error){
      console.error("Error fetching user:", error)
    }
  }
  return (
    <div className="flex gap-1">
      <Button onClick={handleViewClick} variant="outline" className="rounded-l-md bg-green-500">View</Button>
      <Button variant="outline" className="-ml-px bg-blue-500">Edit</Button>
      <Button variant="outline" className="rounded-r-md -ml-px bg-red-500">Delete</Button>

      {user && (
        <div className="modal">
          <h1>{user.name}</h1>
          <p>{user.id}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      )}
    </div>
  );
}
