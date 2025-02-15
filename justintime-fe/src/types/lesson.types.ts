// Define lesson structure
export interface Lesson {
    id: string;
    teacher: {
      id?: string;
      name: string;
    };
    student: string;
    school: string;
    subject: string;
    start: Date;
    end: Date;
    status: string;
  }