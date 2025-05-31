import React from 'react';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import GenreService from '../../services/GenreService';
import ActorService from '../../services/ActorService';
import DirectorService from '../../services/DirectorService';
import { SelectDirector } from './Form/SelectDirector';
import { FormHelperText } from '@mui/material';
import { SelectGenres } from './Form/SelectGenres';
import { ActorsForm } from './Form/ActorsForm';
import MovieService from '../../services/MovieService';
import toast from 'react-hot-toast';
import ImageService from '../../services/ImageService';

export function CreateMovie() {
  const navigate = useNavigate();
  let formData=new FormData()
  // Esquema de validación
  const movieSchema = yup.object({
    title: yup
          .string()
          .required('El título es requerido')
          .min(2, "El título debe tener 2 carácteres"),
    time: yup
          .string()
          .required('La duración es requerida'),
    lang: yup
          .string()
          .required('El idioma es requerido'),
    year: yup
          .number()
          .typeError('Solo acepta números')
          .required('El año es requerido')
          .positive('Solo acepta números positivos'),
    director_id: yup
          .number()
          .typeError('Seleccione un director')
          .required('El director es requerido'),
    genres: yup.array().of(yup.number().required('Seleccione un género')).min(1,'Seleccione un género'),
    actors: yup.array().of(yup.object().shape({
      actor_id: yup.number().typeError('El actor es requerido')
            .required('El actor es requerido'),
      role: yup.string().required('El rol es requerido')
    }))
    
  });
  const {
    control, //register
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      'title':'',
      'year':'',
      'lang':'',
      'time':'',
      'director_id':'',
      'genres':[],
      'actors':[
        {
          actor_id:'',
          role:''
        }
      ],
      image:''
    },
    // Asignación de validaciones
    resolver: yupResolver(movieSchema),
  });

  // useFieldArray:
  // relaciones de muchos a muchos, con más campos además
  // de las llaves primaras
  const {fields,append,remove } =useFieldArray({
    control,
    name:'actors'
  })
  //Agregar un actor
  const addNewActor=()=>{
    append({
      actor_id:'',
      role:''
    })
  }
  //Eliminar un actor
  const removeActor=(index)=>{
    if(fields.length === 1){
      return
    }
    remove(index)
  }
  //Gestión de errores
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    console.log('Formulario:');
    console.log(DataForm);
    //Llamar al API
    try {
       if(movieSchema.isValid()){
        //Crear pelicula
        MovieService.createMovie(DataForm)
        .then((response)=>{
          setError(response.error)
          //Respuesta al usuario
          if(response.data !=null){
            //Gestionar imagen
            formData.append ("file",file)
            formData.append("movie_id",response.data.id)
            ImageService.createImage(formData)
            .then((response)=>{
              setError(response.error)
              if(response.data !=null){
                toast.success(response.data,{
                  duration:4000,
                  position: "top-center"
                })
                
              }
            })
            .catch((error) => {
              if (error instanceof SyntaxError) {
                console.log(error);
                setError(error);
                throw new Error('Respuesta no válida del servidor');
              }
            })
            toast.success(
              `Pelicula creada #${response.data.id} - ${response.data.title}`,
              {
                duration: 4000,
                position:'top-center'
              }
            )
            //Redirección tabla de peliculas  
            return navigate('/movie-table')
            }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        })
      } 
    } catch (error) {
      console.error(error)
    }
  };

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

  /* Gestion de imagen */
  const [file,setFile]=useState(null)
  const [fileURL, setFileURL]=useState(null)
  function handleChangeImage(e){
    if(e.target.files){
      setFileURL(
        URL.createObjectURL(e.target.files[0],e.target.files[0].name)
      )
      setFile(e.target.files[0],e.target.files[0].name)
    }
  }
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Crear Pelicula
            </Typography>
          </Grid>
          <Grid size={4} sm={4}>
            {/* ['filled','outlined','standard']. */}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Controlador y entrada de formulario title */}
              <Controller name='title' control={control}
              render={({field})=>(
                //Caja de texto
                <TextField 
                  {...field}
                  id="title"
                  label="Título"
                  error={Boolean(errors.title)}
                  helperText={errors.title ? errors.title.message : ''}
                />
              )}
               />

            </FormControl>
          </Grid>
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Controlador y entrada de formulario year */}
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
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Controlador y entrada de formulario time */}
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
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Controlador y entrada de formulario lang */}
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
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de directores */}
              {loadedDirector && (
                <Controller name='director_id' control={control}
                  render={({field})=>(
                    <SelectDirector
                      field={field}
                      data={dataDirector}
                     />
                  )}
                 />
              )}
              <FormHelperText sx={{color: '#d32f2f'}}>
                {errors.director_id ? errors.director_id.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de generos */}
              {loadedGenres && (
                <Controller name='genres' control={control} 
                  render={({field})=>(
                    <SelectGenres field={field} data={dataGenres}
                    error={Boolean(errors.genres)} />
                  )}
                />
              )}
              <FormHelperText sx={{color: '#d32f2f'}}>
                {errors.genres ? errors.genres.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
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
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Array de controles de actor */}
              {loadedActors && 
                fields.map((field,index)=>(
                  <div key={index}>
                    <ActorsForm
                    name='actors'
                    data={dataActors}
                    key={field.id}
                    index={index}
                    onRemove={removeActor}
                    control={control}
                    disableRemoveButton={fields.length === 1}
                     />
                  </div>
                ))
              }
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
              <FormControl variant='standard' fullWidth sx={{m:1}}>
                <Controller
                  name='image'
                  control={control}
                  render={({field})=>(
                    <input type='file' {...field} onChange={handleChangeImage} />
                  )}
                />
              </FormControl>
              <img src={fileURL} width={300}/>
          </Grid>
          <Grid size={12} sm={12}>
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
