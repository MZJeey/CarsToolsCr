<?php
// controlador_agregar_producto.php

header('Content-Type: application/json');

require_once 'Producto.php';  // Ajusta la ruta según dónde tengas tu modelo
require_once 'config.php';    // Aquí pones la conexión PDO $pdo

// Conexión PDO (ejemplo básico)
try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error en la conexión a la base de datos']);
    exit;
}

$modeloProducto = new Producto($pdo);

// Validar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Validar campos mínimos (puedes agregar más validaciones)
$campos_requeridos = ['nombre', 'descripcion', 'precio', 'categoria_id'];
foreach ($campos_requeridos as $campo) {
    if (empty($_POST[$campo])) {
        http_response_code(400);
        echo json_encode(['error' => "El campo '$campo' es requerido"]);
        exit;
    }
}

// Preparar datos producto
$productoData = [
    'nombre' => $_POST['nombre'],
    'descripcion' => $_POST['descripcion'],
    'precio' => $_POST['precio'],
    'categoria_id' => $_POST['categoria_id'],
    'stock' => $_POST['stock'] ?? 0,
    'año_compatible' => $_POST['anoCompatible'] ?? null,
    'marca_compatible' => $_POST['marcaCompatible'] ?? null,
    'modelo_compatible' => $_POST['modeloCompatible'] ?? null,
    'motor_compatible' => $_POST['motorCompatible'] ?? null,
    'certificaciones' => $_POST['certificaciones'] ?? null,
];

// Procesar imágenes subidas
$imagenesBinarias = [];
if (!empty($_FILES['imagenes'])) {
    foreach ($_FILES['imagenes']['tmp_name'] as $index => $tmpName) {
        if (is_uploaded_file($tmpName)) {
            $binario = file_get_contents($tmpName);
            if ($binario !== false) {
                $imagenesBinarias[] = $binario;
            }
        }
    }
}

// Insertar producto con imágenes
$creado = $modeloProducto->create($productoData, $imagenesBinarias);

if ($creado) {
    echo json_encode(['success' => true, 'message' => 'Producto agregado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el producto']);
}
