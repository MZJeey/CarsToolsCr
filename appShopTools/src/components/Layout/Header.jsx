import { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { TireRepair } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

export default function Header() {
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());

  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  const { cart, getCountItems } = useCart();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorEl] = useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);
  const [anchorElMantenimiento, setAnchorElMantenimiento] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);

  const handleUserMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  const handleOpenPrincipalMenu = (e) => setAnchorElPrincipal(e.currentTarget);
  const handleClosePrincipalMenu = () => setAnchorElPrincipal(null);
  const handleOpcionesMenuOpen = (e) => setMobileMoreAnchorEl(e.currentTarget);
  const handleOpcionesMenuClose = () => setMobileMoreAnchorEl(null);

  const { i18n } = useTranslation();
  const handleToggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  const handleMantenimientoOpen = (e) =>
    setAnchorElMantenimiento(e.currentTarget);
  const handleMantenimientoClose = () => setAnchorElMantenimiento(null);

  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: "Repuestos", link: "/lista", roles: null },
    { name: "Marcas", link: "/catalog-movies/", roles: null },
    { name: "Servicios", link: "/movie/filter", roles: null },
    { name: "Mantenimientos", link: null, roles: [] },
  ];

  const mantenimientoOpciones = [
    { name: "Productos", link: "/productos" },
    { name: "Dashboard", link: "/dasboard" },
    { name: "Reseñas", link: "/resena" },
    { name: "Promociones", link: "/promociones" },
    { name: "Pedidos", link: "/pedidos" },
    { name: "Productos Personalizados", link: "/productos-personalizados" },
  ];

  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
      {navItems.map((item, idx) => {
        if (item.name === "Mantenimientos") {
          return (
            <Box key={idx}>
              <Button
                sx={{ color: "white" }}
                aria-controls={
                  Boolean(anchorElMantenimiento)
                    ? "mantenimiento-menu"
                    : undefined
                }
                aria-haspopup="true"
                aria-expanded={
                  Boolean(anchorElMantenimiento) ? "true" : undefined
                }
                onClick={handleMantenimientoOpen}
              >
                <Typography textAlign="center">{item.name}</Typography>
              </Button>
              <Menu
                id="mantenimiento-menu"
                anchorEl={anchorElMantenimiento}
                open={Boolean(anchorElMantenimiento)}
                onClose={handleMantenimientoClose}
                MenuListProps={{
                  "aria-labelledby": "mantenimiento-button",
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {mantenimientoOpciones.map((opt, idxOpt) => (
                  <MenuItem
                    key={idxOpt}
                    component={Link}
                    to={opt.link}
                    onClick={() => {
                      handleMantenimientoClose();
                      handleClosePrincipalMenu();
                    }}
                  >
                    {opt.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          );
        }

        if (Array.isArray(item.roles)) {
          if (
            userData &&
            (item.roles.length === 0 || autorize({ requiredRoles: item.roles }))
          ) {
            return (
              <Button
                key={idx}
                component={Link}
                to={item.link}
                sx={{ color: "white" }}
              >
                <Typography textAlign="center">{item.name}</Typography>
              </Button>
            );
          }
        } else if (item.roles === null) {
          return (
            <Button
              key={idx}
              component={Link}
              to={item.link}
              sx={{ color: "white" }}
            >
              <Typography textAlign="center">{item.name}</Typography>
            </Button>
          );
        }
        return null;
      })}
    </Box>
  );

  const menuPrincipalMobile = (
    <Box>
      {navItems.map((item, idx) => {
        if (item.name === "Mantenimientos") {
          return (
            <Box key={idx}>
              <MenuItem onClick={handleMantenimientoOpen}>
                <Typography textAlign="center">{item.name}</Typography>
              </MenuItem>
              <Menu
                id="mantenimiento-menu-mobile"
                anchorEl={anchorElMantenimiento}
                open={Boolean(anchorElMantenimiento)}
                onClose={handleMantenimientoClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {mantenimientoOpciones.map((opt, idxOpt) => (
                  <MenuItem
                    key={idxOpt}
                    component={Link}
                    to={opt.link}
                    onClick={() => {
                      handleMantenimientoClose();
                      handleClosePrincipalMenu();
                    }}
                  >
                    {opt.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          );
        }
        return (
          <MenuItem
            key={idx}
            component={Link}
            to={item.link}
            onClick={handleClosePrincipalMenu}
          >
            <Typography textAlign="center">{item.name}</Typography>
          </MenuItem>
        );
      })}
    </Box>
  );

  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="abrir menú de usuario"
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        sx={{ color: "white" }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: "45px" }}
      >
        {userData && (
          <MenuItem>
            <Typography variant="subtitle1">{userData.email}</Typography>
          </MenuItem>
        )}
        {userItems.map((setting, idx) => {
          if (setting.login && userData && Object.keys(userData).length > 0) {
            return (
              <MenuItem
                key={idx}
                component={Link}
                to={setting.link}
                onClick={handleUserMenuClose}
              >
                <Typography>{setting.name}</Typography>
              </MenuItem>
            );
          } else if (!setting.login && Object.keys(userData).length === 0) {
            return (
              <MenuItem
                key={idx}
                component={Link}
                to={setting.link}
                onClick={handleUserMenuClose}
              >
                <Typography>{setting.name}</Typography>
              </MenuItem>
            );
          }
          return null;
        })}
      </Menu>
    </Box>
  );

  const menuOpcionesMobile = (
    <Menu
      id="badge-menu-mobile"
      anchorEl={mobileOpcionesAnchorEl}
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
          component={Link}
          to="/rental/crear/"
        >
          <Badge badgeContent={getCountItems(cart)} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Typography>Compras</Typography>
      </MenuItem>

      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Typography>Notificaciones</Typography>
      </MenuItem>

      {userItems.map((setting, idx) => {
        if (setting.login && userData && Object.keys(userData).length > 0) {
          return (
            <MenuItem
              key={idx}
              component={Link}
              to={setting.link}
              onClick={handleOpcionesMenuClose}
            >
              <Typography>{setting.name}</Typography>
            </MenuItem>
          );
        } else if (!setting.login && Object.keys(userData).length === 0) {
          return (
            <MenuItem
              key={idx}
              component={Link}
              to={setting.link}
              onClick={handleOpcionesMenuClose}
            >
              <Typography>{setting.name}</Typography>
            </MenuItem>
          );
        }
        return null;
      })}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(90deg,rgb(12, 12, 12) 0%,rgb(12, 12, 12) 100%)",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            aria-label="abrir menú principal"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenPrincipalMenu}
            sx={{ color: "white", mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElPrincipal}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>

          <Tooltip title="Repuestos ">
            <IconButton
              size="large"
              edge="start"
              component={Link}
              to="/"
              aria-label="Inicio"
              sx={{ color: "white" }}
            ></IconButton>
            <TireRepair sx={{ color: "white", fontSize: 30 }} />
          </Tooltip>

          {menuPrincipal}

          <Box
            sx={{
              mx: 2,
              display: { xs: "none", sm: "flex" },
              alignItems: "flex-end",
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar repuesto..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  paddingLeft: 1,
                  width: "500px",
                },
                "& .MuiInputBase-input": {
                  padding: "8.5px 14px",
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <IconButton
              size="large"
              aria-label="cambiar idioma"
              color="inherit"
              onClick={handleToggleLanguage}
            >
              <LanguageIcon />
            </IconButton>

            <IconButton
              size="large"
              aria-label="ver carrito"
              color="inherit"
              component={Link}
              to="/rental/crear/"
            >
              <Badge badgeContent={getCountItems(cart)} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {userMenu}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="mostrar opciones"
              aria-controls="badge-menu-mobile"
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {menuOpcionesMobile}
    </Box>
  );
}
