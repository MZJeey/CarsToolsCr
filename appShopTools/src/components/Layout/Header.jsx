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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";

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

  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);

  const handleUserMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  const handleOpenPrincipalMenu = (event) =>
    setAnchorElPrincipal(event.currentTarget);
  const handleClosePrincipalMenu = () => setAnchorElPrincipal(null);
  const handleOpcionesMenuOpen = (event) =>
    setMobileMoreAnchorEl(event.currentTarget);
  const handleOpcionesMenuClose = () => setMobileMoreAnchorEl(null);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: "Vehiculos", link: "/movie", roles: null },
    { name: "Cátalogo de Repuestos", link: "/catalog-movies/", roles: null },
    { name: "Filtrar Repuestos", link: "/movie/filter", roles: null },
    {
      name: "Mantenimiento Vehiculos",
      link: "/movie-table/",
      roles: ["Administrador"],
    },
  ];

  const menuIdPrincipal = "menu-appbar";

  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems.map((item, index) => {
        if (userData && item.roles) {
          if (autorize({ requiredRoles: item.roles })) {
            return (
              <Button
                key={index}
                component={Link}
                to={item.link}
                sx={{ color: "white" }}
              >
                <Typography textAlign="center">{item.name}</Typography>
              </Button>
            );
          }
        } else if (item.roles == null) {
          return (
            <Button
              key={index}
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

  const menuPrincipalMobile = navItems.map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link}>
      <Typography textAlign="center">{page.name}</Typography>
    </MenuItem>
  ));

  const userMenuId = "user-menu";

  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        onClick={handleUserMenuOpen}
        sx={{ color: "white" }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id={userMenuId}
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData && (
          <MenuItem>
            <Typography variant="subtitle1" gutterBottom>
              {userData?.email}
            </Typography>
          </MenuItem>
        )}
        {userItems.map((setting, index) => {
          if (setting.login && userData && Object.keys(userData).length > 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            );
          } else if (!setting.login && Object.keys(userData).length === 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            );
          }
          return null;
        })}
      </Menu>
    </Box>
  );

  const menuOpcionesId = "badge-menu-mobile";
  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={getCountItems(cart)}
            color="primary"
            component={Link}
            to="/rental/crear/"
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            sx={{ color: "white", mr: 2 }}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>
          <Tooltip title="Alquiler peliculas">
            <IconButton
              size="large"
              edge="end"
              component="a"
              href="/"
              aria-label="Alquiler peliculas"
              sx={{ color: "white" }}
            >
              <LiveTvIcon />
            </IconButton>
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
              placeholder="Buscar repuesto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                mr: 1,
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" sx={{ color: "white" }}>
              <Badge
                badgeContent={getCountItems(cart)}
                color="error"
                component={Link}
                to="/rental/crear/"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" sx={{ color: "white" }}>
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpcionesMenuOpen}
              sx={{ color: "white" }}
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
