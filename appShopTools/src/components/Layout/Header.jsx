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
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreIcon from "@mui/icons-material/MoreVert";
import { TireRepair } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

export default function Header() {
  const { t } = useTranslation("header");
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      const count = Object.values(favorites).filter(Boolean).length;
      setFavoritesCount(count);
    }
  }, []);

  // Escuchar cambios en el localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        const count = Object.values(favorites).filter(Boolean).length;
        setFavoritesCount(count);
      } else {
        setFavoritesCount(0);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  //Ultimo recurso quemar datos
  console.log(" Data:", userData);
  localStorage.setItem("userData", JSON.stringify(userData));

  const { cart, getCountItems } = useCart();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorEl] = useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);

  // Menú desplegable de Mantenimiento Vehículos
  const [anchorElMantenimiento, setAnchorElMantenimiento] = useState(null);

  // Menú de idiomas
  const [anchorElLang, setAnchorElLang] = useState(null);
  const { i18n } = useTranslation();
  const languages = [
    { code: "es", name: "Español", countryCode: "CR" },
    { code: "en", name: "English", countryCode: "US" },
  ];
  const handleLangMenuOpen = (e) => setAnchorElLang(e.currentTarget);
  const handleLangMenuClose = () => setAnchorElLang(null);
  const changeLanguage = (lng) => {
    i18n
      .changeLanguage(lng)
      .then(() => handleLangMenuClose())
      .catch((err) => console.error("Error changing language:", err));
  };

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

  // Handlers para menú de Mantenimiento Vehículos
  const handleMantenimientoOpen = (e) =>
    setAnchorElMantenimiento(e.currentTarget);
  const handleMantenimientoClose = () => setAnchorElMantenimiento(null);

  //Buscador para filtrar productos
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/lista?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Limpiar el campo después de buscar
    }
  };

  const userItems = [
    { name: t("header.user.login"), link: "/user/login", login: false },
    { name: t("header.user.registrarse"), link: "/user/create", login: false },
    { name: t("header.user.logout"), link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: t("header.menu.repuestos"), link: "/lista", roles: null },
    { name: t("header.menu.pedidos"), link: "/pedidos", roles: null },
    {
      name: t("header.menu.servicios"),
      link: "/movie/filter",
      roles: null,
    },
    {
      name: t("header.menu.administracion"),
      link: "/crear",
      roles: ["administrador"],
    },
  ];

  const mantenimientoOpciones = [
    { name: t("header.menu.productos"), link: "/productos" },
    { name: t("header.menu.dashboard"), link: "/dasboard" },
    { name: t("header.menu.reseñas"), link: "/resena" },
    { name: t("header.menu.promociones"), link: "/promociones" },
    { name: t("header.menu.pedidos"), link: "/pedidos" },
    {
      name: t("header.menu.productos_personalizados"),
      link: "/productos-personalizados",
    },
    {
      name: t("header.menu.productos_similares"),
      link: "/productos-similares",
    },
  ];

  // Menú principal en desktop
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
      {navItems &&
        navItems.map((item, idx) => {
          if (item.name === t("header.menu.administracion")) {
            if (userData.id && autorize({ requiredRoles: item.roles })) {
              console.log("Entro con el rol");
              return (
                <Box key={idx}>
                  <Button
                    sx={{ color: "white" }}
                    aria-haspopup="true"
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
            return null;
          }

          if (Array.isArray(item.roles)) {
            if (
              userData &&
              (item.roles?.length === 0 ||
                autorize({ requiredRoles: item.roles }))
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

  //Menú principal en mobile
  const menuPrincipalMobile = (
    <Box>
      {navItems.map((item, idx) => {
        if (item.name === t("header.menu.administracion")) {
          if (
            userData &&
            (item.roles?.length === 0 ||
              autorize({ requiredRoles: item.roles }))
          ) {
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
          return null;
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
        <Typography>{t("header.icons.compras")}</Typography>
      </MenuItem>
      {/*aquie poner el link a favoritos*/}
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
          component={Link}
          to="/Favoritos"
        >
          <Badge badgeContent={favoritesCount} color="error">
            <FavoriteIcon />
          </Badge>
        </IconButton>
        <Typography>{t("header.icons.notificaciones")}</Typography>
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

          <Tooltip title={t("header.tooltips.inicio")}>
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
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder={t("header.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSearch}
              sx={{ ml: 1 }}
            >
              {t("header.search.button")}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Acciones derecha */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {/* 🔤 Botón que abre el menú de banderas */}
            <IconButton
              size="large"
              aria-label="cambiar idioma"
              color="inherit"
              onClick={handleLangMenuOpen}
            >
              <ReactCountryFlag
                countryCode={i18n.language === "es" ? "CR" : "US"}
                svg
                style={{ fontSize: "1.5em", lineHeight: "1.5em" }}
              />
            </IconButton>

            {/* Menú de banderas */}
            <Menu
              id="language-menu"
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleLangMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  selected={i18n.language === lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(0,0,0,0.06)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                    },
                  }}
                >
                  <ListItemIcon>
                    <ReactCountryFlag
                      countryCode={lang.countryCode}
                      svg
                      style={{ fontSize: "1.5em", lineHeight: "1.5em" }}
                    />
                  </ListItemIcon>
                  <ListItemText>{lang.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>

            {/*Icono Carrito */}
            <IconButton
              size="large"
              aria-label="ver carrito"
              color="inherit"
              component={Link}
              to="/carrito"
            >
              <Badge badgeContent={getCountItems(cart)} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              component={Link}
              to="/Favoritos"
            >
              <Badge badgeContent={favoritesCount} color="error">
                <FavoriteIcon />
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
