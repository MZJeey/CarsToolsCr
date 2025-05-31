<?php
class ActorModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM actor;";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
				
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener */
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT * FROM actor where id=$id";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener los actores de una pelicula */
    public function getActorMovie($idMovie)
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT g.id, g.fname, g.lname, mg.role".
            " FROM actor g, movie_cast mg".
            " where g.id=mg.actor_id and mg.movie_id=$idMovie;";
            //Establecer conexión
            
            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);
            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
}
