import { Button } from "@/components/ui/button";

export function ButtonGroup() {
  return (
    <div className="flex gap-1">
      <Button variant="outline" className="rounded-l-md bg-green-500">View</Button>
      <Button variant="outline" className="-ml-px bg-blue-500">Edit</Button>
      <Button variant="outline" className="rounded-r-md -ml-px bg-red-500">Delete</Button>
    </div>
  );
}
