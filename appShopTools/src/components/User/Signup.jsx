/* eslint-disable no-unused-vars */
import React from 'react';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserService from '../../services/UserService';
import { yupResolver } from '@hookform/resolvers/yup';

export function Signup() {
  const navigate = useNavigate();
  // Esquema de validación
  const loginSchema = yup.object({
    name: yup.string().required('El nombre es requerido'),
    email: yup
      .string()
      .required('El email es requerido')
      .email('Formato email'),
    password: yup.string().required('El password es requerido'),
    rol_id: yup.number().required('El rol es requerido'),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rol_id: 2,
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);
  const notify = () =>
    toast.success('Usuario registrado', {
      duration: 4000,
      position: 'top-center',
    });
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      console.log(DataForm);
      //Registrar usuario
      //Asignar por defector rol
      setValue('rol_id', 2);
      UserService.createUser(DataForm)
        .then((response) => {
          console.log(response);
          notify();
          return navigate('/user/login/');
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        });
    } catch (e) {
      // handle your error
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Registrar Usuario
            </Typography>
          </Grid>
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    label="Nombre"
                    error={Boolean(errors.name)}
                    helperText={errors.name ? errors.name.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    label="Email"
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="password"
                    label="Password"
                    type="password"
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
