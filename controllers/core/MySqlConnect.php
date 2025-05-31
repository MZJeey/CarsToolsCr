<?php

use Psr\Log\LoggerInterface;
class MySqlConnect {
	private $result;
	private $sql;
	private $username;
	private $password;
	private $host;
	private $dbname;
	private $link;

	private $log;
	
	public function __construct() {
		// Parametros de conexión
		$this->username = Config::get('DB_USERNAME');
		$this->password = Config::get('DB_PASSWORD');
		$this->host = Config::get('DB_HOST');
		$this->dbname = Config::get('DB_DBNAME');
		//Instancia Log
		$this->log = new Logger();
	}
	/**
	 * Establecer la conexión
	 */
	public function connect() {
		try {
			$this->link = new mysqli ( $this->host, $this->username, $this->password, $this->dbname );
			
		} catch ( Exception $e ) {
			handleException($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo SELECT
	 * @param $sql - string sentencia SQL
	 * @param $resultType - tipo de formato del resultado (obj,asoc,num)
	 * @return $resultType
	 */
	//
	public function executeSQL($sql,$resultType="obj") {
		$lista = NULL;
		try {
			$this->connect();	
			if ($result = $this->link->query ( $sql )) {
				for($num_fila = $result->num_rows - 1; $num_fila >= 0; $num_fila --) {
					$result->data_seek ( $num_fila );
					switch ($resultType){
						case "obj":
							$lista [] = mysqli_fetch_object ( $result );
							break;
						case "asoc":
							$lista [] = mysqli_fetch_assoc( $result );
							break;
						case "num":
							$lista [] = mysqli_fetch_row( $result );
							break;
						default:
							$lista [] = mysqli_fetch_object ( $result );
							break;
					}
					
					
				}
			} else {
				handleException($this->link->error);
				throw new \Exception('Error: Falló la ejecución de la sentencia'.$this->link->errno.' '.$this->link->error);
			}
			$this->link->close();
			return $lista;
		} catch ( Exception $e ) {
			handleException($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo INSERT,UPDATE
	 * @param $sql - string sentencia SQL
	 * @return $num_result - numero de resultados de la ejecución
	 */
	//
	public function executeSQL_DML($sql) {
		$num_results = 0;
		$lista = NULL;
		try {
			$this->connect();
			if ($result = $this->link->query ( $sql )) {
				$num_results = mysqli_affected_rows ( $this->link );
			}
			$this->link->close ();
			return $num_results;
		} catch ( Exception $e ) {
			/* $this->log->error("File: ".$e->getFile()." - line: ".$e->getLine()." - Code: ".$e->getCode()." - Message: ".$e->getMessage());
			throw new \Exception('Error: ' . $e->getMessage()); */
			handleException($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo INSERT,UPDATE
	 * @param $sql - string sentencia SQL
	 * @return $num_result- último id insertado
	 */
	//
	public function executeSQL_DML_last($sql) {
		$num_results = 0;
		$lista = NULL;
		try {
			$this->connect();
			if ($result = $this->link->query ( $sql )) {
				$num_results =$this->link->insert_id;
				
			}
			
			$this->link->close ();
			return $num_results;
		} catch ( Exception $e ) {
			handleException($e);
		}
	}
}
