import { Heading, Button } from "@chakra-ui/react";
import TableComponent from "@/components/Table";
import { useState, useEffect } from "react";
import { getStudentsWithSchools, getStudentBySchoolId } from "@/services/StudentService";
import { parseToken } from "@/services/AuthService";

interface Student {
  id: number;
  userSchool?: {
    user?: {
      name?: string;
      email?: string;
    };
    school?: {
      name?: string;
    };
  };
  gradeLevel?: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem("token");


  useEffect(() => {
    // fetchStudentsWithSchools();
    fetchStudentsBySchool();
  }, [isFormOpen]);


  // const fetchStudentsWithSchools = async () => {
  //   if (token) {
  //     const data = await getStudentsWithSchools(token);
  //     setStudents(data);
  //   } else {
  //     throw new Error("You are not authenticated");
  //   }
  // }


  const fetchStudentsBySchool = async () => {
    if (token) {
      const schoolId = parseToken(token).schools[0].id;
      const data = await getStudentBySchoolId(token, schoolId);
      setStudents(data);
    } else {
      throw new Error("You are not authenticated");
    }
  }

  const flattenedSudents = students.map((student: Student) => ({
    id: student.id,
    name: student.userSchool?.user?.name || "N/A",
    school: student.userSchool?.school?.name || "N/A",
    email: student.userSchool?.user?.email || "N/A",
    gradeLevel: student.gradeLevel || "N/A",
  }));
  

  return (
    <>
      <Heading>Students</Heading>
      <TableComponent
        title="Students"
        data={flattenedSudents}
        columns={[
          { key: "name", label: "Student Name", sortable: true },
          { key: "school", label: "School", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "gradeLevel", label: "Grade Level", sortable: true},
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

export default Students;