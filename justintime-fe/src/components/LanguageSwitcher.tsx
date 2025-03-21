import { useTranslation } from "react-i18next";
import { Select, createListCollection } from "@chakra-ui/react";
import { useState } from "react";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);
  const languageSettings = localStorage.getItem("language");
  const [selectedLabel, setSelectedLabel] = useState<string>(languageSettings === "ru" ? "РУС" : "EN");

  // const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   i18n.changeLanguage(event.target.value);
  // };

  const changeLanguage = (language: { label: string, value: string }) => {
    console.log(selectedLanguage);
    i18n.changeLanguage(language.value);
    setSelectedLanguage(language.value);
    localStorage.setItem("language", language.value);
    setSelectedLabel(language.label);
  };

  const languages = createListCollection({
    items: [
      { label: "EN", value: "en" },
      { label: "РУС", value: "ru" },
    ]
  });

  return (
    <>
      <Select.Root collection={languages} size={"md"} variant={"outline"} colorScheme="primary">
        <Select.Trigger>
          <Select.ValueText placeholder={selectedLabel}/>
        </Select.Trigger>
        <Select.Content>
          {languages.items.map((language) => (
            <Select.Item item={language} key={language.value} onClick={() => changeLanguage(language)}>
              {language.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
    // <select onChange={changeLanguage} value={i18n.language}>
    //   <option value="en">English</option>
    //   <option value="ru">Русский</option>
    // </select>
  );
};

export default LanguageSwitcher;
