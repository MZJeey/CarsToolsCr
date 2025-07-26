// Signup.jsx
import { useState } from 'react';
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
import toast from 'react-hot-toast';
import UserService from '../../services/UserService';

export function Signup() {
  const navigate = useNavigate();

  const signupSchema = yup.object({
    nombre_usuario: yup.string().required('El nombre es requerido'),
    correo: yup.string().required('El correo es requerido').email('Correo inválido'),
    clave: yup.string().required('La contraseña es requerida'),
    confirmar_clave: yup
      .string()
      .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden')
      .required('Confirma tu contraseña'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre_usuario: '',
      correo: '',
      clave: '',
      confirmar_clave: '',
    },
    resolver: yupResolver(signupSchema),
  });

  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    const payload = {
      nombre_usuario: data.nombre_usuario,
      correo: data.correo,
      clave: data.clave,
      rol_id: 2, // cliente
    };

    UserService.createUser(payload)
      .then(() => {
        toast.success('Usuario registrado con éxito', { duration: 3000, position: 'top-center' });
        navigate('/user/login/');
      })
      .catch((err) => {
        setError(err);
        toast.error('Error al registrar usuario');
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Registro de Cliente
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="nombre_usuario"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    error={!!errors.nombre_usuario}
                    helperText={errors.nombre_usuario?.message || ' '}
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
                    label="Correo Electrónico"
                    fullWidth
                    error={!!errors.correo}
                    helperText={errors.correo?.message || ' '}
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
                    type="password"
                    fullWidth
                    error={!!errors.clave}
                    helperText={errors.clave?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmar_clave"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirmar Contraseña"
                    type="password"
                    fullWidth
                    error={!!errors.confirmar_clave}
                    helperText={errors.confirmar_clave?.message || ' '}
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
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Registrarse
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Typography color="error">Error: {error.message}</Typography>}
      </Paper>
    </Container>
  );
}
