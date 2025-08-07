import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ReactCountryFlag from 'react-country-flag';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      handleClose();
    }).catch(err => {
      console.error('Error changing language:', err);
    });
  };

  const languages = [
    { code: 'es', name: 'Español', countryCode: 'CR' },
    { code: 'en', name: 'English', countryCode: 'US' }
  ];

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="large"
        color="inherit"
        aria-label="change language"
        aria-controls="language-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <LanguageIcon />
        <span style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
          {i18n.language ? i18n.language.toUpperCase() : 'ES'}
        </span>
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
          }
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={i18n.language === lang.code}
            onClick={() => changeLanguage(lang.code)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              },
            }}
          >
            <ListItemIcon>
              {/* Aquí usamos la prop countryCode */}
              <ReactCountryFlag countryCode={lang.countryCode} svg style={{ fontSize: '1.5em' }} />
            </ListItemIcon>
            <ListItemText>
              {lang.name}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;