import { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  TextField,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import { useCart } from "../../hooks/useCart";

export default function MenuConDropdown() {
  const { user, logout } = useContext(UserContext);
  const { cart, getCountItems } = useCart();
  const navigate = useNavigate();

  // Estado para abrir menú usuario
  const [anchorUser, setAnchorUser] = useState(null);
  // Estado para abrir menú productos (dropdown)
  const [anchorProducts, setAnchorProducts] = useState(null);
  // Estado para menú móvil (opcional)
  const [mobileMenu, setMobileMenu] = useState(null);

  const [search, setSearch] = useState("");

  // Handlers menú usuario
  const handleUserMenuOpen = (event) => setAnchorUser(event.currentTarget);
  const handleUserMenuClose = () => setAnchorUser(null);

  // Handlers menú productos (dropdown)
  const handleProductsMenuOpen = (event) =>
    setAnchorProducts(event.currentTarget);
  const handleProductsMenuClose = () => setAnchorProducts(null);

  // Handlers menú móvil
  const handleMobileMenuOpen = (event) => setMobileMenu(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenu(null);

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  const userMenuItems = user
    ? [
        { label: "Perfil", link: "/profile" },
        { label: "Cerrar sesión", action: logout },
      ]
    : [
        { label: "Ingresar", link: "/login" },
        { label: "Registrarse", link: "/register" },
      ];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMobileMenuOpen}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
        >
          Mi Tienda
        </Typography>

        {/* Botón con dropdown Productos */}
        <Button
          color="inherit"
          onClick={handleProductsMenuOpen}
          aria-controls={Boolean(anchorProducts) ? "products-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorProducts) ? "true" : undefined}
          sx={{ display: { xs: "none", sm: "inline-flex" }, mr: 2 }}
        >
          Productos
        </Button>
        <Menu
          id="products-menu"
          anchorEl={anchorProducts}
          open={Boolean(anchorProducts)}
          onClose={handleProductsMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem
            component={Link}
            to="/productos/electronica"
            onClick={handleProductsMenuClose}
          >
            Electrónica
          </MenuItem>
          <MenuItem
            component={Link}
            to="/productos/ropa"
            onClick={handleProductsMenuClose}
          >
            Ropa
          </MenuItem>
          <MenuItem
            component={Link}
            to="/productos/hogar"
            onClick={handleProductsMenuClose}
          >
            Hogar
          </MenuItem>
        </Menu>

        {/* Buscador */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            sx={{ backgroundColor: "white", borderRadius: 1, mr: 1 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSearchSubmit}
          >
            Buscar
          </Button>
        </Box>

        {/* Carrito */}
        <IconButton component={Link} to="/cart" color="inherit" sx={{ ml: 2 }}>
          <Badge badgeContent={getCountItems(cart)} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Menú usuario */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleUserMenuOpen}
          aria-controls={Boolean(anchorUser) ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorUser) ? "true" : undefined}
          sx={{ ml: 2 }}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorUser}
          open={Boolean(anchorUser)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {userMenuItems.map((item, idx) =>
            item.link ? (
              <MenuItem
                key={idx}
                component={Link}
                to={item.link}
                onClick={handleUserMenuClose}
              >
                {item.label}
              </MenuItem>
            ) : (
              <MenuItem
                key={idx}
                onClick={() => {
                  handleUserMenuClose();
                  item.action && item.action();
                }}
              >
                {item.label}
              </MenuItem>
            )
          )}
        </Menu>

        {/* Menú móvil */}
        <Menu
          anchorEl={mobileMenu}
          open={Boolean(mobileMenu)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ display: { sm: "none" } }}
        >
          <MenuItem component={Link} to="/" onClick={handleMobileMenuClose}>
            Inicio
          </MenuItem>
          <MenuItem
            component={Link}
            to="/productos"
            onClick={handleMobileMenuClose}
          >
            Productos
          </MenuItem>
          {/* Puedes agregar más opciones */}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
