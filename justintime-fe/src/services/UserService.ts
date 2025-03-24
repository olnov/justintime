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

export const createUser = async (token: string, name: string, email: string, password: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
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

export const getUsersWithDetails = async (token: string, skip?: number, take?: number) => {
    const queryParams = new URLSearchParams();
    if (skip !== undefined) queryParams.append('skip', skip.toString());
    if (take !== undefined) queryParams.append('take', take.toString());
    
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    };
  
    const url = `${BACKEND_URL}/users/allWithDetails${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch users with details");
    }
  
    const data = await response.json();
    return data;
  }
  

export const deleteUser = async (token:string, userId: string) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/users/${userId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    const data = await response.json();
    return data;
}
