"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ButtonGroup } from "@/components/admin/button-group"
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import PagenationComponent from "@/components/admin/pagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserTable() {

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/members');
        const data = await res.json();
        console.log("Fetched users:", data); 
        setUsers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="w-full">
      {/* Container for search input and table */}
      <div className="mb-5">
        <Input 
          type="text" 
          placeholder="Search members" 
          className="w-[250px]" 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium hidden">{user.id}</TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="font-medium">{user.role}</TableCell>
              <TableCell className="font-medium">
                <ButtonGroup userId={user.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableCell colSpan={4}>
              <PagenationComponent />
              <div className="text-sm text-gray-500 items-center flex justify-center mt-2">
                Showing {filteredMembers.length} of {users.length} members
              </div>
            </TableCell>
        </TableFooter>
      </Table>
    </div>
  );
}
