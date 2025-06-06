<?php

use Firebase\JWT\JWT;

class UserModel
{
	public $enlace;

	public function __construct()
	{
		$this->enlace = new MySqlConnect();
	}

	public function all()
	{
		try {
			$vSql = "SELECT * FROM carstoolscr.usuario;";
			return $this->enlace->ExecuteSQL($vSql);
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}

	public function get($id)
	{
		try {
			$rolM = new RolModel();
			$vSql = "SELECT * FROM carstoolscr.usuario WHERE id = $id";
			$vResultado = $this->enlace->ExecuteSQL($vSql);

			if ($vResultado) {
				$vResultado = $vResultado[0];
				$rol = $rolM->getRolUser($id);
				$vResultado->rol = $rol;
				return $vResultado;
			} else {
				return null;
			}
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}

	public function allCustomer()
	{
		try {
			$vSql = "SELECT * FROM carstoolscr.usuario WHERE rol_id = 2;"; // rol_id = 2 -> cliente
			return $this->enlace->ExecuteSQL($vSql);
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}

	public function customerbyShopRental($idShopRental)
	{
		try {
			$vSql = "SELECT * FROM carstoolscr.usuario WHERE rol_id = 2 AND shop_id = $idShopRental;";
			return $this->enlace->ExecuteSQL($vSql);
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}

	public function login($objeto)
	{
		try {
			$vSql = "SELECT * FROM carstoolscr.usuario WHERE correo = '$objeto->correo'";
			$vResultado = $this->enlace->ExecuteSQL($vSql);

			if (isset($vResultado[0]) && is_object($vResultado[0])) {
				$user = $vResultado[0];

				if (password_verify($objeto->clave, $user->contraseña_hash)) {
					$usuario = $this->get($user->id);

					if (!empty($usuario)) {
						$data = [
							'id' => $usuario->id,
							'correo' => $usuario->correo,
							'rol' => $usuario->rol,
							'iat' => time(),
							'exp' => time() + 3600
						];

						$jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');
						return $jwt_token;
					}
				}
			}

			return false;
		} catch (Exception $e) {
			handleException($e);
		}
	}

	public function create($objeto)
	{
		try {
			if (isset($objeto->clave) && $objeto->clave != null) {
				$hash = password_hash($objeto->clave, PASSWORD_BCRYPT);
				$objeto->clave = $hash;
			}

			$vSql = "INSERT INTO carstoolscr.usuario 
						(nombre_usuario, correo, clave, rol_id)
					 VALUES 
						('$objeto->nombre_usuario', '$objeto->correo', '$objeto->clave', $objeto->rol_id)";

			$vResultado = $this->enlace->executeSQL_DML_last($vSql);
			return $this->get($vResultado);
		} catch (Exception $e) {
			handleException($e);
		}
	}
}
