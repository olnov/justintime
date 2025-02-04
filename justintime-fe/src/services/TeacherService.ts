const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createTeacher = async (token:string, userSchoolId: string ) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userSchoolId, specialization: "", bio: "", rating: 0.0 })
    };
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