import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Typography, RadioGroup,
  FormControlLabel, Radio, Alert, InputAdornment
} from "@mui/material";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ====== Config base backend ======
const RAW = import.meta.env.VITE_BASE_URL || "http://localhost:81/carstoolscr/";
const API_ROOT = RAW.endsWith("/") ? RAW : RAW + "/";
const BASE1 = `${API_ROOT}factura`;
const BASE2 = `${API_ROOT}index.php/factura`;

async function postWithFallback(path, data, opts = {}) {
  try { return await axios.post(`${BASE1}${path}`, data, opts); }
  catch (e) {
    if (e?.response?.status === 404) {
      return axios.post(`${BASE2}${path}`, data, opts);
    }
    throw e;
  }
}

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
      if (e?.response?.status === 404) continue;
    }
  }
  return false;
}

// ====== Helpers ======
// UI: símbolo “₡” (MUI/DOM lo soporta)
const CRC_UI = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" });
// PDF: evitar “₡” (la fuente base no lo trae)
function fmtCRC(n) {
  const x = toNum(n);
  return `CRC ${new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(x)}`;
}

// "¢22,045.00" -> 22045 ; "13%" -> 13
function toNum(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d,.-]/g, "").replace(/,/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  if (v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const luhnCheck = (n) => {
  const arr = onlyDigits(n).split("").reverse().map(Number);
  const sum = arr.reduce((acc, d, i) => acc + (i % 2 ? ((d*=2) > 9 ? d-9 : d) : d), 0);
  return sum % 10 === 0;
};
const validExpiry = (mmYY) => {
  const m = mmYY.match(/^(\d{2})\/?(\d{2})$/);
  if (!m) return false;
  const month = +m[1], year = 2000 + +m[2];
  if (month < 1 || month > 12) return false;
  const last = new Date(year, month, 0);
  const now  = new Date();
  return last >= new Date(now.getFullYear(), now.getMonth(), 1);
};
const formatCard = (v) => onlyDigits(v).slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
const formatExp  = (v) => { const d = onlyDigits(v).slice(0,4); return d.length<=2 ? d : d.slice(0,2)+"/"+d.slice(2); };
const mapMetodo  = (m) => m === "efectivo" ? "efectivo" : m === "credito" ? "tarjeta_credito" : "tarjeta_debito";

function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") return Object.values(v);
  return v == null ? [] : [v];
}

// ---------- Normalizadores ----------
function normalizeDetalle(det) {
  // Cantidad y precios
  const cantidad = toNum(det?.cantidad ?? det?.qty ?? 1);
  const costoBase      = toNum(det?.costo_base);
  const costoAdicional = toNum(det?.costo_adicional);
  let   precioUnit     = toNum(det?.precio_unitario ?? det?.precio);
  if (!precioUnit) precioUnit = costoBase + costoAdicional;

  let subtotalLinea = toNum(det?.subtotal);
  if (!subtotalLinea) subtotalLinea = cantidad * precioUnit;

  const ivaPct = toNum(det?.impuesto_porcentaje ?? det?.iva ?? det?.impuesto ?? 13);

  // Personalización
  const lines = [];
  if (det?.nombre_personalizado) lines.push(String(det.nombre_personalizado));

  let opciones = det?.opciones_personalizacion ?? det?.opciones ?? det?.personalizacion ?? null;
  if (typeof opciones === "string") { try { opciones = JSON.parse(opciones); } catch {} }
  if (Array.isArray(opciones)) {
    opciones.forEach((op, i) => {
      const nombre = op?.nombre ?? op?.label ?? `Opción ${i+1}`;
      const costo  = toNum(op?.costo ?? op?.precio);
      lines.push(`${nombre}: ${costo > 0 ? "(+" + fmtCRC(costo) + ")" : "0"}`);
    });
  } else if (opciones && typeof opciones === "object") {
    Object.entries(opciones).forEach(([k, v]) => {
      const costo = toNum(v?.costo ?? v?.precio ?? v);
      lines.push(`${k}: ${costo > 0 ? "(+" + fmtCRC(costo) + ")" : "0"}`);
    });
  }

  const esPersonalizado =
    !!(det?.nombre_personalizado || opciones || det?.es_personalizado);

  const nombreBase =
    det?.nombre ?? det?.nombre_producto ?? det?.producto_nombre ?? null;

  const nombreProducto = nombreBase
    ? (esPersonalizado ? `${nombreBase} - Personalizado` : nombreBase)
    : (det?.nombre_personalizado ? `${det.nombre_personalizado} - Personalizado` : "Producto");

  return {
    producto_id: det?.producto_id ?? det?.id ?? 0,
    nombre: nombreProducto,
    cantidad,
    precio_unitario: precioUnit,
    iva_porcentaje: ivaPct,
    personalizacion_text: lines.length ? lines.join("\n") : "Producto estándar",
    subtotal_line: subtotalLinea,
  };
}

function calcTotalsFromItems(items) {
  const subtotal = items.reduce((acc, it) => acc + toNum(it.subtotal_line), 0);
  const impuestos = items.reduce((acc, it) => (
    acc + toNum(it.subtotal_line) * (toNum(it.iva_porcentaje) / 100)
  ), 0);
  return { subtotal, impuestos, total: subtotal + impuestos };
}

// ---------- PDF ----------
function generatePDFClientPedido({ factura, pedidoData, items, totales, metodo }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 40;

  doc.setFontSize(18);
  doc.text("FACTURA COMERCIAL", left, 50);

  doc.setFontSize(11);
  const fecha = new Date().toLocaleString("es-CR");
  doc.text(`Número: #${factura?.id ?? pedidoData?.id ?? "-"}`, left, 70);
  doc.text(`Fecha: ${fecha}`, left, 86);

  // Datos cliente/pago
  const yBase = 120;
  doc.setFontSize(12); doc.setFont(undefined, "bold");
  doc.text("DATOS DEL CLIENTE", left, yBase);
  doc.text("INFORMACIÓN DEL PAGO", 330, yBase);
  doc.setFont(undefined, "normal"); doc.setFontSize(11);

  const clienteNombre =
    pedidoData?.cliente?.nombre ||
    pedidoData?.cliente_nombre ||
    pedidoData?.usuario?.nombre ||
    pedidoData?.usuario_nombre ||
    pedidoData?.nombre_cliente ||
    "-";

  const clienteDir =
    pedidoData?.cliente?.direccion ||
    pedidoData?.direccion_envio ||
    pedidoData?.direccion ||
    "-";

  const mp = metodo === "efectivo" ? "Efectivo" : (metodo === "credito" ? "Tarjeta de crédito" : "Tarjeta de débito");
  const estado = (factura?.estado ?? pedidoData?.estado ?? "en_proceso").replace("_", " ").toUpperCase();

  doc.text(`Cliente: ${clienteNombre}`, left, yBase + 20);
  doc.text(`Dirección: ${clienteDir}`, left, yBase + 36);
  doc.text(`Método de pago: ${mp}`, 330, yBase + 20);
  doc.text(`Estado: ${estado}`,       330, yBase + 36);

  // Tabla
  const head = [["Producto", "Personalización", "Cantidad", "P. Unitario", "Impuesto", "Subtotal"]];
  const body = items.map(it => {
    const sub = toNum(it.subtotal_line);
    return [
      it.nombre,
      (it.personalizacion_text || "").toString(),
      String(toNum(it.cantidad)),
      fmtCRC(toNum(it.precio_unitario)),
      `${toNum(it.iva_porcentaje).toFixed(0)}%`,
      fmtCRC(sub),
    ];
  });

  autoTable(doc, {
    head,
    body,
    startY: yBase + 60,
    styles: { fontSize: 10, cellPadding: 4, valign: "top" },
    headStyles: { fillColor: [23, 105, 170] },
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 190 },
      2: { halign: "right", cellWidth: 60 },
      3: { halign: "right", cellWidth: 90 },
      4: { halign: "right", cellWidth: 60 },
      5: { halign: "right", cellWidth: 90 },
    },
  });

  // Totales
  const y = (doc.lastAutoTable?.finalY || (yBase + 60)) + 18;
  doc.setFontSize(12);
  doc.text(`Subtotal: ${fmtCRC(totales.subtotal)}`, 360, y);
  doc.text(`Impuestos: ${fmtCRC(totales.impuestos)}`, 360, y + 18);
  doc.setFont(undefined, "bold");
  doc.text(`TOTAL: ${fmtCRC(totales.total)}`, 360, y + 36);
  doc.setFont(undefined, "normal");

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

// ====== Componente ======
export default function formaPagoPedido({
  open,
  onClose,
  total = 0,
  pedidoId,
  pedido,
  detalle,
  onSuccess
}) {
  const [metodo, setMetodo] = useState("credito");
  const [nombre, setNombre] = useState("");
  const [numTarjeta, setNumTarjeta] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [efectivo, setEfectivo] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [pedidoData, setPedidoData] = useState(pedido || null);
  const [detalleData, setDetalleData] = useState(detalle ? asArray(detalle) : null);

  useEffect(() => { setPedidoData(pedido || null); }, [pedido]);
  useEffect(() => { setDetalleData(detalle ? asArray(detalle) : null); }, [detalle]);

  // Carga pedido/detalle si no vienen por props
  useEffect(() => {
    if (!open) return;

    async function fetchPedido() {
      if (!pedidoId) return;
      if (pedidoData && detalleData) return;

      const candidates = [
        `${API_ROOT}pedido/${pedidoId}/factura-datos`,
        `${API_ROOT}factura/datos/${pedidoId}`,
        `${API_ROOT}index.php/pedido/${pedidoId}/factura-datos`,
        `${API_ROOT}index.php/factura/datos/${pedidoId}`,
      ];
      for (const url of candidates) {
        try {
          const { data } = await axios.get(url);
          if (!data) continue;

          const pd = data.pedido ?? data;
          setPedidoData(pd);

          const raw =
            data.detalle ?? data.detalles ?? data.items ?? data.lineas ??
            data.productos ?? data.productos_personalizados ??
            data.producto_personalizado ?? null;

          setDetalleData(raw ? asArray(raw) : []);

          // Si solo tenemos usuario_id, intenta traer nombre del usuario/cliente
          const uid = pd?.usuario_id ?? data?.usuario_id;
          const yaTieneNombre =
            pd?.cliente?.nombre || pd?.cliente_nombre || pd?.usuario?.nombre ||
            pd?.usuario_nombre || pd?.nombre_cliente;

          if (uid && !yaTieneNombre) {
            const userCandidates = [
              `${API_ROOT}usuario/${uid}`,
              `${API_ROOT}usuarios/${uid}`,
              `${API_ROOT}index.php/usuario/${uid}`,
              `${API_ROOT}clientes/${uid}`,
              `${API_ROOT}index.php/clientes/${uid}`,
            ];
            for (const u of userCandidates) {
              try {
                const r = await axios.get(u);
                const nombre = r?.data?.nombre ?? r?.data?.nombre_completo ?? r?.data?.full_name;
                const direccion = r?.data?.direccion ?? r?.data?.direccion_envio;
                if (nombre || direccion) {
                  setPedidoData(prev => ({
                    ...(prev || {}),
                    cliente_nombre: nombre ?? prev?.cliente_nombre,
                    direccion_envio: prev?.direccion_envio ?? direccion,
                  }));
                  break;
                }
              } catch {}
            }
          }
          return;
        } catch {}
      }
    }
    fetchPedido();
  }, [open, pedidoId, pedidoData, detalleData]);

  // Unifica TODAS las colecciones posibles (normales y personalizados)
  const baseDetalle = useMemo(() => {
    const parts = [];
    if (detalleData) parts.push(...asArray(detalleData));

    const pools = [
      "detalles","detalle","items","lineas",
      "productos","productos_personalizados","producto_personalizado",
      "productosPersonalizados","productos_normales","productos_pedido"
    ];
    pools.forEach(k => {
      if (pedidoData?.[k]) parts.push(...asArray(pedidoData[k]));
    });

    return parts;
  }, [detalleData, pedidoData]);

  // Ítems normalizados
  const items = useMemo(() => baseDetalle.map(normalizeDetalle), [baseDetalle]);

  // → Usa SIEMPRE el cálculo por ítems; solo usa props.total si no hay ítems válidos
  const totales = useMemo(() => {
    const calc = calcTotalsFromItems(items);
    if (items.length > 0 && calc.total > 0) return calc;

    const t = toNum(total);
    if (t > 0) {
      const sub = +(t / 1.13).toFixed(2);
      return { subtotal: sub, impuestos: +(t - sub).toFixed(2), total: t };
    }
    return { subtotal: 0, impuestos: 0, total: 0 };
  }, [items, total]);

  const totalMostrar = useMemo(() => +toNum(totales.total).toFixed(2), [totales]);

  // Cambio (efectivo)
  const cambio = useMemo(() => {
    const pago = toNum(efectivo);
    return +(pago - totalMostrar).toFixed(2);
  }, [efectivo, totalMostrar]);

  // Validación
  const validate = () => {
    if (!Array.isArray(items) || items.length === 0) return "El pedido no tiene líneas de detalle.";
    if (metodo === "efectivo") {
      const pago = toNum(efectivo);
      if (!pago) return "El monto debe ser numérico.";
      if (pago <= 0) return "El monto debe ser positivo.";
      if (pago < totalMostrar) return "El monto debe ser mayor o igual al total.";
      return "";
    }
    const digits = onlyDigits(numTarjeta);
    if (digits.length !== 16) return "La tarjeta debe tener 16 dígitos.";
    if (!luhnCheck(digits)) return "Número de tarjeta no supera validación Luhn.";
    if (!validExpiry(exp)) return "Fecha de expiración inválida o vencida (MM/YY).";
    if (!/^\d{3,4}$/.test(cvv)) return "CVV debe tener 3 o 4 dígitos.";
    if (!nombre.trim()) return "Nombre del titular requerido.";
    return "";
  };

  const formError = validate();
  const canSubmit = !formError && !loading;

  const downloadXML = (xml, id) => {
    try {
      const blob = new Blob([xml], { type: "application/xml" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `factura_${id || (pedidoId ?? "pedido")}.xml`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const pagar = async () => {
    setErr("");
    const v = validate();
    if (v) { setErr(v); return; }

    try {
      setLoading(true);

      const payload = {
        pedido_id: pedidoId ?? pedidoData?.id ?? null,
        metodo_pago: mapMetodo(metodo),
        items, // por si tu backend los usa; si no, con pedido_id basta
      };

      const res = await postWithFallback("/create", payload);
      const factura = res?.data;

      if (factura?.xml_factura) downloadXML(factura.xml_factura, factura.id);

      const opened = await tryOpenServerPDF(factura?.id);
      if (!opened) {
        generatePDFClientPedido({
          factura,
          pedidoData: pedidoData || {},
          items,
          totales,
          metodo,
        });
      }

      onSuccess && onSuccess(factura);
      handleClose();
    } catch (e) {
      const msg = e?.response?.data?.error || "Error al procesar el pago. Revisa el backend.";
      setErr(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMetodo("credito");
    setNombre(""); setNumTarjeta(""); setExp(""); setCvv("");
    setEfectivo(""); setErr("");
  };
  const handleClose = () => { resetForm(); onClose && onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Procesar pago</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Total a pagar: {CRC_UI.format(totalMostrar)}
        </Typography>

        <RadioGroup row value={metodo} onChange={(e) => setMetodo(e.target.value)} sx={{ mb: 2 }}>
          <FormControlLabel value="credito" control={<Radio />} label="Tarjeta de crédito" />
          <FormControlLabel value="debito" control={<Radio />} label="Tarjeta de débito" />
          <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
        </RadioGroup>

        {metodo === "efectivo" ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Monto recibido"
                fullWidth
                value={efectivo}
                onChange={(e) => setEfectivo(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">₡</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Vuelto"
                fullWidth
                value={CRC_UI.format(isNaN(cambio) || cambio < 0 ? 0 : cambio)}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Nombre del titular" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} />
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

        {(err || formError) && <Alert severity="error" sx={{ mt: 2 }}>{err || formError}</Alert>}

        <Alert severity="info" sx={{ mt: 2 }}>
          Es una simulación: solo se valida formato. No se contacta a pasarelas reales.
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={pagar} disabled={!canSubmit}>
          {loading ? "Procesando..." : "Pagar y generar factura"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
