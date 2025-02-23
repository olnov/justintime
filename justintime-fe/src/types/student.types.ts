export interface Student {
  id: number;
  userSchool?: {
    user?: {
      name?: string;
      email?: string;
    };
    school?: {
      name?: string;
    };
  };
  gradeLevel?: string;
}