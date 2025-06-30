import { useTranslation } from "react-i18next";
import { MenuItem, Select } from "@mui/material";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      variant="standard"
      sx={{ color: "white", ml: 2 }}
    >
      <MenuItem value="es">Español</MenuItem>
      <MenuItem value="en">English</MenuItem>
    </Select>
  );
};

export default LanguageSwitcher;
