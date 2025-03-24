import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ButtonGroup } from "@/components/admin/button-group"

const members = [
  {
    name: "John Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
    role: "User"
  },
 
]

export default function MemberTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.email}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.username}</TableCell>
            <TableCell className="text-right">{member.email}</TableCell>
            <TableCell className="text-right">{member.role}</TableCell>
            <TableCell className="text-right"><ButtonGroup /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
  )
}
