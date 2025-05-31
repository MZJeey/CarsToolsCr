import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import RentalService from "../../services/RentalService";
//Documentación Recharts: https://recharts.org/en-US/
//Instalar: npm install recharts
export function GraphRetal() {
  const [dataReport1, setDataReport1] = useState([]);
  const [dataReport2, setDataReport2] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    RentalService.rentalbyMovie()
      .then((response) => {
        console.log(response);
        setDataReport1(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);
  const chartData = dataReport1.map((item) => ({
    name: item.pelicula, // Título de la película
    alquileres: item.cantidad_alquileres, // Cantidad de alquileres
  }));
  useEffect(() => {
    RentalService.rentalMonthbyShop()
      .then((response) => {
        console.log(response);
        // Transformar los datos para el gráfico
        const rawData = response.data;
        const transformedData = transformData(rawData);
        setDataReport2(transformedData);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);
  // Transformar los datos para agruparlos por tienda y mes
  const transformData = (rawData) => {
    const groupedData = {};
    rawData.forEach((item) => {
      const { shop_name, month, monthly_total } = item;
      if (!groupedData[month]) {
        groupedData[month] = { month };
      }
      groupedData[month][shop_name] = monthly_total;
    });

    return Object.values(groupedData);
  };
  const getRandomColor = () => {
    // Generar un matiz aleatorio (0 - 360)
    const hue = Math.floor(Math.random() * 360);
    
    // Mantener alta saturación y brillo óptimo para colores vivos
    const saturation = 90; // 90% de saturación
    const lightness = 60;  // 60% de luminosidad
    
    // Convertir HSL a RGB
    const hslToRgb = (h, s, l) => {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    };
    
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    
    // Convertir a formato hexadecimal
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};


  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Alquileres por película
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip labelFormatter={(value) => `Pelicula: ${value}`} />
          <Legend
            payload={[
              {
                value: "Alquileres",
                type: "line",
                id: "Alquileres",
                color: getRandomColor(),
              },
            ]}
          />
          <Line
            type="monotone"
            dataKey="alquileres"
            stroke={getRandomColor()}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <Typography variant="h5" gutterBottom>
        Total de Alquileres por mes y por Tienda
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dataReport2}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataReport2.length > 0 &&
            Object.keys(dataReport2[0])
              .filter((key) => key !== "month")
              .map((shop) => (
                <Bar key={shop} dataKey={shop} fill={getRandomColor()} />
              ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
