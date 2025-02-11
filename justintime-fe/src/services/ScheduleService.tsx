const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getScheduleBySchoolId = async (token:string, userSchoolId: string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        }
    };
    const response = await fetch(`${BACKEND_URL}/appointments/school/${userSchoolId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch schedule");
    }

    const data = await response.json();
    return data;

};