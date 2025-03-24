const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getSchools = async (token:string, skip?:number, take?:number) => {
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

    const url = `${BACKEND_URL}/schools${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch schools");
    }

    const data = await response.json();
    return data;
}

export const createSchool = async (token:string, name: string, address: string, phone: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name, address, phone })
    };
    const response = await fetch(`${BACKEND_URL}/schools`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to create school");
    }

    const data = await response.json();
    return data;
}

export const deleteSchool = async (token:string, id: string) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/schools/${id}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to delete school");
    }

    const data = await response.json();
    return data;
}