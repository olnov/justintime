import { Email } from '../types/email.types';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const sendEmail = async(token: string, email: Email) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(email)
    };
    const response = await fetch(`${BACKEND_URL}/mail-notifier`, requestOptions);
    if (!response.ok) {
        throw new Error("Failed to send email");
    }

    const data = await response.json();
    return data;
}