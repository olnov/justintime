import { updateStudentPayload } from "@/types/student.types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getStudents = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/students`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }

    const data = await response.json();
    return data;
}

export const createStudent = async (token:string, userSchoolId: string, gradeLevel?: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userSchoolId, gradeLevel: gradeLevel || "" })
    };
    const response = await fetch(`${BACKEND_URL}/students`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create student");
    }

    const data = await response.json();
    return data;
}

export const getStudentsWithSchools = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/students/allWithSchool`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch students with schools");
    }

    const data = await response.json();
    return data;
}

export const getStudentBySchoolId = async (token:string, userSchoolId: string, skip?: number, take?: number) => {
    const queryParams = new URLSearchParams();
    if (skip !== undefined ) queryParams.append('skip', skip.toString());
    if (take !== undefined ) queryParams.append('take', take.toString());

    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    
    const url = `${BACKEND_URL}/students/allBySchool/${userSchoolId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, requestOptions);
    // const response = await fetch(`${BACKEND_URL}/students/allBySchool/${userSchoolId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch students by school");
    }

    const data = await response.json();
    return data;
}

export const updateStudent = async (token:string, student: updateStudentPayload) => {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(student)
    };
    const response = await fetch(`${BACKEND_URL}/students/`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to update student");
    }

    const data = await response.json();
    return data;
}

export const deleteStudent = async (token:string, studentId: string) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
    }
  };
    const response = await fetch(`${BACKEND_URL}/students/${studentId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to delete student");
    }
}