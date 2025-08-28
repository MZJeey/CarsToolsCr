// src/components/pedidos/FormaPagoModal.jsx
import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  InputAdornment,
} from "@mui/material";
import axios from "axios";

// ⬇️ NUEVO: imports para PDF cliente
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Base del backend
const RAW = import.meta.env.VITE_BASE_URL || "http://localhost:81/carstoolscr/";
const API_ROOT = RAW.endsWith("/") ? RAW : RAW + "/";
const BASE1 = `${API_ROOT}factura`;
const BASE2 = `${API_ROOT}index.php/factura`;

async function postWithFallback(path, data, opts = {}) {
  try {
    return await axios.post(`${BASE1}${path}`, data, opts);
  } catch (e) {
    if (e?.response?.status === 404) {
      return axios.post(`${BASE2}${path}`, data, opts);
    }
    throw e;
  }
}

// ⬇️ NUEVO: intenta abrir PDF del backend; si 404, devuelve false
async function tryOpenServerPDF(id) {
  const candidates = [`${BASE1}/pdf/${id}`, `${BASE2}/pdf/${id}`];
  for (const url of candidates) {
    try {
      const res = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const href = URL.createObjectURL(blob);
      window.open(href, "_blank", "noopener,noreferrer");
      return true;
    } catch (e) {
      if (e?.response?.status === 404) continue; // prueba el siguiente
    }
  }
  return false;
}

// Intenta leer el carrito con varias claves posibles (igual que tenías)
function readCarritoLS() {
  const keys = [
    "carrito",
    "cart",
    "cartItems",
    "productosCarrito",
    "shoppingCart",
    "carrito_items",
    "itemsCarrito",
  ];
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch {}
  }
  try {
    const raw = localStorage.getItem("carrito");
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && Array.isArray(obj.items) && obj.items.length > 0)
        return obj.items;
    }
  } catch {}
  return [];
}

// ⬇️ NUEVO: helper para Colones
const CRC = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
});

// ⬇️ NUEVO: genera PDF en el cliente con los datos de la factura
function generatePDFClient({ factura, items, totalMostrar, metodo }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 40;
  const top = 50;

  doc.setFontSize(16);
  doc.text("Factura", left, top);

  doc.setFontSize(10);
  const fecha = new Date().toLocaleString("es-CR");
  doc.text(`Factura #${factura?.id ?? "TEMP"}`, left, top + 18);
  doc.text(`Fecha: ${fecha}`, left, top + 34);
  const mp =
    metodo === "efectivo"
      ? "Efectivo"
      : metodo === "credito"
        ? "Tarjeta de crédito"
        : "Tarjeta de débito";
  doc.text(`Método de pago: ${mp}`, left, top + 50);

  // Tabla de items
  const rows = (items || []).map((it) => {
    const cant = Number(it.cantidad || 0);
    const pu = Number(it.precio_unitario || 0);
    const sub = cant * pu;
    return [
      String(cant),
      it.nombre || "Producto",
      CRC.format(pu),
      CRC.format(sub),
    ];
  });

  autoTable(doc, {
    head: [["Cant.", "Descripción", "Precio unit.", "Subtotal"]],
    body: rows,
    startY: top + 70,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [23, 105, 170] },
    columnStyles: {
      0: { halign: "right", cellWidth: 50 },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // Totales (CR suele usar IVA 13%)
  const finalY = doc.lastAutoTable.finalY || top + 70;
  const subtotal = rows.reduce((acc, r) => {
    const val = Number((r[3] || "").replace(/[^\d.-]/g, "")); // del texto "₡x"
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const iva = subtotal * 0.13;
  const total = factura?.total ?? subtotal + iva;

  let y = finalY + 16;
  doc.setFontSize(11);
  doc.text(`Subtotal: ${CRC.format(subtotal)}`, 400, y);
  y += 16;
  doc.text(`IVA (13%): ${CRC.format(iva)}`, 400, y);
  y += 16;
  doc.setFont(undefined, "bold");
  doc.text(`Total: ${CRC.format(totalMostrar || total)}`, 400, y);
  doc.setFont(undefined, "normal");

  // Abrir PDF en nueva ventana
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function FormaPagoModal({
  open,
  onClose,
  total = 0,
  onSuccess,
}) {
  const [metodo, setMetodo] = useState("credito");
  const [nombre, setNombre] = useState("");
  const [numTarjeta, setNumTarjeta] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [efectivo, setEfectivo] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onlyDigits = (s) => (s || "").replace(/\D/g, "");
  const luhnCheck = (n) => {
    const arr = onlyDigits(n).split("").reverse().map(Number);
    const sum = arr.reduce(
      (acc, d, i) => acc + (i % 2 ? ((d *= 2) > 9 ? d - 9 : d) : d),
      0
    );
    return sum % 10 === 0;
  };
  const validExpiry = (mmYY) => {
    const m = mmYY.match(/^(\d{2})\/?(\d{2})$/);
    if (!m) return false;
    const month = +m[1],
      year = 2000 + +m[2];
    if (month < 1 || month > 12) return false;
    const last = new Date(year, month, 0);
    const now = new Date();
    return last >= new Date(now.getFullYear(), now.getMonth(), 1);
  };
  const formatCard = (v) =>
    onlyDigits(v)
      .slice(0, 16)
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  const formatExp = (v) => {
    const d = onlyDigits(v).slice(0, 4);
    return d.length <= 2 ? d : d.slice(0, 2) + "/" + d.slice(2);
  };
  const mapMetodo = (m) => {
    console.log("Mapeando método:", m);
    const mapped =
      m === "efectivo"
        ? "efectivo"
        : m === "credito"
          ? "tarjeta_credito"
          : "tarjeta_debito";
    console.log("Método mapeado:", mapped);
    return mapped;
  };

  const carrito = useMemo(() => (open ? readCarritoLS() : []), [open]);

  const totalCarrito = useMemo(() => {
    if (!Array.isArray(carrito)) return 0;
    return carrito.reduce((acc, it) => {
      const cant = Number(it.cantidad ?? it.qty ?? 0);
      const precio = Number(it.precio ?? it.precio_unitario ?? 0);
      return acc + (Number.isFinite(cant * precio) ? cant * precio : 0);
    }, 0);
  }, [carrito]);

  const totalMostrar = Number((total || totalCarrito || 0).toFixed(2));

  const cambio = useMemo(() => {
    const pago = parseFloat(efectivo || "0");
    if (isNaN(pago)) return 0;
    return +(pago - totalMostrar).toFixed(2);
  }, [efectivo, totalMostrar]);

  const validate = () => {
    if (
      (!Array.isArray(carrito) || carrito.length === 0) &&
      totalMostrar <= 0
    ) {
      return "El carrito está vacío.";
    }
    if (metodo === "efectivo") {
      const pago = Number(efectivo);
      if (!efectivo || isNaN(pago)) return "El monto debe ser numérico.";
      if (pago <= 0) return "El monto debe ser positivo.";
      if (pago < totalMostrar)
        return "El monto debe ser mayor o igual al total.";
      return "";
    }
    const digits = onlyDigits(numTarjeta);
    if (digits.length !== 16) return "La tarjeta debe tener 16 dígitos.";
    if (!luhnCheck(digits))
      return "Número de tarjeta no supera validación Luhn.";
    if (!validExpiry(exp))
      return "Fecha de expiración inválida o vencida (MM/YY).";
    if (!/^\d{3,4}$/.test(cvv)) return "CVV debe tener 3 o 4 dígitos.";
    if (!nombre.trim()) return "Nombre del titular requerido.";
    return "";
  };

  const formError = validate();
  const canSubmit = !formError && !loading;

  const downloadXML = (xml, id) => {
    try {
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura_${id || "carrito"}.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const pagar = async () => {
    setErr("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    try {
      setLoading(true);

      // Normaliza items
      let items = [];
      if (Array.isArray(carrito) && carrito.length > 0) {
        items = carrito.map((x) => ({
          producto_id: x.id ?? x.producto_id ?? 0,
          nombre: (x.nombre ?? x.nombre_producto ?? "Producto").toString(),
          cantidad: Number(x.cantidad ?? x.qty ?? 1),
          precio_unitario: Number(x.precio ?? x.precio_unitario ?? 0),
        }));
      } else {
        items = [
          {
            producto_id: 0,
            nombre: "Carrito",
            cantidad: 1,
            precio_unitario: totalMostrar,
          },
        ];
      }

      const payload = {
        pedido_id: null,
        metodo_pago: mapMetodo(metodo),
        items: items,
      };

      console.log("Enviando payload:", JSON.stringify(payload, null, 2));
      console.log("URL base:", BASE1);

      const res = await postWithFallback("/create", payload);
      const factura = res?.data;

      console.log("Factura creada exitosamente:", factura);

      // 1) Descarga XML si lo manda el backend
      if (factura?.xml_factura) {
        downloadXML(factura.xml_factura, factura.id);
      }

      // 2) Intentar abrir PDF del backend; si no existe, generar en cliente
      const opened = await tryOpenServerPDF(factura?.id);
      if (!opened) {
        console.log("Generando PDF localmente...");
        generatePDFClient({ factura, items, totalMostrar, metodo });
      }

      // Callback al padre y cerrar todo
      onSuccess && onSuccess(factura);
      handleClose();
    } catch (e) {
      console.error("Error completo:", e);
      console.error("Respuesta del error:", e.response?.data);

      // Muestra más detalles del error
      const serverError =
        e.response?.data?.error ||
        e.response?.data?.message ||
        "Error interno del servidor (500)";

      setErr(`Error del servidor: ${serverError}. Se generará PDF localmente.`);

      // GENERAR PDF DE EMERGENCIA SI HAY ERROR
      try {
        let emergencyItems = [];
        if (Array.isArray(carrito) && carrito.length > 0) {
          emergencyItems = carrito.map((x) => ({
            producto_id: x.id ?? x.producto_id ?? 0,
            nombre: (x.nombre ?? x.nombre_producto ?? "Producto").toString(),
            cantidad: Number(x.cantidad ?? x.qty ?? 1),
            precio_unitario: Number(x.precio ?? x.precio_unitario ?? 0),
          }));
        } else {
          emergencyItems = [
            {
              producto_id: 0,
              nombre: "Carrito",
              cantidad: 1,
              precio_unitario: totalMostrar,
            },
          ];
        }

        // Generar PDF localmente aunque falle el backend
        generatePDFClient({
          factura: {
            id: "temp-" + Date.now(),
            total: totalMostrar,
          },
          items: emergencyItems,
          totalMostrar,
          metodo,
        });

        // Callback al padre con datos temporales
        onSuccess &&
          onSuccess({
            id: "temp-" + Date.now(),
            total: totalMostrar,
            xml_factura: null,
          });
      } catch (pdfError) {
        console.error("Error generando PDF de emergencia:", pdfError);
        setErr(`Error grave: No se pudo generar el PDF. Contacte soporte.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMetodo("credito");
    setNombre("");
    setNumTarjeta("");
    setExp("");
    setCvv("");
    setEfectivo("");
    setErr("");
  };
  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Procesar pago</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Total a pagar: {CRC.format(totalMostrar)}
        </Typography>

        <RadioGroup
          row
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="credito"
            control={<Radio />}
            label="Tarjeta de crédito"
          />
          <FormControlLabel
            value="debito"
            control={<Radio />}
            label="Tarjeta de débito"
          />
          <FormControlLabel
            value="efectivo"
            control={<Radio />}
            label="Efectivo"
          />
        </RadioGroup>

        {metodo === "efectivo" ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Monto recibido"
                fullWidth
                value={efectivo}
                onChange={(e) => setEfectivo(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₡</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Vuelto"
                fullWidth
                value={CRC.format(isNaN(cambio) || cambio < 0 ? 0 : cambio)}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del titular"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Número de tarjeta"
                placeholder="0000 0000 0000 0000"
                fullWidth
                value={numTarjeta}
                onChange={(e) => setNumTarjeta(formatCard(e.target.value))}
                inputProps={{ inputMode: "numeric" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiración (MM/YY)"
                placeholder="MM/YY"
                fullWidth
                value={exp}
                onChange={(e) => setExp(formatExp(e.target.value))}
                inputProps={{ inputMode: "numeric", maxLength: 5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                fullWidth
                value={cvv}
                onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
                inputProps={{ inputMode: "numeric", maxLength: 4 }}
              />
            </Grid>
          </Grid>
        )}

        {(err || formError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {err || formError}
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          Es una simulación: solo se valida formato. No se contacta a pasarelas
          reales.
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={pagar} disabled={!canSubmit}>
          {loading ? "Procesando..." : "Pagar y generar factura"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
