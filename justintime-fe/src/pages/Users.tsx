import { getUsers } from "@/services/UserService";
import { useEffect, useState } from "react";
import TableComponent from "@/components/Table";
import { Heading, Button } from "@chakra-ui/react";
import GeneralizedForm from "@/components/NewForm";

const userFields = [
  { label: "First Name", name: "firstName", placeholder: "Enter first name" },
  { label: "Last Name", name: "lastName", placeholder: "Enter last name" },
  { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
];

const Users = () => {
  const [users, setUsers] = useState<unknown[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility
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

  const handleAddUser = () => {
    setIsFormOpen(true); // Show the form when "Add User" is clicked
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("User Data:", data);
    setIsFormOpen(false); // Close the form after submission
    // Optionally, add the new user to the `users` list
    setUsers((prev) => [...prev, data]);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false); // Close the form when canceled
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
        onAdd={handleAddUser} // Trigger the form display
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
      />
      {isFormOpen && (
        <GeneralizedForm
          title="Add New User"
          fields={userFields}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
};

export default Users;
