const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createUserSchool = async (token:string, userId: string, schoolId: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userId, schoolId })
    };
    const response = await fetch(`${BACKEND_URL}/user-school`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create a user school relation");
    }

    const data = await response.json();
    return data;
}

export const getUserSchools = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/user-school`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch user schools");
    }

    const data = await response.json();
    return data;
}