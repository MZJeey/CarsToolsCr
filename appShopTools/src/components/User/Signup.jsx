// Formulario de registro mejorado para tienda de repuestos
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
    name: yup.string().required('El nombre es requerido'),
    email: yup.string().required('El email es requerido').email('Formato email inválido'),
    password: yup.string().required('La contraseña es requerida'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
      .required('Confirma tu contraseña'),
    birthdate: yup.date().required('La fecha de nacimiento es requerida'),
    rol_id: yup.number().required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      rol_id: 2,
    },
    resolver: yupResolver(signupSchema),
  });

  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    try {
      setValue('rol_id', 2);
      UserService.createUser(data)
        .then((response) => {
          toast.success('Usuario registrado', { duration: 4000, position: 'top-center' });
          return navigate('/user/login/');
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
      <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Registrar Cliente
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message || ' '}
                  />
                )}
              />
            </Grid>
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
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha de Nacimiento"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.birthdate}
                    helperText={errors.birthdate?.message || ' '}
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
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirmar Contraseña"
                    type="password"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message || ' '}
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
