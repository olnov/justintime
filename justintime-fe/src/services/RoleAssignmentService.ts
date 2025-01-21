const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getRoleAssignments = async (token:string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/role-assignment`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch role assignments");
    }

    const data = await response.json();
    return data;
}

export const createRoleAssignment = async (token:string, userSchoolId: string, role: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userSchoolId, role })
    };
    const response = await fetch(`${BACKEND_URL}/role-assignment`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create role assignment");
    }

    const data = await response.json();
    return data;
}