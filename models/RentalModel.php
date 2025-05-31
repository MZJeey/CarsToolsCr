<?php
class RentalModel{
    public $enlace;
    public function __construct() {
        
        $this->enlace=new MySqlConnect();
       
    }
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM rental order by rental_date asc;";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
            if(!empty($vResultado) && is_array($vResultado)){
                for ($i=0; $i <= count($vResultado)-1; $i++) { 
                    $vResultado[$i]=$this->get($vResultado[$i]->id);
                }
                
            }
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }

    public function get($id){
        $vResultado=null;
        try {
            $rentalMovieM=new RentalMovieModel();
            $shopM=new ShopRentalModel();
            $userM=new UserModel();
            //Consulta sql
			$vSql = "SELECT * FROM rental where id=$id";           
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
            if (!empty($vResultado)) {
                $vResultado=$vResultado[0];
                //Tienda
                $vResultado->shopRental=$shopM->get($vResultado->shop_id);
                //Cliente
                $vResultado->customer=$userM->get($vResultado->customer_id);
                //Lista de peliculas
                $vResultado->movies=$rentalMovieM->getRental($id);
            }
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
    
	public function create($objeto) {
        try {
            $fechaReact = $objeto->rental_date;
            // Crear un objeto DateTime a partir de la cadena de fecha
            // Convertir la fecha al formato deseado para la base de datos
            $fechaBD = date('Y-m-d', strtotime($fechaReact));
            
            //Consulta sql
            
			$vSql = "INSERT INTO movie_rental.rental
                (shop_id,
                customer_id,
                rental_date,
                total)
                VALUES
                ('$objeto->shop_id',
                '$objeto->customer_id',
                '$fechaBD',
                '$objeto->total');";
			
            //Ejecutar la consulta
			$idRental = $this->enlace->executeSQL_DML_last( $vSql);
            //Insertar peliculas
            foreach ($objeto->movies as $item) {
                $sql="INSERT INTO movie_rental.rental_movie
                    (rental_id,
                    movie_id,
                    price,
                    days,
                    subtotal)
                    VALUES
                    ($idRental,
                    $item->id,
                    $item->price,
                    $item->days,
                    $item->subtotal);";
                $vResultadoM= $this->enlace->executeSQL_DML($sql);
            }
			// Retornar el objeto creado
            return $this->get($idRental);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Ventas por mes x Tienda
    public function rentalMonthbyShop()
    {
        try {
            //Consulta sql
            $vSql = "SELECT 
                        r.shop_id, 
                        s.name AS shop_name,
                        DATE_FORMAT(r.rental_date, '%m-%Y') AS month,
                        SUM(r.total) AS monthly_total
                    FROM 
                        rental r
                    JOIN 
                        shop_rental s ON r.shop_id = s.id
                    GROUP BY 
                        r.shop_id, shop_name, month
                    ORDER BY 
                        r.shop_id, month;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //cantidad de alquileres por pelicula
    public function rentalbyMovie()
    {
        try {
            //Consulta sql
            $vSql = "SELECT 
                        m.title AS pelicula,
                        COUNT(rm.movie_id) AS cantidad_alquileres
                    FROM 
                        rental_movie rm
                    JOIN 
                        movie m ON rm.movie_id = m.id
                    GROUP BY 
                        m.title
                    ORDER BY 
                        cantidad_alquileres DESC;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}