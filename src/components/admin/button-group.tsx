import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ButtonGroupProps {
  userId: string;
}

export function ButtonGroup({ userId }: ButtonGroupProps) {
  const router = useRouter();

  // Handle the "View" button click
  function handleView() {
    router.push(`/admin/members/view/${userId}`);
  }

  // Handle the "Edit" button click
  function handleEdit() {
    router.push(`/admin/members/edit/${userId}`);
  }

  // Function to delete the user
  const deleteUser = async () => {
    if (!userId) return; // Ensure userId is available

    try {
      console.log(`Attempting to delete user with ID: ${userId}`);
      const res = await fetch(`/api/members/${userId}`, {
        method: "DELETE",
      });

      console.log("Response status:", res.status);
      console.log("Response body:", await res.text());

      if (!res.ok) throw new Error(`Failed to delete user. Status: ${res.status}`);

      console.log("User deleted successfully");
     window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle delete action when "Continue" is clicked in the AlertDialog
  const handleDeleteConfirm = async () => {
    await deleteUser(); // Perform deletion
  };

  return (
    <div className="flex gap-1">
      <Button onClick={handleView} variant="outline" className="rounded-l-md bg-green-500">View</Button>
      <Button onClick={handleEdit} variant="outline" className="-ml-px bg-blue-500">Edit</Button>

      {/* Delete AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger className="rounded-lg w-[100px] -ml-px bg-red-500">Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
