const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getUsers = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/users`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
}

export const createUser = async (name: string, email: string, password: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, isGlobalAdmin: false }),
    };

    const response = await fetch(`${BACKEND_URL}/users`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create user");
    } else {
        const data = await response.json();
        return data;
    }
}

export const getUsersWithDetails = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/users/allWithDetails`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch users with details");
    }

    const data = await response.json();
    return data;
}