// import React, { useState } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import {
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   AppBar,
//   Drawer,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   ShoppingCart as ShoppingCartIcon,
//   Star as StarIcon,
//   LocalOffer as LocalOfferIcon,
//   Description as DescriptionIcon,
//   Layers as LayersIcon,
// } from "@mui/icons-material";
// import { useNavigate, useLocation, Routes, Route } from "react-router-dom";

// // Componentes existentes
// import { ListaProductos } from "../Productos/listaProductos";
// import DetalleProducto from "../Productos/listaDetalles";
// import ListaResenas from "../Productos/listaResena";
// import DetalleResenas from "../Productos/detallesResena";
// import Promociones from "../Productos/promociones";
// import ProductosSimilares from "../Productos/productoSimilares";
// import PedidoComponent from "../pedidos/pedido";
// import TodosProductosPersonalizados from "../pedidos/TodosProductosPersonalizados";

// // Componente de Dashboard
// function DashboardContent() {
//   const [open, setOpen] = useState(true);
//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Configuración de navegación
//   const menuItems = [
//     {
//       text: "Dashboard",
//       icon: <DashboardIcon />,
//       path: "/dashboard",
//     },
//     {
//       text: "Productos",
//       icon: <LayersIcon />,
//       path: "/dashboard/productos",
//       subItems: [
//         { text: "Lista de Productos", path: "/dashboard/productos/list" },
//         { text: "Productos Similares", path: "/dashboard/productos/similares" },
//       ],
//     },
//     {
//       text: "Reseñas",
//       icon: <StarIcon />,
//       path: "/dashboard/resenas",
//       subItems: [{ text: "Lista de Reseñas", path: "/dashboard/resenas/list" }],
//     },
//     {
//       text: "Promociones",
//       icon: <LocalOfferIcon />,
//       path: "/dashboard/promociones",
//     },
//     {
//       text: "Pedidos",
//       icon: <ShoppingCartIcon />,
//       path: "/dashboard/pedidos",
//       subItems: [
//         { text: "Lista de Pedidos", path: "/dashboard/pedidos/list" },
//         {
//           text: "Productos Personalizados",
//           path: "/dashboard/pedidos/personalizados",
//         },
//       ],
//     },
//   ];

//   // Determinar el título de la página actual
//   const getPageTitle = () => {
//     for (const item of menuItems) {
//       if (item.path === location.pathname) {
//         return item.text;
//       }
//       if (item.subItems) {
//         for (const subItem of item.subItems) {
//           if (subItem.path === location.pathname) {
//             return subItem.text;
//           }
//         }
//       }
//     }
//     return "Dashboard";
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       <AppBar
//         position="absolute"
//         sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
//       >
//         <Toolbar>
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="open drawer"
//             onClick={toggleDrawer}
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography
//             component="h1"
//             variant="h6"
//             color="inherit"
//             noWrap
//             sx={{ flexGrow: 1 }}
//           >
//             {getPageTitle()}
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Drawer variant="permanent" open={open}>
//         <Toolbar
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end",
//             px: [1],
//           }}
//         />
//         <Box sx={{ overflow: "auto" }}>
//           <List>
//             {menuItems.map((item) => (
//               <React.Fragment key={item.text}>
//                 <ListItemButton
//                   selected={location.pathname === item.path}
//                   onClick={() => navigate(item.path)}
//                 >
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.text} />
//                 </ListItemButton>
//                 {item.subItems &&
//                   item.subItems.map((subItem) => (
//                     <ListItemButton
//                       key={subItem.text}
//                       sx={{ pl: 4 }}
//                       selected={location.pathname === subItem.path}
//                       onClick={() => navigate(subItem.path)}
//                     >
//                       <ListItemIcon>
//                         <DescriptionIcon />
//                       </ListItemIcon>
//                       <ListItemText primary={subItem.text} />
//                     </ListItemButton>
//                   ))}
//               </React.Fragment>
//             ))}
//           </List>
//           <Divider />
//         </Box>
//       </Drawer>
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: (theme) =>
//             theme.palette.mode === "light"
//               ? theme.palette.grey[100]
//               : theme.palette.grey[900],
//           flexGrow: 1,
//           height: "100vh",
//           overflow: "auto",
//         }}
//       >
//         <Toolbar />
//         <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Routes>
//                 <Route
//                   index
//                   element={
//                     <Paper
//                       sx={{ p: 2, display: "flex", flexDirection: "column" }}
//                     >
//                       <Typography variant="h6" gutterBottom>
//                         Dashboard Principal
//                       </Typography>
//                       <Typography>
//                         Bienvenido al sistema de administración. Seleccione una
//                         opción del menú.
//                       </Typography>
//                     </Paper>
//                   }
//                 />
//                 <Route path="productos/list" element={<ListaProductos />} />
//                 <Route
//                   path="productos/detalles/:id"
//                   element={<DetalleProducto />}
//                 />
//                 <Route
//                   path="productos/similares"
//                   element={<ProductosSimilares />}
//                 />
//                 <Route path="resenas" element={<ListaResenas />} />
//                 <Route
//                   path="resenas/detalles/:id"
//                   element={<DetalleResenas />}
//                 />
//                 <Route path="promociones" element={<Promociones />} />
//                 <Route path="pedidos" element={<PedidoComponent />} />
//                 <Route
//                   path="pedidos/personalizados"
//                   element={<TodosProductosPersonalizados />}
//                 />
//               </Routes>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </Box>
//   );
// }

// // Tema de Material-UI
// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#3f51b5",
//     },
//     secondary: {
//       main: "#f50057",
//     },
//   },
// });

// // Componente principal del dashboard
// export default function DashboardLayoutBasic() {
//   return (
//     <ThemeProvider theme={theme}>
//       <DashboardContent />
//     </ThemeProvider>
//   );
// }





import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton,
  List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Rating, Chip
} from "@mui/material";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StarIcon from "@mui/icons-material/Star";
import WhatshotIcon from "@mui/icons-material/Whatshot";

// 👇 ajusta la ruta si tu archivo está en otra carpeta
import DashboardService from "../../services/DashboardService";


const palette = ["#3f51b5","#00bcd4","#ff9800","#e91e63","#4caf50","#9c27b0"];

const SectionTitle = ({ icon, text, right }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="h6" fontWeight={700}>{text}</Typography>
    </Box>
    {right}
  </Box>
);

const StatBadge = ({ icon, label, value, subtle }) => (
  <Box
    sx={{
      p: 2, borderRadius: 3, bgcolor: "background.paper",
      display: "flex", alignItems: "center", gap: 1.5,
      boxShadow: 1, border: theme => `1px solid ${theme.palette.divider}`
    }}
  >
    {icon}
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" fontWeight={800}>{value}</Typography>
      {subtle && <Typography variant="caption" color="success.main">{subtle}</Typography>}
    </Box>
  </Box>
);

const AdminOverview = () => {
  const [granularity, setGranularity] = useState("daily");

  // estados con datos reales del backend
  const [ventasRaw, setVentasRaw] = useState([]);      // daily: [{date,...}]  monthly: [{month,...}]
  const [estados, setEstados] = useState([]);          // [{estado, cantidad}]
  const [top, setTop] = useState([]);                  // [{producto_id, nombre, ventas}]
  const [resenas, setResenas] = useState([]);          // [{id, usuario, producto, comentario, fecha, (opcional: rating)}]

  useEffect(() => {
    const load = async () => {
      try {
        // ventas por día/mes según el toggle
        const ventasReq = (granularity === "daily")
          ? DashboardService.ventasDiarias()
          : DashboardService.ventasMensuales();

        // resto de widgets
        const [ventasRes, estadosRes, topRes, resenasRes] = await Promise.all([
          ventasReq,
          DashboardService.pedidosPorEstado(),
         DashboardService.topProductos(),
          DashboardService.resenasRecientes(),
        ]);

        setVentasRaw(Array.isArray(ventasRes.data) ? ventasRes.data : []);
        setEstados(Array.isArray(estadosRes.data) ? estadosRes.data : []);
        setTop(Array.isArray(topRes.data) ? topRes.data : []);
        setResenas(Array.isArray(resenasRes.data) ? resenasRes.data : []);
      } catch (e) {
        console.error("Error cargando dashboard:", e);
        // deja los estados como vacios para mostrar el sin datos en dado caso 
        setVentasRaw([]); setEstados([]); setTop([]); setResenas([]);
      }
    };
    load();
  }, [granularity]);

  // Mapeo para los gráficos 
  const ventasData = useMemo(() => {

    return (ventasRaw || []).map(r => ({
      x: r.date || r.month,
      ventas: Number(r.total_pedidos ?? 0),      
      monto:  Number(r.total_ingresos ?? 0),     
    }));
  }, [ventasRaw]);

  const estadosData = useMemo(() =>
    (estados || []).map(e => ({
      estado: (e.estado || "").replace("_", " "), 
      cantidad: Number(e.cantidad || 0),
    })), [estados]
  );

  const totalVentas = ventasData.reduce((a,b)=>a + (b.ventas||0), 0);
  const totalMonto  = ventasData.reduce((a,b)=>a + (b.monto||0),  0);

  return (
    <Grid container spacing={3}>
      {/* KPIs */}
      <Grid item xs={12}>
        <Box display="grid" gridTemplateColumns={{ xs:"1fr", sm:"1fr 1fr 1fr" }} gap={2}>
          <StatBadge icon={<TrendingUpIcon color="primary" />} label="Ventas (periodo)" value={totalVentas} />
          <StatBadge icon={<LocalMallIcon color="secondary" />} label="Monto total (₡)" value={totalMonto.toLocaleString()} />
          <StatBadge icon={<StarIcon color="warning" />} label="Calificación reciente" value={
            resenas.length && resenas.some(r => r.rating != null)
              ? `${(resenas.reduce((a,r)=>a+(Number(r.rating||0)),0)/resenas.length).toFixed(1)} / 5`
              : "—"
          } />
        </Box>
      </Grid>

      {/* Ventas por día/mes */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <SectionTitle
              icon={<TrendingUpIcon />}
              text={`Ventas por ${granularity === "daily" ? "día" : "mes"}`}
              right={
                <ToggleButtonGroup
                  size="small"
                  value={granularity}
                  exclusive
                  onChange={(_, v) => v && setGranularity(v)}
                >
                  <ToggleButton value="daily">Diario</ToggleButton>
                  <ToggleButton value="monthly">Mensual</ToggleButton>
                </ToggleButtonGroup>
              }
            />
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                {granularity === "daily" ? (
                  <LineChart data={ventasData}>
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ventas" />
                  </LineChart>
                ) : (
                  <BarChart data={ventasData}>
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
            {!ventasData.length && (
              <Typography variant="body2" color="text.secondary">Sin datos</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Pedidos por estado */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <SectionTitle icon={<LocalMallIcon />} text="Pedidos por estado" />
            <Box height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={estadosData} dataKey="cantidad" nameKey="estado" outerRadius={95} label>
                    {estadosData.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {estadosData.map(e => (
                <Chip key={e.estado} label={`${e.estado}: ${e.cantidad}`} />
              ))}
            </Box>
            {!estadosData.length && (
              <Typography variant="body2" color="text.secondary">Sin datos</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Top 3 productos */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <SectionTitle icon={<WhatshotIcon />} text="3 productos más vendidos" />
            <List>
              {top.map((p, idx) => (
                <React.Fragment key={p.producto_id ?? p.id ?? idx}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{(p.nombre || "?").charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={700}>{`${idx+1}. ${p.nombre}`}</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">Ventas: {p.ventas}</Typography>}
                    />
                  </ListItem>
                  {idx < top.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            {!top.length && (
              <Typography variant="body2" color="text.secondary">Sin datos</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* 3 reseñas recientes */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <SectionTitle icon={<StarIcon />} text="3 reseñas más recientes" />
            <List>
              {resenas.map((r, idx) => (
                <React.Fragment key={r.id ?? idx}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography fontWeight={700}>{r.usuario}</Typography>
                          {r.rating != null && (
                            <Rating size="small" value={Number(r.rating || 0)} readOnly />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{r.comentario}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.producto} · {r.fecha ? new Date(r.fecha).toLocaleDateString() : ""}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {idx < resenas.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            {!resenas.length && (
              <Typography variant="body2" color="text.secondary">Sin datos</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminOverview;
