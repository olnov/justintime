export interface Student {
  id: string;
  userSchool?: {
    user?: {
      name?: string;
      email?: string;
    };
    school?: {
      name?: string;
    };
    userId?: string;
  };
  gradeLevel?: string;
}

// This is the type for the flattened student data. Used to generate the table view.
export interface FlattenedStudent {
  id: string;
  userId: string;
  name: string;
  school: string;
  email: string;
  gradeLevel: string;
}

// This is the adaptor to transform fromntend data to backend compatible format. Used for updates.
export interface updateStudentPayload {
  id: string;
  gradeLevel: string;
  userData: {
    userId: string; 
    name: string; 
    email: string; 
  }
}