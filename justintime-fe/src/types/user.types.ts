export interface UserSchool {
    school: { name: string };
    roles: { role: string }[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    isGlobalAdmin: boolean;
    UserSchools: UserSchool[];
}