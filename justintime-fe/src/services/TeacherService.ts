import { updateTeacherPayload } from "@/types/teacher.types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createTeacher = async (token:string, userSchoolId: string, specialization?: string, bio?: string, rating?: number ) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userSchoolId, specialization: specialization || "", bio: bio || "", rating: rating || 0.0 })
    };
    console.log(requestOptions);
    const response = await fetch(`${BACKEND_URL}/teachers`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create teacher");
    }

    const data = await response.json();
    return data;
}

export const getTeachers = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/teachers`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch teachers");
    }

    const data = await response.json();
    return data;
}

export const getTeachersWithSchools = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/teachers/allWithSchool`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch teachers with schools");
    }

    const data = await response.json();
    return data;
}

export const getTeacherBySchoolId = async (token:string, userSchoolId: string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/teachers/allBySchool/${userSchoolId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch teacher");
    }

    const data = await response.json();
    return data;
}

export const deleteTeacher = async (token:string, teacherId: string) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/teachers/${teacherId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to delete teacher");
    }

    const data = await response.json();
    return data;
}

export const updateTeacher = async (token:string, updateTeacherPayload: updateTeacherPayload ) => {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(updateTeacherPayload)
    };
    const response = await fetch(`${BACKEND_URL}/teachers/`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to update teacher");
    }

    const data = await response.json();
    return data;
}
