import React from 'react';
import { useState } from 'react';
import MovieService from '../../services/MovieService';
import { useEffect } from 'react';
import { ListCardMovies } from './ListCardMovies';

export function CatalogMovies() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de peliculas
  useEffect(() => {
    MovieService.getMovies()
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
  }, []);

  if(!loaded) return <p>Cargando..</p>
  if(error) return <p>Error: {error.message}</p>
  return <>{data && <ListCardMovies data={data} isShopping={false} />}</>
 
}
