// Incoming data from the backend
export interface Teacher {
  id?: number;
  userSchool?: {
    user?: {
      name?: string;
      email?: string;
    };
    userId?: string;
    school?: {
      name?: string;
    };
  };
  specialization?: string;
  bio?: string;
  rating?: number;
}

// This is the type for the flattened teacher data. Used to generate the table view.
export interface FlattenedTeacher {
  id: string;
  userId: string;
  name: string;
  school: string;
  email: string;
  specialisation: string;
  bio: string;
  rating: number;
}

// This is the adaptor to transform fromntend data to backend compatible format. Used for pupdates.
export interface updateTeacherPayload {
    id: string;
    specialization: string;
    bio: string;
    rating: number;
    userData: {
      userId: string; 
      name: string; 
      email: string; 
    }
  }