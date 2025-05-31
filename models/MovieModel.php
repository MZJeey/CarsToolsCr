<?php
class MovieModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
   /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        try {
            $imagenM=new ImageModel();
            //Consulta SQL
            $vSQL = "SELECT * FROM movie order by title desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Incluir imagenes
            if(!empty($vResultado) && is_array($vResultado)){
                for ($i=0; $i < count($vResultado); $i++) { 
                    $vResultado[$i]=$this->get($vResultado[$i]->id);

                    //$vResultado[$i]->imagen=$imagenM->getImageMovie(($vResultado[$i]->id));
                }
            }

            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
    public function get($id)
    {
        try {
            $directorM=new DirectorModel();
            $genreM=new GenreModel();
            $actorM=new ActorModel();
            $imagenM=new ImageModel();
            $vSql = "SELECT * FROM movie
                    where id=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if(!empty($vResultado)){
                $vResultado=$vResultado[0];
                //Imagenes
                $vResultado->imagen=$imagenM->getImageMovie(($vResultado->id));
                //Director
                $director=$directorM->get($vResultado->director_id);
                $vResultado->director=$director;
                //Generos --genres
                $listaGeneros=$genreM->getGenreMovie($vResultado->id);
                $vResultado->genres=$listaGeneros;
                //Actores --actors
                $listaActores=$actorM->getActorMovie($id);
                $vResultado->actors=$listaActores;
            }

            
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Obtener las peliculas por tienda
     * @param $idShopRental identificador de la tienda
     * @return $vresultado - Lista de peliculas incluyendo el precio
     */
    //
    public function moviesByShopRental($idShopRental)
    {
        try {
            $imagenM=new ImageModel();
            //Consulta SQL
            $vSQL = "SELECT m.*, i.price
                    FROM movie m, inventory i
                    where 
                    m.id=i.movie_id
                    and shop_id=$idShopRental
                    order by m.title desc";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            //Incluir imagenes
            if(!empty($vResultado) && is_array($vResultado)){
                for ($i=0; $i < count($vResultado); $i++) { 
                    $vResultado[$i]->imagen=$imagenM->getImageMovie(($vResultado[$i]->id));
                }
            }
            //Retornar la respuesta

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Obtener la cantidad de peliculas por genero
     * @param 
     * @return $vresultado - Cantidad de peliculas por genero
     */
    //
    public function getCountByGenre()
    {
        try {

            $vResultado = null;
            //Consulta sql
            $vSql = "SELECT count(mg.genre_id) as 'Cantidad', g.title as 'Genero'
			FROM genre g, movie_genre mg, movie m
			where mg.movie_id=m.id and mg.genre_id=g.id
			group by mg.genre_id";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Crear pelicula
     * @param $objeto pelicula a insertar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            //Identificador autoincrementable
            $sql = "Insert into movie (title, year, time, lang, director_id)".
                    " Values ('$objeto->title','$objeto->year',
                    '$objeto->time','$objeto->lang',$objeto->director_id)";

            //Ejecutar la consulta
            //Obtener ultimo insert
            $idMovie=$this->enlace->executeSQL_DML_last($sql);
             //--- Generos ---
            //Crear elementos a insertar en generos
            foreach ($objeto->genres as $value) {
                $sql="Insert into movie_genre(movie_id,genre_id)".
                    " Values($idMovie,$value)";
                $vResultadoGen=$this->enlace->executeSQL_DML($sql);
            }
            //--- Actores ---
            //Crear elementos a insertar en actores
           foreach ($objeto->actors as $item) {
                $sql="Insert into movie_cast(movie_id,actor_id,role)".
                     " Values($idMovie,$item->actor_id, '$item->role')";
                $vResultadoAct=$this->enlace->executeSQL_DML($sql);
           }
            //Retornar pelicula
            return $this->get($idMovie);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Actualizar pelicula
     * @param $objeto pelicula a actualizar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function update($objeto)
    {
        try {
            //Consulta sql
            $sql = "Update movie SET title ='$objeto->title'," .
                "year ='$objeto->year',time ='$objeto->time',lang ='$objeto->lang'," .
                "director_id=$objeto->director_id" .
                " Where id=$objeto->id";

            //Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);
             //--- Generos ---
             //Eliminar generos asociados a la pelicula
             $sql="Delete from movie_genre where movie_id=$objeto->id";
             $vResultadoD=$this->enlace->executeSQL_DML($sql);
            //Insertar generos
            foreach ($objeto->genres as $item) {
                $sql="Insert into movie_genre(movie_id,genre_id)".
                    " Values($objeto->id,$item)";
                $vResultadoG=$this->enlace->executeSQL_DML($sql);
            }
            //--- Actores ---
            //Eliminar actores asociados a la pelicula
             $sql="Delete from movie_cast where movie_id=$objeto->id";
             $vResultadoD=$this->enlace->executeSQL_DML($sql);
            //Crear actores
            foreach ($objeto->actors as $item) {
                $sql="Insert into movie_cast(movie_id,actor_id,role)".
                    " Values($objeto->id, $item->actor_id, '$item->role')";
                $vResultadoA=$this->enlace->executeSQL_DML($sql);
            }

            //Retornar pelicula
            return $this->get($objeto->id);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
