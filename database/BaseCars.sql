CREATE DATABASE  IF NOT EXISTS `carstoolscr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `carstoolscr`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: carstoolscr
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `accion` text,
  `ip_usuario` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `usuario_id` int NOT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `guardado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,'abc123',2,7,'2025-06-24 19:01:10'),(2,'dfg123',5,5,'2025-06-24 19:01:34');
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (6,'Accesorios de Motor'),(4,'Aceleración'),(8,'Coolant'),(7,'Empaques'),(1,'Fajas'),(3,'Frenos'),(5,'Inyectores'),(2,'Turbos');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comparacion`
--

DROP TABLE IF EXISTS `comparacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comparacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `producto_original_id` int NOT NULL,
  `producto_generico_id` int NOT NULL,
  `precio_diferencia` decimal(10,2) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `producto_original_id` (`producto_original_id`),
  KEY `producto_generico_id` (`producto_generico_id`),
  CONSTRAINT `comparacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `comparacion_ibfk_2` FOREIGN KEY (`producto_original_id`) REFERENCES `producto` (`id`),
  CONSTRAINT `comparacion_ibfk_3` FOREIGN KEY (`producto_generico_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comparacion`
--

LOCK TABLES `comparacion` WRITE;
/*!40000 ALTER TABLE `comparacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `comparacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compatibilidadvin`
--

DROP TABLE IF EXISTS `compatibilidadvin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compatibilidadvin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `vin_pattern` varchar(17) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `compatibilidadvin_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compatibilidadvin`
--

LOCK TABLES `compatibilidadvin` WRITE;
/*!40000 ALTER TABLE `compatibilidadvin` DISABLE KEYS */;
/*!40000 ALTER TABLE `compatibilidadvin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallepedido`
--

DROP TABLE IF EXISTS `detallepedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallepedido` (
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`pedido_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detallepedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`),
  CONSTRAINT `detallepedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallepedido`
--

LOCK TABLES `detallepedido` WRITE;
/*!40000 ALTER TABLE `detallepedido` DISABLE KEYS */;
INSERT INTO `detallepedido` VALUES (1,2,2,300.00),(2,1,2,15.99),(2,3,1,120.50),(3,1,2,15.99),(3,3,1,120.50),(4,6,4,350.00),(5,1,1,5000.00),(6,3,2,4000.00);
/*!40000 ALTER TABLE `detallepedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `canton` varchar(100) DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `detalle` text,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadistica_producto`
--

DROP TABLE IF EXISTS `estadistica_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadistica_producto` (
  `producto_id` int NOT NULL,
  `visitas` int DEFAULT '0',
  `ventas` int DEFAULT '0',
  `promedio_estrellas` decimal(3,2) DEFAULT '0.00',
  PRIMARY KEY (`producto_id`),
  CONSTRAINT `estadistica_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadistica_producto`
--

LOCK TABLES `estadistica_producto` WRITE;
/*!40000 ALTER TABLE `estadistica_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `estadistica_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etiqueta`
--

DROP TABLE IF EXISTS `etiqueta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etiqueta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etiqueta`
--

LOCK TABLES `etiqueta` WRITE;
/*!40000 ALTER TABLE `etiqueta` DISABLE KEYS */;
INSERT INTO `etiqueta` VALUES (8,'Accesorios'),(5,'Aceites y Lubricantes'),(7,'Baterías'),(15,'Carrocería'),(14,'Eléctrico'),(6,'Filtros'),(2,'Frenos'),(9,'Herramientas'),(4,'Luces'),(1,'Motor'),(13,'Neumáticos'),(11,'Nuevos'),(10,'Ofertas'),(12,'Popular'),(3,'Suspensión');
/*!40000 ALTER TABLE `etiqueta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenproducto`
--

DROP TABLE IF EXISTS `imagenproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenproducto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `imagenproducto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenproducto`
--

LOCK TABLES `imagenproducto` WRITE;
/*!40000 ALTER TABLE `imagenproducto` DISABLE KEYS */;
INSERT INTO `imagenproducto` VALUES (1,3,'frenos1.jpg'),(2,4,'cuerpo aceleracion1.jpg'),(3,5,'inyectores1.jpg'),(4,6,'bombaaceite1.jpg'),(5,7,'empaques1.jpg'),(6,8,'caliper1.jpg'),(9,1,'Faja-1.jpeg'),(10,6,'bombaaceite2.jpg'),(11,4,'cuerpo aceleracion2.jpg'),(12,1,'Faja-2.jpeg'),(13,1,'Faja-3.jpeg'),(14,2,'Turbo1.jpg'),(15,2,'Turbo2.jpg'),(16,2,'Turbo3.jpg'),(17,3,'frenos2.jpg'),(18,3,'frenos3.jpg'),(19,4,'cuerpo aceleracion3.jpg'),(20,5,'inyectores2.jpg'),(21,5,'inyectores3.jpg'),(22,6,'bombaaceite3.jpg'),(23,7,'empaques2.jpg'),(24,7,'empaques3.jpg'),(25,8,'caliper2.jpg'),(26,8,'caliper3.jpg'),(27,10,'coolant1.jpg'),(28,10,'coolant2.jpg');
/*!40000 ALTER TABLE `imagenproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impuesto`
--

DROP TABLE IF EXISTS `impuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impuesto` (
  `IdImpuesto` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Porcentaje` decimal(5,2) NOT NULL,
  PRIMARY KEY (`IdImpuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impuesto`
--

LOCK TABLES `impuesto` WRITE;
/*!40000 ALTER TABLE `impuesto` DISABLE KEYS */;
INSERT INTO `impuesto` VALUES (1,'IVA',13.00);
/*!40000 ALTER TABLE `impuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventarioproveedor`
--

DROP TABLE IF EXISTS `inventarioproveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventarioproveedor` (
  `producto_id` int NOT NULL,
  `proveedor_id` int NOT NULL,
  `stock_disponible` int DEFAULT NULL,
  PRIMARY KEY (`producto_id`,`proveedor_id`),
  KEY `proveedor_id` (`proveedor_id`),
  CONSTRAINT `inventarioproveedor_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  CONSTRAINT `inventarioproveedor_ibfk_2` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventarioproveedor`
--

LOCK TABLES `inventarioproveedor` WRITE;
/*!40000 ALTER TABLE `inventarioproveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventarioproveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodopago`
--

DROP TABLE IF EXISTS `metodopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodopago` (
  `idMetodoPago` int NOT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idMetodoPago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodopago`
--

LOCK TABLES `metodopago` WRITE;
/*!40000 ALTER TABLE `metodopago` DISABLE KEYS */;
INSERT INTO `metodopago` VALUES (1,'Tarjeta'),(2,'Efectivo'),(3,'Sinpe');
/*!40000 ALTER TABLE `metodopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelocarro`
--

DROP TABLE IF EXISTS `modelocarro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelocarro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `año` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelocarro`
--

LOCK TABLES `modelocarro` WRITE;
/*!40000 ALTER TABLE `modelocarro` DISABLE KEYS */;
/*!40000 ALTER TABLE `modelocarro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `direccion_envio` text NOT NULL,
  `estado` enum('en_proceso','pagado','entregado') DEFAULT 'en_proceso',
  `idMetodoPago` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `meotodPago_idx` (`idMetodoPago`),
  CONSTRAINT `meotodPago` FOREIGN KEY (`idMetodoPago`) REFERENCES `metodopago` (`idMetodoPago`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,2,'2025-06-24 19:22:01','San José, Costa Rica','en_proceso',1),(2,2,'2025-06-24 19:25:41','San José, Costa Rica','pagado',1),(3,2,'2025-06-24 19:36:42','Santa fe, Bolivia','en_proceso',1),(4,2,'2025-07-04 15:24:39','Alajuela, la garita','entregado',1),(5,1,'2025-07-04 20:25:19','Puntarenas,El roble','en_proceso',3),(6,3,'2025-07-04 20:25:19','Heredia,Belen','entregado',1);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `categoria_id` int NOT NULL,
  `stock` int DEFAULT '0',
  `promedio_valoraciones` decimal(3,2) DEFAULT '0.00',
  `estado` tinyint(1) DEFAULT '1',
  `ano_compatible` int DEFAULT NULL,
  `marca_compatible` varchar(50) DEFAULT NULL,
  `modelo_compatible` varchar(50) DEFAULT NULL,
  `motor_compatible` varchar(50) DEFAULT NULL,
  `certificaciones` text,
  `IdImpuesto` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `Impuesto_idx` (`IdImpuesto`),
  CONSTRAINT `Impuesto` FOREIGN KEY (`IdImpuesto`) REFERENCES `impuesto` (`IdImpuesto`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Faja de distribución','Faja de distribución para Toyota Corolla 2007-2013',25.00,1,20,0.00,1,2021,'AISIN','Corolla','1.8L','ISO 14001',1),(2,'Turbocompresor','Turbocompresor CT26',1000000.00,2,50,0.00,1,NULL,'Motor Toyota 13bt/14bt',NULL,NULL,NULL,1),(3,'Pastillas delanteras ','Pastillas delanteras para Nissan Frontier 2015-2023',45.00,3,10,0.00,1,2020,'Values','Nissan Frontier','1.8L','ISO9001',1),(4,'Cuerpo de aceleración','Cuerpo de aceleración para honda SI 2009-2013, para motores k20z3',250.00,4,10,0.00,1,2020,'Skunk2','Honda','1.8L','ISO9001',1),(5,'Inyectores de combustible','Inyectores de combustible para Toyota Land Cruiser 1FZ-FE 1995-2000',575.00,5,10,0.00,1,2020,'Injector Dynamics','Toyota Land Cruiser ','1.8L','ISO9001',1),(6,'Bomba de aceite','Bomba de aceite para Jeep Wrangler JK, JL, JLU',350.00,6,10,0.00,1,2020,'Mopar','Jeep Wrangler','1.8L','ISO9001',1),(7,'Juego de empaques de motor','Juego de empaques de motor, contiene empaque de cabezotes, empaque de tapa de válvulas, empaque de header, cellos de agua, tornillería y sellos de válvulas',150.00,7,10,0.00,1,2020,'AISIN','Toyota 4runner, Toyota Tacoma y Toyota T100 5VZ-FE','1.8L','ISO9001',1),(8,'Calipers de freno delanteros','Calipers de freno delanteros contienen las arandelas y pinzas',120.50,3,10,0.00,1,2020,'CarBrake','Toyota Corolla, Toyota Yaris y Toyota Raize','1.8L','ISO9001',1),(10,'Refrigerante','Coolant para cualquier tipo de motores de alto rendimiento',40000.00,8,30,0.00,1,NULL,'VP Racing','Cualquier vehículo',NULL,NULL,NULL);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_personalizado`
--

DROP TABLE IF EXISTS `producto_personalizado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_personalizado` (
  `id_personalizado` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `nombre_personalizado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `costo_base` decimal(10,2) NOT NULL,
  `opciones_personalizacion` json NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `costo_adicional` decimal(10,2) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_personalizado`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `producto_personalizado_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`),
  CONSTRAINT `producto_personalizado_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_personalizado`
--

LOCK TABLES `producto_personalizado` WRITE;
/*!40000 ALTER TABLE `producto_personalizado` DISABLE KEYS */;
INSERT INTO `producto_personalizado` VALUES (1,2,3,'Alto rendimiento',25000.00,'{\"color\": {\"costo\": 2000, \"opcion\": \"Negro Mate\"}, \"estilo\": {\"costo\": 3500, \"opcion\": \"Deportivo\"}}',1,NULL,NULL,NULL),(2,2,3,'Sensor de desgaste integrado',25000.00,'[{\"costo\": 2000, \"opcion\": \"Negro Mate\", \"criterio\": \"Color\"}, {\"costo\": 3500, \"opcion\": \"Deportivo\", \"criterio\": \"Estilo\"}]',1,5500.00,30500.00,30500.00),(3,2,4,'Logo grabado o personalizado',15000.00,'[{\"costo\": 1000, \"opcion\": \"Toyota\", \"criterio\": \"Logo\"}, {\"costo\": 500, \"opcion\": \"Rojo\", \"criterio\": \"Color\"}]',2,1500.00,16500.00,33000.00);
/*!40000 ALTER TABLE `producto_personalizado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productoetiqueta`
--

DROP TABLE IF EXISTS `productoetiqueta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productoetiqueta` (
  `producto_id` int NOT NULL,
  `etiqueta_id` int NOT NULL,
  PRIMARY KEY (`producto_id`,`etiqueta_id`),
  KEY `etiqueta_id` (`etiqueta_id`),
  CONSTRAINT `productoetiqueta_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productoetiqueta_ibfk_2` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiqueta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productoetiqueta`
--

LOCK TABLES `productoetiqueta` WRITE;
/*!40000 ALTER TABLE `productoetiqueta` DISABLE KEYS */;
INSERT INTO `productoetiqueta` VALUES (1,2),(3,2),(4,2),(8,5);
/*!40000 ALTER TABLE `productoetiqueta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productomodelo`
--

DROP TABLE IF EXISTS `productomodelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productomodelo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `modelo_carro_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `producto_id` (`producto_id`,`modelo_carro_id`),
  KEY `modelo_carro_id` (`modelo_carro_id`),
  CONSTRAINT `productomodelo_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  CONSTRAINT `productomodelo_ibfk_2` FOREIGN KEY (`modelo_carro_id`) REFERENCES `modelocarro` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productomodelo`
--

LOCK TABLES `productomodelo` WRITE;
/*!40000 ALTER TABLE `productomodelo` DISABLE KEYS */;
/*!40000 ALTER TABLE `productomodelo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productossimilares`
--

DROP TABLE IF EXISTS `productossimilares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productossimilares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `producto_similar_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `producto_id` (`producto_id`,`producto_similar_id`),
  KEY `producto_similar_id` (`producto_similar_id`),
  CONSTRAINT `productossimilares_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  CONSTRAINT `productossimilares_ibfk_2` FOREIGN KEY (`producto_similar_id`) REFERENCES `producto` (`id`),
  CONSTRAINT `chk_producto_diferente` CHECK ((`producto_id` <> `producto_similar_id`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productossimilares`
--

LOCK TABLES `productossimilares` WRITE;
/*!40000 ALTER TABLE `productossimilares` DISABLE KEYS */;
/*!40000 ALTER TABLE `productossimilares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocioncategoria`
--

DROP TABLE IF EXISTS `promocioncategoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocioncategoria` (
  `IdPromocion` int NOT NULL,
  `IdCategoria` int NOT NULL,
  PRIMARY KEY (`IdPromocion`,`IdCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocioncategoria`
--

LOCK TABLES `promocioncategoria` WRITE;
/*!40000 ALTER TABLE `promocioncategoria` DISABLE KEYS */;
INSERT INTO `promocioncategoria` VALUES (4,4),(6,8);
/*!40000 ALTER TABLE `promocioncategoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones` (
  `IdPromocion` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text,
  `Descuento` decimal(5,2) DEFAULT NULL,
  `FechaInicio` date DEFAULT NULL,
  `FechaFin` date DEFAULT NULL,
  PRIMARY KEY (`IdPromocion`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (1,'Promoción de Verano Frenos','20% de descuento en repuestos para frenos durante todo julio',20.00,'2025-06-01','2025-07-31'),(2,'Promoción Mitad de Año','15% de descuento aceites',15.00,'2025-06-15','2025-07-15'),(3,'Promoción Mitad de Año','15% de descuento aceites',15.00,'2025-06-15','2025-07-15'),(4,'Promocion día del padre','15% de descuento en Bomba de aceite',15.00,'2025-06-01','2025-07-31'),(5,'Promocion Inyectores','10 % de descuento ',10.00,'2025-07-02','2025-07-20'),(6,'Promoción Refrigerante','15 % en refrigerantes',15.00,'2025-07-04','2025-07-15');
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocionrepuestos`
--

DROP TABLE IF EXISTS `promocionrepuestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocionrepuestos` (
  `IdPromocion` int NOT NULL,
  `IdProducto` int NOT NULL,
  PRIMARY KEY (`IdPromocion`,`IdProducto`),
  KEY `IdProducto` (`IdProducto`),
  CONSTRAINT `promocionrepuestos_ibfk_1` FOREIGN KEY (`IdPromocion`) REFERENCES `promociones` (`IdPromocion`),
  CONSTRAINT `promocionrepuestos_ibfk_2` FOREIGN KEY (`IdProducto`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocionrepuestos`
--

LOCK TABLES `promocionrepuestos` WRITE;
/*!40000 ALTER TABLE `promocionrepuestos` DISABLE KEYS */;
INSERT INTO `promocionrepuestos` VALUES (1,3),(5,5),(4,6),(2,8);
/*!40000 ALTER TABLE `promocionrepuestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `api_endpoint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resena`
--

DROP TABLE IF EXISTS `resena`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resena` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `comentario` text,
  `valoracion` tinyint DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `moderado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `resena_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `resena_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  CONSTRAINT `resena_chk_1` CHECK ((`valoracion` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resena`
--

LOCK TABLES `resena` WRITE;
/*!40000 ALTER TABLE `resena` DISABLE KEYS */;
INSERT INTO `resena` VALUES (1,1,1,'Muy Buena calidad',5,'2025-07-04 20:17:19',1),(2,3,4,'Muy malo el producto',1,'2025-07-04 20:20:21',0),(3,1,8,'Defectuoso, pero me devolvieron el dinero.',2,'2025-06-16 19:48:07',1),(5,2,6,'No era compatible con mi modelo de auto.',2,'2025-06-16 19:48:32',0),(6,2,5,'Buen producto, aunque el envío fue lento.',4,'2025-06-16 19:48:48',0),(7,2,3,'Muy buen repuesto.',5,'2025-06-16 19:52:21',0),(8,1,8,'Muy defectuoso',1,'2025-06-17 21:38:39',0);
/*!40000 ALTER TABLE `resena` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'administrador'),(2,'usuario');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripcion`
--

DROP TABLE IF EXISTS `suscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripcion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo` enum('Básica','Premium','Pro') NOT NULL,
  `fecha_inicio` date NOT NULL,
  `estado` enum('Activa','Cancelada','Vencida') DEFAULT 'Activa',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `suscripcion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripcion`
--

LOCK TABLES `suscripcion` WRITE;
/*!40000 ALTER TABLE `suscripcion` DISABLE KEYS */;
/*!40000 ALTER TABLE `suscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña_hash` varchar(255) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `rol_id` (`rol_id`),
  KEY `email_2` (`email`),
  KEY `nombre_usuario_2` (`nombre_usuario`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,2,'Adrian','cliente01@email.com','$2y$10$EjemploHashCliente01',1,'2025-06-16 19:46:48','2025-07-04 03:41:47'),(2,2,'José','juan.perez@email.com','$2y$10$OtroHashParaJuan',1,'2025-06-16 19:46:48','2025-07-04 03:41:47'),(3,2,'Felipe','felipemxCubillo@gmail.com','$2y$10$Feli',1,'2025-07-04 20:18:48','2025-07-04 20:18:48');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vin_compatibilidad_log`
--

DROP TABLE IF EXISTS `vin_compatibilidad_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vin_compatibilidad_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `vin` varchar(17) DEFAULT NULL,
  `producto_sugerido_id` int DEFAULT NULL,
  `fecha_busqueda` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `producto_sugerido_id` (`producto_sugerido_id`),
  CONSTRAINT `vin_compatibilidad_log_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `vin_compatibilidad_log_ibfk_2` FOREIGN KEY (`producto_sugerido_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vin_compatibilidad_log`
--

LOCK TABLES `vin_compatibilidad_log` WRITE;
/*!40000 ALTER TABLE `vin_compatibilidad_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `vin_compatibilidad_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-04 16:43:55
