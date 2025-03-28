// This is the adaptor to transform fromntend data to backend compatible format.
export interface APILesson {
    id?: string;
    teacherId: string;
    studentId: string;
    schoolId: string;
    startTime: Date;
    endTime: Date;
    status: string;
}
