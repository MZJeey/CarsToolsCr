<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/RolModel.php";
require_once "models/UserModel.php";
require_once "models/DirectorModel.php";




require_once "models/ImageModel.php";

//Modelo de api de carstools
require_once "models/ProductosModel.php";

require_once "models/ImageModel.php";
require_once "models/ResenaModel.php";
require_once "models/ProductoEtiquetaModel.php";
require_once "models/PromocionModel.php";
require_once "models/CarritoModel.php";
require_once "models/PedidoModel.php";
require_once "models/CategoriaModel.php";
require_once "models/ProductoPersonalizadoModel.php";
require_once "models/ImpuestoModel.php";
/***--- Agregar todos los controladores*/
require_once "controllers/UserController.php";
require_once "controllers/DirectorController.php";



require_once "controllers/InventoryController.php";

require_once "controllers/ImageController.php";

//Controller de Productos y del api de carstools
require_once "controllers/ProductosController.php";
//Controller de Etiqueta y del api de carstools


//Controller de Imagenes y del api de carstools
require_once "controllers/ImageController.php";

//Controller de Resena y del api de carstools
require_once "controllers/ResenaController.php";

// Controller de Impuesto y del api de carstools
require_once "controllers/ImpuestoController.php";

//Controller de ProductoEtiqueta y del api de carstools
require_once "controllers/ProductoEtiquetaController.php";
//Controller de Promocion y del api de carstools
require_once "controllers/PromocionController.php";
//Controller de Carrito y del api de carstools
require_once "controllers/CarritoController.php";
//Controller de Pedido y del api de carstools
require_once "controllers/PedidoController.php";
//Controller de categoria
require_once "controllers/CategoriaController.php";
//Controller de producto personalizado
require_once "controllers/ProductoPersonalizadoController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();
