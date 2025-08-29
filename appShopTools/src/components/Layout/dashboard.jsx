
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

import { useTranslation } from "react-i18next";
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
   const { t } = useTranslation("dashboard");
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
          <StatBadge icon={<TrendingUpIcon color="primary" />} label={t("dashboard.kpis.ventasPeriodo")} value={totalVentas} />
          <StatBadge icon={<LocalMallIcon color="secondary" />} label={t("dashboard.kpis.montoTotal")} value={totalMonto.toLocaleString()} />
          <StatBadge icon={<StarIcon color="warning" />} label={t("dashboard.kpis.calificacionReciente")} value={
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
     text={`${t("dashboard.ventas.titulo")} ${t(`dashboard.ventas.unidad.${granularity}`)}`}


              right={
                <ToggleButtonGroup
                  size="small"
                  value={granularity}
                  exclusive
                  onChange={(_, v) => v && setGranularity(v)}
                >
                  <ToggleButton value="daily">{t("dashboard.ventas.toggle.daily")}</ToggleButton>
                  <ToggleButton value="monthly">{t("dashboard.ventas.toggle.monthly")}</ToggleButton>
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
            <SectionTitle icon={<LocalMallIcon />} text={t("dashboard.pedidosPorEstado.titulo")} />
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
            <SectionTitle icon={<WhatshotIcon />} text={t("dashboard.top.titulo")} />
            <List>
              {top.map((p, idx) => (
                <React.Fragment key={p.producto_id ?? p.id ?? idx}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{(p.nombre || "?").charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={700}>{`${idx+1}. ${p.nombre}`}</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary">{t("dashboard.top.ventas")} {p.ventas}</Typography>}
                    />
                  </ListItem>
                  {idx < top.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            {!top.length && (
              <Typography variant="body2" color="text.secondary">{t("dashboard.comunes.sinDatos")}</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* 3 reseñas recientes */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <SectionTitle icon={<StarIcon />} text={t("dashboard.resenas.titulo")} />
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
