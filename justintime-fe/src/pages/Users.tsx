import { getUsers } from "@/services/UserService";
import { useEffect, useState } from "react";
import TableComponent from "@/components/Table";
import { Heading, Button } from "@chakra-ui/react";
import GeneralizedForm from "@/components/NewForm";

const userFields = [
  { label: "Full Name", name: "fullName", placeholder: "John Johnson" },
  { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
  { label: "Password", name: "password", placeholder: "Enter password" },
];

const Users = () => {
  const [users, setUsers] = useState<unknown[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // Manage form visibility
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (token) {
      const data = await getUsers(token);
      console.log("Here in Users.tsx");
      setUsers(data);
    } else {
      throw new Error("You are not authenticated");
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("User Data:", data);
    setUsers((prev) => [...prev, data]); // Add new user to the table
    setIsFormOpen(false); // Close the form
  };

  return (
    <>
      <Heading>Users</Heading>
      <TableComponent
        title="Users"
        data={users}
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "role", label: "Role", sortable: true },
        ]}
        onAdd={() => setIsFormOpen(true)} // Open the form
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
      />
      <GeneralizedForm
        title="Add New User"
        fields={userFields}
        isOpen={isFormOpen} // Control visibility with state
        onClose={() => setIsFormOpen(false)} // Close the form
        onSubmit={handleFormSubmit} // Handle form submission
      />
    </>
  );
};

export default Users;
