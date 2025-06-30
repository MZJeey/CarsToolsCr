import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Divider,
  Avatar,
  LinearProgress,
  Tooltip,
  styled,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Discount,
  CalendarToday,
  Category,
  ShoppingBag,
  Public,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PromocionService from "../../services/PromocionService";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";

// Componente estilizado para las celdas de estado
const StatusBadge = styled(Box)(({ theme, status }) => ({
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "12px",
  padding: "4px 12px",
  fontWeight: 600,
  fontSize: "0.75rem",
  lineHeight: 1.5,
  ...(status === "Vigente" && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
  }),
  ...(status === "Pendiente" && {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.dark,
  }),
  ...(status === "Aplicado" && {
    backgroundColor: alpha(theme.palette.grey[500], 0.1),
    color: theme.palette.grey[600],
  }),
}));

// Función auxiliar para determinar el estado de la promoción
const getPromoStatus = (fechaInicio, fechaFin) => {
  const now = new Date();
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);

  if (now < start)
    return { status: "Pendiente", icon: <CalendarToday fontSize="small" /> };
  if (now > end)
    return { status: "Aplicado", icon: <Discount fontSize="small" /> };
  return { status: "Vigente", icon: <Discount fontSize="small" /> };
};

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const Promociones = () => {
  const theme = useTheme();
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [dialogMode, setDialogMode] = useState("add");
  const [formData, setFormData] = useState({
    IdPromocion: 0,
    Nombre: "",
    Descuento: 0,
    Tipo: "general",
    IdProducto: "",
    IdCategoria: "",
    FechaInicio: "",
    FechaFin: "",
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPromociones(),
          fetchProductos(),
          fetchCategorias(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchPromociones = async () => {
    try {
      const res = await PromocionService.getPromociones();
      setPromociones(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Error al obtener promociones");
      setPromociones([]);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await ProductoService.getProductos();
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Error al obtener productos");
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await CategoriaService.getCategorias();
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Error al obtener categorías");
    }
  };

  const handleOpenDialog = (promo = null) => {
    if (promo) {
      setDialogMode("edit");
      setFormData({
        ...promo,
        Tipo: promo.IdProducto
          ? "producto"
          : promo.IdCategoria
            ? "categoria"
            : "general",
        IdProducto: promo.IdProducto || "",
        IdCategoria: promo.IdCategoria || "",
        FechaInicio: promo.FechaInicio.split("T")[0],
        FechaFin: promo.FechaFin.split("T")[0],
      });
    } else {
      setDialogMode("add");
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        IdPromocion: 0,
        Nombre: "",
        Descuento: 0,
        Tipo: "general",
        IdProducto: "",
        IdCategoria: "",
        FechaInicio: today,
        FechaFin: today,
      });
    }
    setOpenDialog(true);
  };

  const handleOpenDetailDialog = (promo) => {
    setSelectedPromo(promo);
    setOpenDetailDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseDetailDialog = () => setOpenDetailDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setFormData((prev) => ({
      ...prev,
      Tipo: tipo,
      IdProducto: tipo === "producto" ? prev.IdProducto : "",
      IdCategoria: tipo === "categoria" ? prev.IdCategoria : "",
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validación de fechas
      if (new Date(formData.FechaFin) < new Date(formData.FechaInicio)) {
        setError("La fecha de fin no puede ser anterior a la fecha de inicio");
        return;
      }

      const datosParaEnviar = {
        ...formData,
        IdProducto: formData.Tipo === "producto" ? formData.IdProducto : null,
        IdCategoria:
          formData.Tipo === "categoria" ? formData.IdCategoria : null,
      };
      delete datosParaEnviar.Tipo;

      setLoading(true);
      if (dialogMode === "add") {
        await PromocionService.createPromocion(datosParaEnviar);
        setSuccess("Promoción agregada exitosamente");
      } else {
        await PromocionService.updatePromocion(
          formData.IdPromocion,
          datosParaEnviar
        );
        setSuccess("Promoción actualizada exitosamente");
      }
      await fetchPromociones();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la promoción");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await PromocionService.deletePromocion(id);
      setSuccess("Promoción eliminada exitosamente");
      await fetchPromociones();
    } catch {
      setError("Error al eliminar la promoción");
    } finally {
      setLoading(false);
    }
  };

  const getNombreProducto = (id) => {
    if (!id) return "No aplica";
    const prod = Array.isArray(productos)
      ? productos.find((p) => p.id == id)
      : null;
    return prod?.nombre || prod?.Nombre || `ID: ${id}`;
  };

  const getNombreCategoria = (id) => {
    if (!id) return "No aplica";
    const cat = Array.isArray(categorias)
      ? categorias.find((c) => c.id == id)
      : null;
    return cat?.nombre || cat?.Nombre || `ID: ${id}`;
  };

  const getTipoPromocion = (promo) => {
    if (promo.IdProducto) return "Producto";
    if (promo.IdCategoria) return "Categoría";
    return "General";
  };

  const getTipoIcon = (promo) => {
    if (promo.IdProducto) return <ShoppingBag color="primary" />;
    if (promo.IdCategoria) return <Category color="secondary" />;
    return <Public color="info" />;
  };

  const getAplicaA = (promo) => {
    if (promo.IdProducto) return getNombreProducto(promo.IdProducto);
    if (promo.IdCategoria) return getNombreCategoria(promo.IdCategoria);
    return "Todos los productos";
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
      {loading && (
        <LinearProgress
          sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Gestión de Promociones
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            minWidth: "200px",
            boxShadow: theme.shadows[3],
            "&:hover": {
              boxShadow: theme.shadows[6],
            },
          }}
        >
          Nueva Promoción
        </Button>
      </Box>

      {/* Listado de Promociones */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.background.paper }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Promoción</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descuento</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Vigencia</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promociones.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Discount
                        sx={{
                          fontSize: 48,
                          mb: 1,
                          color: theme.palette.grey[400],
                        }}
                      />
                      <Typography variant="body1">
                        No hay promociones registradas
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Crea tu primera promoción haciendo clic en el botón
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                promociones.map((promo) => {
                  const status = getPromoStatus(
                    promo.FechaInicio,
                    promo.FechaFin
                  );
                  return (
                    <TableRow
                      key={promo.IdPromocion}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell onClick={() => handleOpenDetailDialog(promo)}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                            }}
                          >
                            {getTipoIcon(promo)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {promo.Nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {getTipoPromocion(promo)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleOpenDetailDialog(promo)}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.success.dark,
                          }}
                        >
                          {`${Math.round(promo.Descuento)}% Descuento`}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={() => handleOpenDetailDialog(promo)}>
                        <Typography variant="body2">
                          {formatDate(promo.FechaInicio)} -{" "}
                          {formatDate(promo.FechaFin)}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={() => handleOpenDetailDialog(promo)}>
                        <StatusBadge status={status.status}>
                          {status.icon}
                          <Box component="span" sx={{ ml: 1 }}>
                            {status.status}
                          </Box>
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(promo);
                              }}
                              sx={{
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.1
                                ),
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  ),
                                },
                              }}
                            >
                              <Edit fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "¿Estás seguro de eliminar esta promoción?"
                                  )
                                ) {
                                  handleDelete(promo.IdPromocion);
                                }
                              }}
                              sx={{
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.1
                                ),
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.2
                                  ),
                                },
                              }}
                            >
                              <Delete fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogo para crear/editar */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            p: 2,
          }}
        >
          <DialogTitle
            sx={{
              color: "inherit",
              p: 0,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Discount fontSize="large" />
            {dialogMode === "add" ? "Nueva Promoción" : "Editar Promoción"}
          </DialogTitle>
        </Box>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la promoción"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Descuento (%)"
                name="Descuento"
                type="number"
                value={formData.Descuento}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 100 }}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <Box sx={{ color: "text.secondary", ml: 1 }}>%</Box>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required size="small">
                <InputLabel>Tipo de promoción</InputLabel>
                <Select
                  value={formData.Tipo}
                  onChange={handleTipoChange}
                  label="Tipo de promoción"
                  variant="outlined"
                >
                  <MenuItem value="producto">Para producto específico</MenuItem>
                  <MenuItem value="categoria">Para categoría</MenuItem>
                  <MenuItem value="general">
                    General (todos los productos)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.Tipo === "producto" && (
              <Grid item xs={12}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Seleccionar producto</InputLabel>
                  <Select
                    name="IdProducto"
                    value={formData.IdProducto}
                    onChange={handleInputChange}
                    label="Seleccionar producto"
                    variant="outlined"
                  >
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre || p.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {formData.Tipo === "categoria" && (
              <Grid item xs={12}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Seleccionar categoría</InputLabel>
                  <Select
                    name="IdCategoria"
                    value={formData.IdCategoria}
                    onChange={handleInputChange}
                    label="Seleccionar categoría"
                    variant="outlined"
                  >
                    {categorias.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nombre || c.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha de inicio"
                type="date"
                name="FechaInicio"
                value={formData.FechaInicio}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <CalendarToday
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha de fin"
                type="date"
                name="FechaFin"
                value={formData.FechaFin}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <CalendarToday
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {formData.FechaInicio && formData.FechaFin && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Estado:
                  </Typography>
                  <StatusBadge
                    status={
                      getPromoStatus(formData.FechaInicio, formData.FechaFin)
                        .status
                    }
                  >
                    {
                      getPromoStatus(formData.FechaInicio, formData.FechaFin)
                        .icon
                    }
                    <Box component="span" sx={{ ml: 1 }}>
                      {
                        getPromoStatus(formData.FechaInicio, formData.FechaFin)
                          .status
                      }
                    </Box>
                  </StatusBadge>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: theme.palette.divider,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
            disabled={
              !formData.Nombre ||
              !formData.Descuento ||
              !formData.FechaInicio ||
              !formData.FechaFin ||
              (formData.Tipo === "producto" && !formData.IdProducto) ||
              (formData.Tipo === "categoria" && !formData.IdCategoria)
            }
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {dialogMode === "add" ? "Crear Promoción" : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de Detalle */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {selectedPromo && (
          <>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                p: 2,
              }}
            >
              <DialogTitle
                sx={{
                  color: "inherit",
                  p: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Discount fontSize="large" />
                Detalles de la Promoción
              </DialogTitle>
            </Box>
            <DialogContent dividers sx={{ pt: 3 }}>
              <Card
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  borderColor: theme.palette.divider,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {getTipoIcon(selectedPromo)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="div" fontWeight={600}>
                        {selectedPromo.Nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getTipoPromocion(selectedPromo)}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.success.main,
                            0.1
                          ),
                          borderRadius: 2,
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Descuento
                        </Typography>
                        <Typography
                          variant="h4"
                          color="success.dark"
                          fontWeight={700}
                        >
                          {`${Math.round(selectedPromo.Descuento)}%`}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          borderRadius: 2,
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Aplica a
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mt: 0.5 }}
                        >
                          {getAplicaA(selectedPromo)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Fecha de inicio
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(selectedPromo.FechaInicio)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Fecha de fin
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(selectedPromo.FechaFin)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Estado
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <StatusBadge
                          status={
                            getPromoStatus(
                              selectedPromo.FechaInicio,
                              selectedPromo.FechaFin
                            ).status
                          }
                          sx={{ px: 3, py: 1 }}
                        >
                          {
                            getPromoStatus(
                              selectedPromo.FechaInicio,
                              selectedPromo.FechaFin
                            ).icon
                          }
                          <Box
                            component="span"
                            sx={{ ml: 1, fontSize: "0.875rem" }}
                          >
                            {
                              getPromoStatus(
                                selectedPromo.FechaInicio,
                                selectedPromo.FechaFin
                              ).status
                            }
                          </Box>
                        </StatusBadge>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                startIcon={<ArrowBackIosNewIcon />}
                onClick={handleCloseDetailDialog}
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                  borderWidth: 2,
                  background: alpha(theme.palette.secondary.main, 0.06),
                  boxShadow: `0 0 8px 2px ${alpha(theme.palette.secondary.main, 0.13)}`,
                  filter:
                    "drop-shadow(0 0 4px " +
                    alpha(theme.palette.secondary.light, 0.18) +
                    ")",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: alpha(theme.palette.secondary.main, 0.18),
                    borderColor: theme.palette.secondary.dark,
                    color: theme.palette.secondary.dark,
                    boxShadow: `0 0 16px 4px ${alpha(theme.palette.secondary.main, 0.22)}`,
                    filter:
                      "drop-shadow(0 0 8px " +
                      alpha(theme.palette.secondary.light, 0.28) +
                      ")",
                  },
                }}
              >
                Volver
              </Button>
              <Button
                startIcon={<Edit />}
                onClick={() => {
                  handleCloseDetailDialog();
                  handleOpenDialog(selectedPromo);
                }}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  borderColor: theme.palette.info.main,
                  color: theme.palette.info.main,
                  fontWeight: 700,
                  borderWidth: 2,
                  background: alpha(theme.palette.info.main, 0.06),
                  boxShadow: `0 0 8px 2px ${alpha(theme.palette.info.main, 0.18)}`,
                  filter:
                    "drop-shadow(0 0 4px " +
                    alpha(theme.palette.info.light, 0.25) +
                    ")",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: alpha(theme.palette.info.main, 0.18),
                    borderColor: theme.palette.info.dark,
                    color: theme.palette.info.dark,
                    boxShadow: `0 0 16px 4px ${alpha(theme.palette.info.main, 0.28)}`,
                    filter:
                      "drop-shadow(0 0 8px " +
                      alpha(theme.palette.info.light, 0.35) +
                      ")",
                  },
                }}
              >
                Editar
              </Button>
              <Button
                startIcon={<Delete />}
                onClick={() => {
                  handleCloseDetailDialog();
                  if (
                    window.confirm("¿Estás seguro de eliminar esta promoción?")
                  ) {
                    handleDelete(selectedPromo.IdPromocion);
                  }
                }}
                variant="outlined"
                color="error"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  borderColor: theme.palette.error.light,
                  color: theme.palette.error.main,
                  fontWeight: 700,
                  borderWidth: 2,
                  background: alpha(theme.palette.error.main, 0.06),
                  boxShadow: `0 0 8px 2px ${alpha(theme.palette.error.main, 0.15)}`,
                  filter:
                    "drop-shadow(0 0 4px " +
                    alpha(theme.palette.error.light, 0.22) +
                    ")",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: alpha(theme.palette.error.main, 0.18),
                    borderColor: theme.palette.error.dark,
                    color: theme.palette.error.dark,
                    boxShadow: `0 0 16px 4px ${alpha(theme.palette.error.main, 0.28)}`,
                    filter:
                      "drop-shadow(0 0 8px " +
                      alpha(theme.palette.error.light, 0.32) +
                      ")",
                  },
                }}
              >
                Eliminar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{
            width: "100%",
            boxShadow: theme.shadows[3],
            alignItems: "center",
          }}
        >
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{
            width: "100%",
            boxShadow: theme.shadows[3],
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Promociones;
