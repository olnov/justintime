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