import { APILesson } from "@/types/transformation.types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const bookLesson = async (token:string, lesson: APILesson) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(lesson)
    };
    const response = await fetch(`${BACKEND_URL}/appointments`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to book lesson");
    }

    const data = await response.json();
    return data;

};


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