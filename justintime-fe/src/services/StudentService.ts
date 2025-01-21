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

export const createStudent = async (token:string, userSchoolId: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userSchoolId, gradeLevel: "" })
    };
    const response = await fetch(`${BACKEND_URL}/students`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create student");
    }

    const data = await response.json();
    return data;
}