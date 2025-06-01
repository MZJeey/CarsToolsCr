// Este nuevo diseño usa MUI mejorado con un layout más atractivo para la tienda de repuestos
import { useState, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import UserService from '../../services/UserService';
import { UserContext } from '../../context/UserContext';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  const loginSchema = yup.object({
    email: yup.string().required('El email es requerido').email('Formato email inválido'),
    password: yup.string().required('La contraseña es requerida'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    try {
      UserService.loginUser(data)
        .then((response) => {
          if (
            response.data &&
            response.data !== 'undefined' &&
            response.data !== 'Usuario no valido'
          ) {
            saveUser(response.data);
            toast.success('¡Bienvenido!', { duration: 4000 });
            return navigate('/');
          } else {
            toast.error('Usuario No válido', { duration: 4000 });
          }
        })
        .catch((err) => {
          setError(err);
          console.error('Error:', err);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <Container maxWidth="sm">
      <Toaster />
      <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo Electrónico"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message || ' '}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate('/recuperar-contrasena')}
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
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Iniciar Sesión
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Typography color="error">Error: {error.message}</Typography>}
      </Paper>
    </Container>
  );
}
