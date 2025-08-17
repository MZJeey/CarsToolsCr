import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ProductoPersonalizadoService from "../../services/ProductoPersonalizadoService";

// ---------- ENV para imágenes ----------
const UPLOADS_URL =
  import.meta.env.VITE_UPLOADS_URL || `${import.meta.env.VITE_BASE_URL}uploads`;

// ---------- estilos ----------
const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1, 0),
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const Img = styled("img")({
  width: "100%",
  height: 160,
  objectFit: "cover",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.08)",
});

// ---------- componente ----------
const PersonalizarProductoModal = ({
  open,
  onClose,
  productosBase = [], // opcional: si ya te vienen por props
  onConfirm,
  iva = 0.13,
}) => {
  // Listas de opciones (puedes moverlas a props si lo prefieres)
  const opcionesColor = [
    { id: "negro_mate", label: "Negro Mate", costo: 15000 },
    { id: "gris_metalico", label: "Gris Metálico", costo: 20000 },
    { id: "blanco_perla", label: "Blanco Perla", costo: 22000 },
  ];

  const opcionesMaterial = [
    { id: "plastico_estandar", label: "Plástico estándar", costo: 0 },
    { id: "plastico_reforzado", label: "Plástico reforzado", costo: 10000 },
    { id: "fibra_carbono", label: "Fibra de carbono", costo: 35000 },
  ];

  const opcionesAccesorios = [
    { id: "protector", label: "Protector antirrayas", costo: 5000 },
    { id: "sensores", label: "Sensores de proximidad", costo: 25000 },
    { id: "rejilla", label: "Rejilla personalizada", costo: 8000 },
  ];

  const opcionesGrabado = [
    { id: "sin", label: "Sin grabado", costo: 0 },
    { id: "logo", label: "Logotipo de marca", costo: 5000 },
    { id: "texto", label: "Texto personalizado", costo: 8000 },
  ];

  // ---------- estado ----------
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [color, setColor] = useState(opcionesColor[0].id);
  const [material, setMaterial] = useState(opcionesMaterial[0].id);
  const [accesorios, setAccesorios] = useState([]); // array de ids
  const [grabado, setGrabado] = useState("sin");
  const [grabadoTexto, setGrabadoTexto] = useState("");

  // lista local (puede venir de backend o del prop productosBase)
  const [listaProductos, setListaProductos] = useState(productosBase);

  // cargar lista cuando se abre el modal
  useEffect(() => {
    if (!open) return;
    ProductoPersonalizadoService.obtenerProductosBase()
      .then((res) => setListaProductos(res.data || []))
      .catch(console.error);
  }, [open]);

  // sincronizar si te pasan productosBase por props
  useEffect(() => {
    if (productosBase?.length) setListaProductos(productosBase);
  }, [productosBase]);

  // autoseleccionar el primero si no hay selección
  useEffect(() => {
    if (!productoId && (listaProductos?.length || 0) > 0) {
      setProductoId(String(listaProductos[0].id));
    }
  }, [listaProductos, productoId]);

  // helpers
  const formatCRC = (n) =>
    `₡${(Number(n) || 0).toLocaleString("es-CR", { maximumFractionDigits: 0 })}`;

  const productoBase = useMemo(
    () => listaProductos?.find((p) => String(p.id) === String(productoId)),
    [productoId, listaProductos]
  );

  const precioBase = Number(productoBase?.precio_base || 0);

  const costoColor = useMemo(
    () => opcionesColor.find((o) => o.id === color)?.costo ?? 0,
    [color]
  );

  const costoMaterial = useMemo(
    () => opcionesMaterial.find((o) => o.id === material)?.costo ?? 0,
    [material]
  );

  const costoAccesorios = useMemo(
    () =>
      accesorios
        .map((id) => opcionesAccesorios.find((a) => a.id === id)?.costo || 0)
        .reduce((s, n) => s + n, 0),
    [accesorios]
  );

  const costoGrabado = useMemo(
    () => opcionesGrabado.find((g) => g.id === grabado)?.costo ?? 0,
    [grabado]
  );

  const costoAdicional =
    costoColor + costoMaterial + costoAccesorios + costoGrabado;
  const precioUnitario = precioBase + costoAdicional;
  const subtotal = precioUnitario * cantidad;
  const totalConIVA = subtotal * (1 + iva);

  const opcionesSeleccionadas = useMemo(() => {
    const accSel = accesorios.map((id) =>
      opcionesAccesorios.find((a) => a.id === id)
    );
    return [
      {
        criterio: "Color de Pintura",
        opcion: opcionesColor.find((o) => o.id === color)?.label,
        costo: costoColor,
      },
      {
        criterio: "Material / Acabado",
        opcion: opcionesMaterial.find((o) => o.id === material)?.label,
        costo: costoMaterial,
      },
      ...accSel.map((a) => ({
        criterio: "Accesorio",
        opcion: a?.label,
        costo: a?.costo || 0,
      })),
      {
        criterio: "Grabado o Logotipo",
        opcion:
          opcionesGrabado.find((g) => g.id === grabado)?.label +
          (grabado === "texto" && grabadoTexto ? `: "${grabadoTexto}"` : ""),
        costo: costoGrabado,
      },
    ];
  }, [
    accesorios,
    color,
    costoColor,
    costoMaterial,
    costoGrabado,
    grabado,
    grabadoTexto,
    opcionesAccesorios,
    opcionesColor,
    opcionesGrabado,
    opcionesMaterial,
  ]);

  const handleToggleAccesorio = (id) => {
    setAccesorios((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmar = () => {
    try {
      if (!productoBase) return;

      const pedidoId = localStorage.getItem("ultimoPedidoId");
      if (!pedidoId) {
        throw new Error("No se encontró un pedido activo");
      }
      // 1) Construir opciones
      const opciones = [
        {
          grupo: "color",
          id: color,
          label: opcionesColor.find((o) => o.id === color)?.label,
          costo: Number(costoColor || 0),
        },
        {
          grupo: "material",
          id: material,
          label: opcionesMaterial.find((o) => o.id === material)?.label,
          costo: Number(costoMaterial || 0),
        },
        ...accesorios.map((id) => {
          const a = opcionesAccesorios.find((x) => x.id === id);
          return {
            grupo: "accesorio",
            id,
            label: a?.label,
            costo: Number(a?.costo || 0),
          };
        }),
        {
          grupo: "grabado",
          id: grabado,
          label: opcionesGrabado.find((g) => g.id === grabado)?.label,
          costo: Number(costoGrabado || 0),
          texto: grabado === "texto" && grabadoTexto ? grabadoTexto : null,
        },
      ];

      // 2) Totales crudos
      const costo_base = Number(precioBase);
      const costo_adicional = Number(costoAdicional);
      const precio_unit = Number(precioUnitario);
      const subtotal_sin_iva = Number(subtotal);
      const cant = Number(cantidad);

      // 3) IVA ► se manda y además se aplica al subtotal
      const iva_porcentaje = Number.isFinite(iva) ? Number(iva) : 0.13;
      const iva_monto = Number((subtotal_sin_iva * iva_porcentaje).toFixed(2));
      const total_con_iva = Number((subtotal_sin_iva + iva_monto).toFixed(2));

      // 4) Línea final (nota: subtotal ya va con IVA)
      const linea = {
        producto_id: Number(productoBase.id),
        pedido_id: Number(pedidoId),
        nombre_personalizado: `${productoBase.nombre} - Personalizado`.slice(
          0,
          100
        ),

        costo_base,
        costo_adicional,
        precio_unitario: precio_unit,
        subtotal: total_con_iva, // ⬅️ guardaremos el total con IVA
        cantidad: cant,

        iva_porcentaje,
        iva_monto,
        total_con_iva,

        opciones_personalizacion: opciones,
        opciones_personalizacion_json: JSON.stringify(opciones),
      };

      console.log("Enviando personalizado:", linea);
      onConfirm?.(linea);
      onClose?.();
    } catch (err) {
      console.error("Error al confirmar personalizado:", err);
    }
  };

  // construir URL de imagen segura
  const buildImg = (file) =>
    file ? `${UPLOADS_URL.replace(/\/$/, "")}/${file}` : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,
        }}
      >
        Detalles del Producto Personalizado
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* 1. Producto Base */}
          <CustomPaper elevation={0}>
            <SectionTitle variant="subtitle1">Producto Base</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="producto-base-label">
                    Seleccionar producto
                  </InputLabel>
                  <Select
                    labelId="producto-base-label"
                    label="Seleccionar producto"
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                  >
                    {listaProductos?.map((p) => (
                      <MenuItem key={p.id} value={String(p.id)}>
                        {p.nombre}
                        {p.codigo ? ` — ${p.codigo}` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  height="100%"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>Cantidad:</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Chip label={cantidad} sx={{ fontWeight: 600 }} />
                    <IconButton
                      size="small"
                      onClick={() => setCantidad((c) => c + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>

              {productoBase && (
                <>
                  <Grid item xs={12} md={4}>
                    <Img
                      src={
                        buildImg(productoBase.imagen) ||
                        "https://via.placeholder.com/400x250?text=Producto"
                      }
                      alt={productoBase.nombre}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {productoBase.nombre}
                    </Typography>

                    {productoBase.codigo && (
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        Código: {productoBase.codigo}
                      </Typography>
                    )}

                    <Typography>
                      Precio base: <b>{formatCRC(precioBase)}</b>
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </CustomPaper>

          {/* 2. Opciones de personalización */}
          <CustomPaper elevation={0}>
            <SectionTitle variant="subtitle1">
              Opciones de Personalización
            </SectionTitle>

            <Grid container spacing={2}>
              {/* Color */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Color de Pintura
                  </Typography>
                  <RadioGroup
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    {opcionesColor.map((o) => (
                      <FormControlLabel
                        key={o.id}
                        value={o.id}
                        control={<Radio />}
                        label={`${o.label} (${formatCRC(o.costo)})`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Material */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Material / Acabado
                  </Typography>
                  <RadioGroup
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    {opcionesMaterial.map((o) => (
                      <FormControlLabel
                        key={o.id}
                        value={o.id}
                        control={<Radio />}
                        label={`${o.label} (${formatCRC(o.costo)})`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Accesorios (múltiple) */}
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Accesorios Adicionales
                </Typography>
                <Grid container spacing={1}>
                  {opcionesAccesorios.map((a) => {
                    const checked = accesorios.includes(a.id);
                    return (
                      <Grid item key={a.id}>
                        <Chip
                          clickable
                          color={checked ? "primary" : "default"}
                          onClick={() => handleToggleAccesorio(a.id)}
                          label={`${a.label} (${formatCRC(a.costo)})`}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>

              {/* Grabado */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Grabado o Logotipo
                  </Typography>
                  <RadioGroup
                    value={grabado}
                    onChange={(e) => setGrabado(e.target.value)}
                  >
                    {opcionesGrabado.map((g) => (
                      <FormControlLabel
                        key={g.id}
                        value={g.id}
                        control={<Radio />}
                        label={`${g.label} (${formatCRC(g.costo)})`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              {grabado === "texto" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Texto del grabado"
                    value={grabadoTexto}
                    onChange={(e) => setGrabadoTexto(e.target.value)}
                    inputProps={{ maxLength: 40 }}
                    helperText="Máx. 40 caracteres"
                  />
                </Grid>
              )}
            </Grid>
          </CustomPaper>

          {/* Lista de opciones elegidas */}
          {(productoBase || opcionesSeleccionadas.length > 0) && (
            <CustomPaper elevation={0}>
              <SectionTitle variant="subtitle1">Selección actual</SectionTitle>
              <List dense disablePadding>
                {opcionesSeleccionadas.map((op, i) => (
                  <ListItem key={i} disableGutters>
                    <ListItemText
                      primary={`${op.criterio}: ${op.opcion}`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={`+ ${formatCRC(op.costo)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CustomPaper>
          )}

          {/* 3. Resumen financiero */}
          <CustomPaper elevation={0}>
            <SectionTitle variant="subtitle1">Resumen Financiero</SectionTitle>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SummaryItem>
                  <Typography>Costo base:</Typography>
                  <PriceText>{formatCRC(precioBase)}</PriceText>
                </SummaryItem>
              </Grid>
              <Grid item xs={6}>
                <SummaryItem>
                  <Typography>Adicionales:</Typography>
                  <PriceText>{formatCRC(costoAdicional)}</PriceText>
                </SummaryItem>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <SummaryItem>
                  <Typography>Precio unitario:</Typography>
                  <PriceText>{formatCRC(precioUnitario)}</PriceText>
                </SummaryItem>
              </Grid>

              <Grid item xs={12}>
                <SummaryItem sx={{ pt: 1 }}>
                  <Typography variant="subtitle2">
                    Subtotal ({cantidad} {cantidad > 1 ? "unidades" : "unidad"}
                    ):
                  </Typography>
                  <PriceText variant="subtitle1">
                    {formatCRC(subtotal)}
                  </PriceText>
                </SummaryItem>
              </Grid>

              <Grid item xs={12}>
                <SummaryItem>
                  <Typography>IVA ({Math.round(iva * 100)}%):</Typography>
                  <PriceText>{formatCRC(subtotal * iva)}</PriceText>
                </SummaryItem>
              </Grid>

              <Divider style={{ width: "100%" }} />

              <Grid item xs={12}>
                <SummaryItem>
                  <Typography variant="h6">Total:</Typography>
                  <PriceText variant="h6" sx={{ color: "primary.main" }}>
                    {formatCRC(totalConIVA)}
                  </PriceText>
                </SummaryItem>
              </Grid>
            </Grid>
          </CustomPaper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          Cerrar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!productoBase}
          onClick={confirmar}
        >
          Confirmar Pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonalizarProductoModal;
