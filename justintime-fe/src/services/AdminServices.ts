const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createUserAdmin = async (token:string, name: string, email: string, password: string, schoolId: string, role: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, schoolId, role }),
    };

    const response = await fetch(`${BACKEND_URL}/users-admin`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    const data = await response.json();
    return data;
}

export const createTeacherAdmin = async (
    token:string, 
    name: string, 
    email: string, 
    password: string, 
    schoolId: string, 
    role: string,
    specialization: string,
    rating: number,
    bio: string,
    ) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, schoolId, role, specialization, rating, bio }),
    };

    const response = await fetch(`${BACKEND_URL}/teachers-admin`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create teacher");
    }

    const data = await response.json();
    return data;
}

export const createStudentAdmin = async (
    token:string,
    name: string,
    email: string,
    password: string,
    schoolId: string,
    role: string,
    gradeLevel: string,
    ) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, schoolId, role, gradeLevel }),
    };

    const response = await fetch(`${BACKEND_URL}/students-admin`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create student");
    }

    const data = await response.json();
    return data;
}