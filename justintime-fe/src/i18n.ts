// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "admin_panel": "Admin Panel",
      "not_authenticated": "You are not authenticated",
      "settings": "Settings",
      "logout": "Logout",
      "add_new": "Add New",
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
      "grade_level": "Grade",
      "add_new_teacher": "Add New Teacher",
      "edit": "Edit",
      "delete": "Delete",
      "address": "Address",
      "phone": "Phone",
      // Add new school dialog
      "add_new_school": "Add New School",
      "school_name": "School Name",
      "save": "Save",
      "cancel": "Cancel",
      // Add new user dialog
      "name": "Name",
      "full_name": "Full Name",
      "select_role": "Select Role",
      "add_new_user": "Add New User",
      "password": "Password",
      "confirm_password": "Confirm Password",
      "role": "Role",
      "global_admin": "Global Admin",
      // filtering
      "table_filter": "Enter one of the fields to filter the table",
      // Toaster messages
      "teacher_added": "Teacher added successfully",
      "success": "Success",
      "teacher_deleted": "Teacher deleted successfully",
      "teacher_updated": "Teacher updated successfully",
      "error": "Error",
      "failed_teacher_deletion": "Failed to delete teacher",
      "failed_create_teacher": "Failed to create teacher",
      "failed_update_teacher": "Failed to update teacher",
      "delete_item": "Delete item",
      "delete_item_confirm": "Are you sure you want to delete this item?",
      "user_deleted_successfully": "User deleted successfully",
      "user_delete_failed": "Failed to delete user",

    }
  },
  ru: {
    translation: {
      "admin_panel": "Панель администратора",
      "not_authenticated": "Вы не аутентифицированы",
      "settings": "Настройки",
      "logout": "Выйти",
      "add_new": "Добавить",
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
      "grade_level": "Уровень",
      "add_new_teacher": "Добавить преподавателя",
      "edit": "Изменить",
      "delete": "Удалить",
      "address": "Адрес",
      "phone": "Телефон",
      // Add new school dialog
      "add_new_school": "Добавить новую школу",
      "school_name": "Название школы",
      "save": "Сохранить",
      "cancel": "Отмена",
      // Add new user dialog
      "name": "Имя",
      "full_name": "Полное имя",
      "select_role": "Выберите роль",
      "add_new_user": "Добавить нового пользователя",
      "password": "Пароль",
      "confirm_password": "Подтвердите пароль",
      "role": "Роль",
      "global_admin": "Глобальный администратор",
      // filtering
      "table_filter": "Введите одно из полей для фильтрации таблицы",
      // Toaster messages
      "teacher_added": "Преподаватель успешно добавлен",
      "success": "Успех",
      "teacher_deleted": "Преподаватель успешно удален",
      "teacher_updated": "Преподаватель успешно обновлен",
      "error": "Ошибка",
      "failed_teacher_deletion": "Не удалось удалить преподавателя",
      "failed_create_teacher": "Не удалось создать преподавателя",
      "failed_update_teacher": "Не удалось обновить преподавателя",
      "delete_item": "Удалить элемент",
      "delete_item_confirm": "Вы уверены, что хотите удалить этот элемент?",
      "user_deleted_successfully": "Пользователь успешно удален",
      "user_delete_failed": "Не удалось удалить пользователя",
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
