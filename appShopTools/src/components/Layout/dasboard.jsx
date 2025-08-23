import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  LocalOffer as LocalOfferIcon,
  Description as DescriptionIcon,
  Layers as LayersIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";

// Componentes existentes
import { ListaProductos } from "../Productos/listaProductos";
import DetalleProducto from "../Productos/listaDetalles";
import ListaResenas from "../Productos/listaResena";
import DetalleResenas from "../Productos/detallesResena";
import Promociones from "../Productos/promociones";
import ProductosSimilares from "../Productos/productoSimilares";
import PedidoComponent from "../pedidos/pedido";
import TodosProductosPersonalizados from "../pedidos/TodosProductosPersonalizados";

// Componente de Dashboard
function DashboardContent() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Configuración de navegación
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Productos",
      icon: <LayersIcon />,
      path: "/dashboard/productos",
      subItems: [
        { text: "Lista de Productos", path: "/dashboard/productos/list" },
        { text: "Productos Similares", path: "/dashboard/productos/similares" },
      ],
    },
    {
      text: "Reseñas",
      icon: <StarIcon />,
      path: "/dashboard/resenas",
      subItems: [{ text: "Lista de Reseñas", path: "/dashboard/resenas/list" }],
    },
    {
      text: "Promociones",
      icon: <LocalOfferIcon />,
      path: "/dashboard/promociones",
    },
    {
      text: "Pedidos",
      icon: <ShoppingCartIcon />,
      path: "/dashboard/pedidos",
      subItems: [
        { text: "Lista de Pedidos", path: "/dashboard/pedidos/list" },
        {
          text: "Productos Personalizados",
          path: "/dashboard/pedidos/personalizados",
        },
      ],
    },
  ];

  // Determinar el título de la página actual
  const getPageTitle = () => {
    for (const item of menuItems) {
      if (item.path === location.pathname) {
        return item.text;
      }
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.path === location.pathname) {
            return subItem.text;
          }
        }
      }
    }
    return "Dashboard";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
                {item.subItems &&
                  item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      sx={{ pl: 4 }}
                      selected={location.pathname === subItem.path}
                      onClick={() => navigate(subItem.path)}
                    >
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
              </React.Fragment>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Routes>
                <Route
                  index
                  element={
                    <Paper
                      sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Dashboard Principal
                      </Typography>
                      <Typography>
                        Bienvenido al sistema de administración. Seleccione una
                        opción del menú.
                      </Typography>
                    </Paper>
                  }
                />
                <Route path="productos/list" element={<ListaProductos />} />
                <Route
                  path="productos/detalles/:id"
                  element={<DetalleProducto />}
                />
                <Route
                  path="productos/similares"
                  element={<ProductosSimilares />}
                />
                <Route path="resenas" element={<ListaResenas />} />
                <Route
                  path="resenas/detalles/:id"
                  element={<DetalleResenas />}
                />
                <Route path="promociones" element={<Promociones />} />
                <Route path="pedidos" element={<PedidoComponent />} />
                <Route
                  path="pedidos/personalizados"
                  element={<TodosProductosPersonalizados />}
                />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

// Tema de Material-UI
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

// Componente principal del dashboard
export default function DashboardLayoutBasic() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardContent />
    </ThemeProvider>
  );
}
