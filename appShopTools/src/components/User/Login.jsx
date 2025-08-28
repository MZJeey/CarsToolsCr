import { useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
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
  Email,
  Lock,
  ArrowBack,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { UserContext } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginSchema = yup.object({
    correo: yup
      .string()
      .required("El correo es requerido")
      .email("Formato correo inválido"),
    clave: yup.string().required("La contraseña es requerida"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      correo: "",
      clave: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (DataForm) => {
    setLoading(true);
    setError(null);

    try {
      UserService.loginUser(DataForm)
        .then((response) => {
          if (
            response.data != null &&
            response.data != "undefined" &&
            response.data != "Usuario no valido"
          ) {
            // Usuario válido o identificado
            saveUser(response.data);

            const decodedToken = jwtDecode(response.data);
            const userRole = decodedToken.rol.nombre;

            localStorage.setItem("userRole", userRole);

            const welcomeMessage =
              userRole === "administrador"
                ? "¡Bienvenido Administrador!"
                : "¡Bienvenido Cliente!";

            toast.success(welcomeMessage, {
              duration: 4000,
            });

            navigate("/");
          } else {
            // Usuario No válido
            setError("Credenciales inválidas. Por favor, verifica tus datos.");
            toast.error("Credenciales inválidas", {
              duration: 4000,
            });
          }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            setError("Error en la respuesta del servidor");
            console.error("Error de sintaxis:", error);
          } else {
            setError("Error al conectar con el servidor");
            console.error("Error:", error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error("Error:", e);
      setError("Ocurrió un error inesperado");
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Toaster />
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
            Iniciar Sesión
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ingresa tus credenciales para acceder a tu cuenta
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

            <Grid item xs={12}>
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

            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "none",
                    color: "primary.dark",
                  },
                }}
                onClick={() => navigate("/recuperar-contrasena")}
              >
                ¿Olvidaste tu contraseña?
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ¿No tienes una cuenta?
          </Typography>
        </Divider>

        <Button
          component={Link}
          to="/user/create"
          variant="outlined"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Crear Cuenta
        </Button>
      </Paper>
    </Container>
  );
}
