import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      debts: "Debts",
      contacts: "Contacts",
      folders: "Folders",
      users: "Users",
      profile: "Profile",
      welcome: "Welcome",
      add_debt: "Add Debt",
      logout: "Logout",
      settings: "Settings",
      support: "Support",
      privacy: "Privacy Center",
      theme_mode: "Theme Mode",
      light: "Light",
      dark: "Dark",
      auto: "Auto",
      view_profile: "View profile",
      search: "Search folders, contacts, debts…",
      main_menu: "Main Menu"
    }
  },
  ru: {
    translation: {
      dashboard: "Главная",
      debts: "Долги",
      contacts: "Контакты",
      folders: "Папки",
      users: "Пользователи",
      profile: "Профиль",
      welcome: "Добро пожаловать",
      add_debt: "Добавить долг",
      logout: "Выйти",
      settings: "Настройки",
      support: "Поддержка",
      privacy: "Конфиденциальность",
      theme_mode: "Тема",
      light: "Светлая",
      dark: "Темная",
      auto: "Авто",
      view_profile: "Посмотреть профиль",
      search: "Поиск папок, контактов, долгов…",
      main_menu: "Главное Меню"
    }
  },
  tg: {
    translation: {
      dashboard: "Асосӣ",
      debts: "Қарзҳо",
      contacts: "Тамосҳо",
      folders: "Папкаҳо",
      users: "Истифодабарандагон",
      profile: "Профил",
      welcome: "Хуш омадед",
      add_debt: "Иловаи қарз",
      logout: "Баромад",
      settings: "Танзимот",
      support: "Дастгирӣ",
      privacy: "Маркази махфият",
      theme_mode: "Мавзӯъ",
      light: "Равшан",
      dark: "Торик",
      auto: "Автоматӣ",
      view_profile: "Дидани профил",
      search: "Ҷустуҷӯи папкаҳо, тамосҳо, қарзҳо…",
      main_menu: "Менюи Асосӣ"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
