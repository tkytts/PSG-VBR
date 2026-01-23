import React from "react";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import languages from "../constants/languages";

const formatOptionLabel = ({ countryCode, label }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <ReactCountryFlag countryCode={countryCode} svg style={{ width: "1.5em", height: "1.5em" }} />
    <span>{label}</span>
  </span>
);

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || localStorage.getItem("language") || languages[0].value;

  const handleLanguageChange = (selected) => {
    i18n.changeLanguage(selected.value);
    localStorage.setItem("language", selected.value);
  };

  return (
    <div style={{ minWidth: 170 }}>
      <Select
        options={languages}
        value={languages.find((l) => l.value === currentLang)}
        onChange={handleLanguageChange}
        formatOptionLabel={formatOptionLabel}
        isSearchable={false}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: 32,
            fontSize: "1.1em"
          }),
          valueContainer: (base) => ({
            ...base,
            padding: "0 8px"
          }),
          dropdownIndicator: (base) => ({
            ...base,
            padding: 4
          }),
          option: (base, state) => ({
            ...base,
            fontSize: "1.1em",
            backgroundColor: state.isSelected ? "#e9ecef" : base.backgroundColor
          })
        }}
      />
    </div>
  );
}