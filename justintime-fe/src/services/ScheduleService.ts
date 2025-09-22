import { APILesson } from "@/types/transformation.types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const bookLesson = async (token: string, lesson: APILesson) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(lesson)
    };

    const response = await fetch(`${BACKEND_URL}/appointments`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        const error = data.message
            ? Array.isArray(data.message)
                ? data.message.join(", ")
                : data.message
            : response.statusText;
        throw new Error(error);
    }

    return data;
};

export const updateBooking = async (token: string, lessonId: string, lesson: APILesson) => {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(lesson)
    };
    const response = await fetch(`${BACKEND_URL}/appointments/${lessonId}`, requestOptions);
    const data = await response.json();
    
    if (!response.ok) {
        const error = data.message
            ? Array.isArray(data.message)
                ? data.message.join(", ")
                : data.message
            : response.statusText;
        throw new Error(error);
    }

    return data;
};


export const getScheduleBySchoolId = async (token: string, userSchoolId: string) => {
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

export const getScheduleBySchooIdAndTeacherId = async (token: string, schoolId: string, teacherId: string) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch(`${BACKEND_URL}/appointments/school/${schoolId}/teacher/${teacherId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to fetch schedule");
    }

    const data = await response.json();
    return data;

}

export const deleteLesson = async (token: string,lessonId: string) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await fetch(`${BACKEND_URL}/appointments/${lessonId}`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to delete lesson");
    }
    const data = await response.json();
    return data;
}
