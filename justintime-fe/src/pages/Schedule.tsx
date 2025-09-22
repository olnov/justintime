import { parseToken } from "@/services/AuthService";
import { lazy, Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
const CalendarView = lazy(() => import("@/components/calendar-view/CalendarView"));


const Schedule = () => {
    const token = localStorage.getItem("token");
    const schoolId = parseToken(token as string).schools[0].id;

    return (
        <>
            <Suspense
                fallback={
                    <Center h="80vh">
                        <Spinner size="xl" color="blue.500" />
                    </Center>
                }
            >
                <CalendarView schoolId={schoolId} />
            </Suspense>
        </>
    );
}

export default Schedule;