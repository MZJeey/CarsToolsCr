<?php
class RentalMovieModel{
    public $enlace;
    public function __construct() {
        
        $this->enlace=new MySqlConnect();
       
    }
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM rental_movie;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
           
				
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }

    public function getRental($idRental){
        try {
            //Consulta sql
			$vSql = "SELECT rm.movie_id, rm.price, rm.days,rm.subtotal, m.title 
                    FROM rental_movie rm, movie m
                    where m.id=rm.movie_id
                    and rm.rental_id=$idRental";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
    
}