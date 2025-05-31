import React from 'react';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import GenreService from '../../services/GenreService';
import ActorService from '../../services/ActorService';
import MovieService from '../../services/MovieService';
import { toast } from 'react-hot-toast';
import { SelectDirector } from './Form/SelectDirector';
import { SelectGenres } from './Form/SelectGenres';
import { ActorsForm } from './Form/ActorsForm';
import DirectorService from '../../services/DirectorService';


export function UpdateMovie() {
  const navigate = useNavigate();
  const routeParams = useParams();
  //Id de la pelicula a actualizar
  const id = routeParams.id || null;
  //Valores a precargar en el formulario, vienen del API
  const [values, setValores] = useState(null);
  //Obtener la pelicula del API
  useEffect(() => {
    //Llamar al API y obtener una pelicula
    if(id !=undefined && !isNaN(Number(id))){
      MovieService.getMovieById(id)
      .then((response) => {
        
        console.log(response.data);
        setError(response.error);
        //Dar formato a generos
        const genres=response.data.genres.map((item)=>item.id)
        response.data.genres=genres
        //Dar formato actores
        const actores=response.data.actors.map((item)=>({
          actor_id: item.id,
          role: item.role
        }))
        response.data.actors= actores
        
        setValores(response.data);
        
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error('Respuesta no válida del servidor');
      });
    }
   
  }, [id]);

  // Esquema de validación
  const movieSchema = yup.object({
    title: yup
      .string()
      .required('El título es requerido')
      .min(2, 'El título debe tener 2 caracteres'),
    time: yup.string().required('La duración es requerida'),
    year: yup
      .number()
      .typeError('Solo acepta números')
      .required('El año es requerido')
      .positive('Solo acepta números positivos'),
    lang: yup.string().required('El idioma es requerido'),
    director_id: yup
      .number()
      .typeError('El director es requerido')
      .required('El director es requerido'),
    genres: yup.array().min(1, 'El genero es requerido'),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      year: '',
      lang: '',
      time: '',
      director_id: '',
      genres: [],
      actors: [
        {
          actor_id: '',
          role: '',
        },
      ],
    },
    //Valores a precargar en el formulario
    values,
    // Asignación de validaciones
    resolver: yupResolver(movieSchema),
  });
  // useFieldArray:
  // relaciones de muchos a muchos, con más campos además
  // de las llaves primaras
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'actors',
  });
  // Eliminar actor de listado
  const removeActor = (index) => {
    if (fields.length === 1) {
      return;
    }
    remove(index);
  };
  // Agregar un nuevo actor
  const addNewActor = () => {
    append({
      actor_id: '',
      role: '',
    });
  };
  const [error, setError] = useState('');

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log('Formulario:');
    console.log(DataForm);

    try {
      if (movieSchema.isValid()) {
        //Crear pelicula
        MovieService.updateMovie(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);
            //Respuesta al usuario de creación
            if (response.data != null) {
             toast.success(`Pelicula actualizada #:${response.data.id} - ${response.data.title}`, {
                duration: 4000,
                position: 'top-center',
              });
              // Redireccion a la tabla
              return navigate('/movie-table');
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error('Respuesta no válida del servidor');
            }
          });
      }
    } catch (e) {
      //Capturar error
      console.error(e);
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  //Lista de Directores
  const [dataDirector, setDataDirector] = useState({});
  const [loadedDirector, setLoadedDirector] = useState(false);
  useEffect(() => {
    DirectorService.getDirectores()
      .then((response) => {
        console.log(response);
        setDataDirector(response.data);
        setLoadedDirector(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedDirector(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);
  //Lista de Generos
  const [dataGenres, setDataGenres] = useState({});
  const [loadedGenres, setLoadedGenres] = useState(false);
  useEffect(() => {
    GenreService.getGenres()
      .then((response) => {
        console.log(response);
        setDataGenres(response.data);
        setLoadedGenres(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedGenres(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);
  //Lista de actores
  const [dataActors, setDataActors] = useState({});
  const [loadedActors, setLoadedActors] = useState(false);
  useEffect(() => {
    ActorService.getActors()
      .then((response) => {
        console.log(response);
        setDataActors(response.data);
        setLoadedActors(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedActors(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Actualizar Pelicula
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* ['filled','outlined','standard']. */}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="title"
                    label="Título"
                    error={Boolean(errors.title)}
                    helperText={errors.title ? errors.title.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="year"
                    label="Año"
                    error={Boolean(errors.year)}
                    helperText={errors.year ? errors.year.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* ['filled','outlined','standard']. */}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="time"
                    label="Minutos"
                    error={Boolean(errors.time)}
                    helperText={errors.time ? errors.time.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="lang"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="lang"
                    label="Idioma"
                    error={Boolean(errors.lang)}
                    helperText={errors.lang ? errors.lang.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de directores */}
              {loadedDirector && (
                <Controller
                  name="director_id"
                  control={control}
                  render={({ field }) => (
                    <SelectDirector
                      field={field}
                      data={dataDirector}
                      error={Boolean(errors.director_id)}
                      onChange={(e) =>
                        setValue('director_id', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
              )}
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.director_id ? errors.director_id.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de generos */}
              {loadedGenres && (
                <Controller
                  name="genres"
                  control={control}
                  render={({ field }) => (
                    <SelectGenres
                      field={field}
                      data={dataGenres}
                      error={Boolean(errors.genres)}
                      onChange={(e) =>
                        setValue('genres', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                />
              )}
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.genres ? errors.genres.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Typography variant="h6" gutterBottom>
                Actores
                <Tooltip title="Agregar Actor">
                  <span>
                    <IconButton color="secondary" onClick={addNewActor}>
                      <AddIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Typography>
              {/* Array de controles de actor */}
              {loadedActors &&
                fields.map((field, index) => (
                  <>
                    <ActorsForm
                      name="actors"
                      field={field}
                      data={dataActors}
                      key={field.id}
                      index={index}
                      onRemove={removeActor}
                      control={control}
                      disableRemoveButton={fields.length === 1}
                      onChange={(e) =>
                        setValue('actors', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </>
                ))}
              <FormHelperText sx={{ color: '#d32f2f' }}>
                {errors.actors ? errors.actors.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
