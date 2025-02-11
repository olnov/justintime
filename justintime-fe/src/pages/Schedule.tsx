import CalendarView from "@/components/CalendarView";
import { parseToken } from "@/services/AuthService";


const Schedule = () => {
    const token = localStorage.getItem("token");
    const schoolId = parseToken(token as string).schools[0].id;

    return (
        <>
            <CalendarView schoolId={schoolId} />
        </>
    );
}

export default Schedule;