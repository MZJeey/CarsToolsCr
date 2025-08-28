// Signup.jsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Public,
  ArrowBack,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";

export function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paisesLoading, setPaisesLoading] = useState(true);

  const signupSchema = yup.object({
    nombre_usuario: yup
      .string()
      .required("El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    correo: yup
      .string()
      .required("El correo es requerido")
      .email("Correo inválido"),
    clave: yup
      .string()
      .required("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmar_clave: yup
      .string()
      .oneOf([yup.ref("clave")], "Las contraseñas no coinciden")
      .required("Confirma tu contraseña"),
    pais: yup.string().required("Selecciona un país"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre_usuario: "",
      correo: "",
      clave: "",
      confirmar_clave: "",
      pais: "",
    },
    resolver: yupResolver(signupSchema),
  });

  // Cargar países desde la API
  useEffect(() => {
    setPaisesLoading(true);
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          const sorted = data.data
            .map((pais) => pais.country)
            .sort((a, b) => a.localeCompare(b));
          setPaises(sorted);
        }
      })
      .catch((err) => {
        console.error("Error al cargar países:", err);
        // Lista de respaldo en caso de error
        setPaises(
          [
            "Argentina",
            "Chile",
            "Colombia",
            "España",
            "México",
            "Perú",
            "Estados Unidos",
            "Venezuela",
            "Ecuador",
            "Uruguay",
          ].sort()
        );
      })
      .finally(() => setPaisesLoading(false));
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    setError(null);

    const payload = {
      nombre_usuario: data.nombre_usuario,
      correo: data.correo,
      clave: data.clave,

      rol_id: 2, // cliente
    };

    UserService.createUser(payload)
      .then(() => {
        toast.success("Usuario registrado con éxito", {
          duration: 3000,
          position: "top-center",
        });
        navigate("/user/login/");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error al registrar usuario");
        toast.error("Error al registrar usuario");
      })
      .finally(() => setLoading(false));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          background: "linear-gradient(to bottom, #f9f9f9, #ffffff)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton component={Link} to="/" sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary"
          >
            Crear Cuenta
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Completa tus datos para registrarte en nuestra plataforma
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="nombre_usuario"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre completo"
                    fullWidth
                    error={!!errors.nombre_usuario}
                    helperText={errors.nombre_usuario?.message || " "}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="correo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    error={!!errors.correo}
                    helperText={errors.correo?.message || " "}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Campo País - Movido antes de las contraseñas */}
            <Grid item xs={12}>
              <Controller
                name="pais"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="País de residencia"
                    fullWidth
                    error={!!errors.pais}
                    helperText={errors.pais?.message || " "}
                    disabled={paisesLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Public color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {paisesLoading ? (
                      <MenuItem value="">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Cargando países...
                        </Box>
                      </MenuItem>
                    ) : (
                      paises.map((pais, index) => (
                        <MenuItem key={index} value={pais}>
                          {pais}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="clave"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    error={!!errors.clave}
                    helperText={errors.clave?.message || " "}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmar_clave"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirmar contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    error={!!errors.confirmar_clave}
                    helperText={errors.confirmar_clave?.message || " "}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Crear Cuenta"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes una cuenta?
          </Typography>
        </Divider>

        <Button
          component={Link}
          to="/user/login"
          variant="outlined"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Iniciar Sesión
        </Button>
      </Paper>
    </Container>
  );
}
