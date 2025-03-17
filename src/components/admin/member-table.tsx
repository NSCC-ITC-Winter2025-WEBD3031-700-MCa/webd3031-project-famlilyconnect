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
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "JohnDoe123",
    email: "johndoe@email.com",
  },
]

export default function MemberTable() {
  return (
    <Table>
      {/* <TableCaption>A list of your recent members.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.email}>
            <TableCell className="font-medium">{member.firstName}</TableCell>
            <TableCell>{member.lastName}</TableCell>
            <TableCell>{member.username}</TableCell>
            <TableCell className="text-right">{member.email}</TableCell>
            <TableCell className="text-right"><ButtonGroup /></TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
  )
}
