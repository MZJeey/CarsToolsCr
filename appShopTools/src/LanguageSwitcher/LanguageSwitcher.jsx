import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

// Import dinámico de componentes de bandera SIN CDN
// https://github.com/lipis/flag-icons/tree/main/country-flag-icons
import * as Flags from "country-flag-icons/react/3x2";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const languages = useMemo(
    () => [
      { code: "es", name: "Español", countryCode: "CR" }, // CR = Costa Rica
      { code: "en", name: "English", countryCode: "US" }, // US = Estados Unidos
    ],
    []
  );

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const changeLanguage = (lng) => {
    i18n
      .changeLanguage(lng)
      .then(handleClose)
      .catch((err) => console.error("Error changing language:", err));
  };

  const codeLabel = (i18n.language || "es").slice(0, 2).toUpperCase();

  // Helper: renderiza la bandera desde el paquete (sin red)
  const FlagIcon = ({ countryCode, title }) => {
    const Comp = Flags?.[countryCode?.toUpperCase()];
    if (Comp) {
      return (
        <Comp
          title={title || countryCode}
          style={{ width: "1.5em", height: "1.5em", display: "inline-block" }}
          aria-label={countryCode}
        />
      );
    }
    // Fallback a emoji si algo sale mal
    return (
      <span role="img" aria-label={countryCode} style={{ fontSize: "1.5em" }}>
        {countryCode === "US" ? "🇺🇸" : countryCode === "CR" ? "🇨🇷" : "🏳"}
      </span>
    );
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="large"
        color="inherit"
        aria-label="change language"
        aria-controls="language-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ mr: 1 }}
      >
        <LanguageIcon />
        <span style={{ marginLeft: 8, fontSize: "0.875rem" }}>{codeLabel}</span>
      </IconButton>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "language-button" }}
        PaperProps={{ elevation: 3, sx: { mt: 1.5, minWidth: 200 } }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={i18n.language?.startsWith(lang.code)}
            onClick={() => changeLanguage(lang.code)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "rgba(0,0,0,0.04)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FlagIcon
                countryCode={lang.countryCode}
                title={lang.countryCode}
              />
            </ListItemIcon>
            <ListItemText>{lang.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
