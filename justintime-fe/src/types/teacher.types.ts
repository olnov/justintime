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