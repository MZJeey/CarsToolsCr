<?php

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {
    /**
     * Manejar la solicitud para verificar el token y el rol del usuario.
     * @param $request: solicitud, $requiredRoles: array con nombres de roles permitidos
     * @return boolean
     */
    //$requiredRoles=["Administrador","Cliente"]
    public function handle($requiredRoles) {
        // Obtener y validar el token de la cabecera Authorization
        $token = $this->getTokenFromHeader();
        if (!$token) {
            return $this->errorResponse(401, 'Acceso denegado: token no proporcionado.');
        }

        // Verificar y decodificar el token
        $decodedToken = $this->verifyToken($token);
        if (!$decodedToken) {
            return $this->errorResponse(401, 'Acceso denegado: token inválido o expirado.');
        }

        // Verificar los roles permitidos
        if (!$this->checkRole($decodedToken->rol->name, $requiredRoles)) {
            return $this->errorResponse(403, 'Acceso denegado: rol no autorizado.');
        }

        // Continuar con la siguiente parte del middleware o controlador
        return true;
    }

    /**
     * Obtener el token de la cabecera Authorization.
     * @return string|null
     */
    private function getTokenFromHeader() {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';
        if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
            return str_replace('Bearer ', '', $authHeader);
        }
        return null;
    }

    /**
     * Verificar y decodificar el token JWT.
     * @param string $token
     * @return object|false
     */
    private function verifyToken($token) {
        try {
            return JWT::decode($token, new Key(config::get('SECRET_KEY'), 'HS256'));
        } catch (ExpiredException $e) {
            return false; // El token ha expirado
        } catch (Exception $e) {
            return false; // El token no es válido
        }
    }

    /**
     * Verificar si el rol del usuario está en el array de roles permitidos.
     * @param string $userRole
     * @param array $requiredRoles
     * @return boolean
     */
    private function checkRole($userRole, $requiredRoles) {
        return in_array($userRole, $requiredRoles);
    }

    /**
     * Generar una respuesta de error y detener la ejecución.
     * @param int $statusCode
     * @param string $message
     * @return void
     */
    private function errorResponse($statusCode, $message) {
        http_response_code($statusCode);
        echo json_encode(['status' => $statusCode, 'result' => $message]);
        exit;
    }
}