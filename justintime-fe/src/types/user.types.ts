export interface UserSchool {
    id: string;
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


export interface UserToken {
    id: string;
    username: string;
    email: string;
    isGlobalAdmin: boolean;
    schools: UserSchool[];
    iat: number;
    exp: number;
}

export interface FlattenedUser {
    id: string; 
    name: string;
    email: string;
    isGlobalAdmin: boolean;
    school: string [];
    role: string [];
}

// TBD: Need to reconcile with the UserToken interface
export interface RawUser {
    id: string;
    username: string;
    email: string;
    isGlobalAdmin: boolean;
    schools: [{
        id: string;
        name: string;
        userSchoolId: string;
        roles: string[]; 
    }]
    iat: number;
    exp: number;
}
  
