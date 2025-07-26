import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Skeleton, Stack } from "@mui/material";
import EtiquetaServices from "../../services/EtiquetaService";

const Etiquetas = ({ idProducto }) => {
  const [etiquetas, setEtiquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idProducto) {
      setLoading(false);
      return;
    }

    const fetchEtiquetas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await EtiquetaServices.getEtiquetasPorProducto(idProducto);

        const receivedTags = response.data?.etiquetas || response.data || [];
        const tagsArray = Array.isArray(receivedTags) ? receivedTags : [];

        setEtiquetas(tagsArray);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Ocurrió un problema al cargar las etiquetas.");
      } finally {
        setLoading(false);
      }
    };

    fetchEtiquetas();
  }, [idProducto]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="30%" height={30} />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={60} height={32} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Etiquetas
      </Typography>

      {etiquetas.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {etiquetas.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.nombre}
              color="primary"
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Este producto no tiene etiquetas asignadas.
        </Typography>
      )}
    </Box>
  );
};

export default Etiquetas;
