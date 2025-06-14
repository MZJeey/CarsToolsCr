import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const StatCard = ({ title, value, color }) => (
  <Card
    sx={{
      minHeight: 120,
      backgroundColor: color || "primary.main",
      color: "white",
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <CardContent>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard de Estadísticas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Vista general de métricas clave
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StatCard title="Usuarios activos" value="1,234" color="#1976d2" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Órdenes" value="567" color="#2e7d32" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Ingresos" value="$12,345" color="#ed6c02" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
