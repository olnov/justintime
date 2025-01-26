import { Heading, Button } from "@chakra-ui/react";
import TableComponent from "@/components/Table";
import { useState, useEffect } from "react";
import { getTeachersWithSchools } from "@/services/TeacherService";

const Teachers = () => {
  const [teachers, setTeachers] = useState<unknown[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem("token");


  useEffect(() => {
    fetchTeachersWithSchools();
  }, []);


  const fetchTeachersWithSchools = async () => {
    if (token) {
      const data = await getTeachersWithSchools(token);
      setTeachers(data);
    } else {
      throw new Error("You are not authenticated");
    }
  }


  const flattenedTeachers = teachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.userSchool?.user?.name || "N/A",
    school: teacher.userSchool?.school?.name || "N/A",
    email: teacher.userSchool?.user?.email || "N/A",
    specialisation: teacher.specialization || "N/A",
    bio: teacher.bio || "N/A",
    rating: teacher.rating || 0,
  }));
  

  return (
    <>
      <Heading>Teachers</Heading>
      <TableComponent
        title="Teachers"
        data={flattenedTeachers}
        columns={[
          { key: "name", label: "Teacher Name", sortable: true },
          { key: "school", label: "School", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "specialisation", label: "Specialisation", sortable: true },
          { key: "bio", label: "Bio", sortable: true },
          { key: "rating", label: "Rating", sortable: true},
        ]}
        onAdd={() => setIsFormOpen(true)}
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
      />
    </>
  );
};

export default Teachers;