// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "bookLesson": "Book a Lesson",
      "teachers": "Teachers",
      "students": "Students",
      "teacher": "Teacher",
      "student": "Student",
      "schedule": "Schedule",
      "profile": "Profile",
      "users": "Users",
      "schools": "Schools",
      "teacher_name": "Teacher Name",
      "student_name": "Student Name",
      "school": "School",
      "email": "Email",
      "specialization": "Specialization",
      "bio": "Bio",
      "rating": "Rating",
      "actions": "Actions",
      "gradeLevel": "Grade Level",
      "add_new_teacher": "Add New Teacher",
      "edit": "Edit",
      "delete": "Delete",
      // Add more keys as needed
    }
  },
  ru: {
    translation: {
      "welcome": "Добро пожаловать",
      "bookLesson": "Записаться на урок",
      "teachers": "Преподаватели",
      "students": "Студенты",
      "teacher": "Преподаватель",
      "student": "Студент",
      "schedule": "Расписание",
      "profile": "Профиль",
      "users": "Пользователи",
      "schools": "Школы",
      "teacher_name": "Преподаватель",
      "student_name": "Имя Студента",
      "school": "Школа",
      "email": "Электронная почта",
      "specialization": "Специализация",
      "bio": "Биография",
      "rating": "Рейтинг",
      "actions": "Действия",
      "gradeLevel": "Уровень Класса",
      "add_new_teacher": "Добавить преподавателя",
      "edit": "Редактировать",
      "delete": "Удалить",
      // Add more keys as needed
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
