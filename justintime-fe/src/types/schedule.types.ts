export interface RawScheduleItem {
    id: string;
    teacher: {
      id: string;
      userSchool: {
        user: {
          name: string;
        };
      };
    };
    student: {
      id: string;
      userSchool: {
        user: {
          name: string;
        };
      };
    };
    startTime: string;
    endTime: string;
    status: string;
  }
  