import React, { useEffect } from 'react';
import { useState } from 'react';
import MovieService from '../../services/MovieService';
import { ListCardMovies } from './ListCardMovies';

export function ListMovies() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  let idShopRental = 1;

//Llamar al API y obtener la lista de peliculas de una tienda
useEffect(() => {
  MovieService.getMovieByShopRental(idShopRental)
    .then((response) => {
      console.log(response);
      setData(response.data);
      setError(response.error);
      setLoaded(true);       
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof SyntaxError) {
        setError(error);
        setLoaded(false);
      }
    });
}, [idShopRental]);
if(!loaded) return <p>Cargando..</p>
if(error) return <p>Error: {error.message}</p>
return <>{data && <ListCardMovies data={data} isShopping={true} />}</>

  //const BASE_URL=import.meta.env.VITE_BASE_URL+'/uploads'
  //Llamar al API y obtener la lista de peliculas de una tienda
  /* useEffect(()=>{
    MovieService.getMovies()
    .then((response)=>{
      console.log(response)
      setData(response.data)
      setError(response.error)
      setLoaded(true)
    })
    .catch((error)=>{
      console.log(error)
      if(error instanceof SyntaxError){
        setError(error)
        setLoaded(false)
      }
    })
  },[])
  if(!loaded) return <p>Cargando...</p>
  if(error) return <p>Error: {error.message}</p>
  return (
    <Grid container sx={{ p: 2 }} spacing={3}>
      {data && data.map((item)=>(
        <Grid size={4} key={item.id}>
          <Card>
            <CardHeader
              sx={{
                p: 0,
                backgroundColor: (theme) => theme.palette.secondary.main,
                color: (theme) => theme.palette.common.white,
              }}
              style={{ textAlign: 'center' }}
              title={item.title}
              subheader={item.year}
            />
            <CardMedia
              component="img"
              image={`${BASE_URL}/${item.imagen?.image}`}
              alt="Nombre"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <AccessTime /> Tiempo: {item.time} minutos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Language /> Idioma: {item.lang}
              </Typography>
            </CardContent>
            <CardActions
              disableSpacing
              sx={{
                backgroundColor: (theme) => theme.palette.action.focus,
                color: (theme) => theme.palette.common.white,
              }}
            >
              <IconButton
                component={Link}
                to={`/movie/${item.id}`}
                aria-label="Detalle"
                sx={{ ml: 'auto' }}
              >
                <Info />
              </IconButton>
             
            </CardActions>
          </Card>
        </Grid>
  ))}
  </Grid>
  ) */
 
}
