export interface Teacher {
  id?: number;
  userSchool?: {
    user?: {
      name?: string;
      email?: string;
    };
    school?: {
      name?: string;
    };
  };
  specialization?: string;
  bio?: string;
  rating?: number;
}

export interface FlattenedTeacher {
  id: number;
  name: string;
  school: string;
  email: string;
  specialisation: string;
  bio: string;
  rating: number;
}
