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

export const createTeacherAdmin = async (
    token:string, 
    name: string, 
    email: string, 
    password: string, 
    schoolId: string, 
    role: string,
    specialization: string,
    rating: number,
    bio: string,
    ) => {
    password = password.normalize("NFC");
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ name, email, password, schoolId, role, specialization, rating, bio }),
    };

    console.log(requestOptions.body)

    const response = await fetch(`${BACKEND_URL}/teachers-admin`, requestOptions);
    console.log(response.status)
    if (!response.ok) {
        return {
            status: response.status,
            error: response.status === 409
              ? "email_already_exists"
              : "failed_create_teacher",
          };
    }

    const data = await response.json();
    return {
        data,
        status: response.status,
    };
}

export const createStudentAdmin = async (
    token:string,
    name: string,
    email: string,
    password: string,
    schoolId: string,
    role: string,
    gradeLevel: string,
    ) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, schoolId, role, gradeLevel }),
    };

    const response = await fetch(`${BACKEND_URL}/students-admin`, requestOptions);
    if (!response.ok) {
        return {
            status: response.status,
            error: response.status === 409
              ? "email_already_exists"
              : "failed_create_student",
          };
    }

    const data = await response.json();
    return {
        data,
        status: response.status,
    };
}

export const generateInvitationLink = async (token:string, schoolId: string, email: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schoolId, email }),
    };

    const response = await fetch(`${BACKEND_URL}/invite`, requestOptions);
    if (!response.ok) {
        return {
            status: response.status,
            error: response.status === 409
                && "link_generation_failed",
            };
    }

    const data = await response.json();
    return {
        data,
        status: response.status,
    };        
}
