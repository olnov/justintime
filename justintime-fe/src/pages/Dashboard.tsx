import { Box, Card, HStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getScheduleBySchoolId } from "@/services/ScheduleService";
import { parseToken } from "@/services/AuthService";
import { Chart } from "react-google-charts";
import { useTranslation } from 'react-i18next';
import { Lesson } from "@/types/lesson.types";

const Dashboard = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const token = localStorage.getItem("token");
    const schoolName = parseToken(localStorage.getItem("token") as string).schools.map((sName: { name: string; }) => sName.name).join(", ");
    const { t } = useTranslation();

    useEffect(() => {
        fetchScheduleBySchoolId();
    },[]);

    const fetchScheduleBySchoolId = async () => {
        if (!token) {
            throw new Error("You are not authenticated");
        }
        const schoolId = parseToken(token).schools[0].id;
        const data = await getScheduleBySchoolId(token, schoolId);
        console.log("Schedule Data:", data);
        setLessons(data);
    };

    
    const scheduledLessons = lessons.filter((lesson) => lesson.status === "scheduled").length;
    const cancelledLessons = lessons.filter((lesson) => lesson.status === "cancelled").length;
    const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
    const totalLessons = scheduledLessons + cancelledLessons + completedLessons;

    const data = [
        ["Total lessons", "Cancelled lessons"],
        ["Total", totalLessons],
        ["Cancelled", cancelledLessons],
    ];

    const options = {
        pieHole: 0.4,
        is3D: false,
        chartArea: { width: '100%', height: '80%' },
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: {
                color: "#000",
                fontSize: 16,
            },
        }
    };

    return (
        <>
            <Box alignItems={"center"} justifyContent="center" display="flex" flexDirection="column">
                <Text fontSize="3xl">{t('welcome')} {schoolName}</Text>
                <HStack mt={4} gap="4" justifyContent="center" alignItems="center">
                <Card.Root width="30vw" height="60vh" alignItems="center" justifyContent="center">
                        <Card.Body gap="2">
                            <Card.Title mt="2">{t('school_stats')}</Card.Title>
                            <Card.Description>
                                <Box as="ul" listStyleType="circle" paddingLeft="0">
                                    <li>
                                    <Text fontSize="">You have {scheduledLessons} non confirmed lessons</Text>
                                    </li>
                                    <li>
                                    <Text fontSize="">You have {completedLessons} completed lessons</Text>
                                    </li>
                                </Box>
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root width="30vw" height="60vh" alignItems="center" justifyContent="center">
                        <Card.Body gap="2">
                            <Card.Title mt="2">{t('attendance_stats')}</Card.Title>
                            <Card.Description>
                                <Text fontSize="">Total number of booked lessons vs cancelled</Text>
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height="40vh"
                                    data={data}
                                    options={options}
                                />
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                </HStack>
            </Box>
        </>
    );
};

export default Dashboard;