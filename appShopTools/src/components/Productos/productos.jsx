import { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";

export default function AgregarProducto() {
  const [modoAgregar, setModoAgregar] = useState(false);
  const [listaProductos, setListaProductos] = useState([]);

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    anoCompatible: "",
    marcaCompatible: "",
    modeloCompatible: "",
    motorCompatible: "",
    certificaciones: "",
  });
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("/api/productos");
        if (res.ok) {
          const data = await res.json();
          setListaProductos(data);
        } else {
          console.error("Error al cargar productos");
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleImagenChange = (e) => {
    setImagenes([...e.target.files]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in producto) {
      formData.append(key, producto[key]);
    }
    imagenes.forEach((img) => formData.append("imagenes", img));

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Producto agregado exitosamente");
        setProducto({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          anoCompatible: "",
          marcaCompatible: "",
          modeloCompatible: "",
          motorCompatible: "",
          certificaciones: "",
        });
        setImagenes([]);
        setModoAgregar(false);

        // Recargar lista de productos
        const res = await fetch("/api/productos");
        if (res.ok) {
          const data = await res.json();
          setListaProductos(data);
        }
      } else {
        alert("Error al agregar el producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {!modoAgregar ? (
        <>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Grid item>
              <Typography variant="h6" fontWeight="bold">
                Lista de Productos
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => setModoAgregar(true)}>
                Agregar nuevo producto
              </Button>
            </Grid>
          </Grid>

          {listaProductos.length === 0 ? (
            <Typography>No hay productos disponibles.</Typography>
          ) : (
            <ul>
              {listaProductos.map((prod, index) => (
                <li key={index}>
                  <strong>{prod.nombre}</strong> - ${prod.precio}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Grid item>
              <Typography variant="h6" fontWeight="bold">
                Agregar Producto
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setModoAgregar(false)}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre del producto"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                type="number"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                name="stock"
                value={producto.stock}
                onChange={handleChange}
                type="number"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Año compatible"
                name="anoCompatible"
                value={producto.anoCompatible}
                onChange={handleChange}
                type="number"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Marca compatible"
                name="marcaCompatible"
                value={producto.marcaCompatible}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Modelo compatible"
                name="modeloCompatible"
                value={producto.modeloCompatible}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Motor compatible"
                name="motorCompatible"
                value={producto.motorCompatible}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Certificaciones"
                name="certificaciones"
                value={producto.certificaciones}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Seleccionar imágenes
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImagenChange}
                />
              </Button>
            </Grid>
            {imagenes.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2">Imágenes seleccionadas:</Typography>
                <ul>
                  {imagenes.map((img, index) => (
                    <li key={index}>{img.name}</li>
                  ))}
                </ul>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Agregar producto
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
