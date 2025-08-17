import ImpuestoService from "../services/ImpuestoService";

export const getImpuestoPorcentaje = async (impuestoId) => {
  try {
    const response = await ImpuestoService.getImpuesto();
    const impuesto = response.data.find((imp) => imp.ImpuestoId === impuestoId);
    return impuesto ? impuesto.porcentaje : 0;
  } catch (error) {
    console.error("Error al obtener impuesto:", error);
    return 0;
  }
};

export const calcularSubtotal = (precio, cantidad, impuestoPorcentaje = 0) => {
  const precioNumerico =
    typeof precio === "string"
      ? parseFloat(precio.replace(/[^0-9.-]/g, ""))
      : Number(precio);
  return precioNumerico * cantidad * (1 + impuestoPorcentaje / 100);
};
