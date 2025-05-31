-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-01-2025 a las 19:50:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movie_rental`
--
CREATE DATABASE IF NOT EXISTS `movie_rental` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `movie_rental`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actor`
--

CREATE TABLE `actor` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `actor`
--

INSERT INTO `actor` (`id`, `fname`, `lname`) VALUES
(1, 'Sam', 'Worthington'),
(2, 'Zoe', 'Saldana'),
(3, 'Sigourney', 'Weaver'),
(4, 'Tom', 'Cruise'),
(5, 'Miles', 'Teller'),
(6, 'Jennifer', 'Connelly'),
(7, 'Jon', 'Hamm'),
(8, 'Letitia', 'Wright'),
(9, 'Lupita', 'Nyongo'),
(10, 'Danai', 'Gurira'),
(11, 'Tim', 'Robbins'),
(12, 'Morgan', 'Freeman'),
(13, 'Bob\r\n\r\n', 'Gunton'),
(14, 'Chris', 'Pratt');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `director`
--

CREATE TABLE `director` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `director`
--

INSERT INTO `director` (`id`, `fname`, `lname`, `bio`) VALUES
(1, 'Joseph', 'Kosinski', 'Joseph Kosinski nació el 3 de mayo de 1974 en Iowa, Estados Unidos.'),
(2, 'James', 'Cameron', 'James Cameron nació el 16 de agosto de 1954 en Ontario, Canadá.'),
(3, 'Ryan', 'Coogler', 'Ryan Coogler nació el 23 de mayo de 1986 en Oakland, California, Estados Unidos.'),
(4, 'Frank', 'Darabont', 'Frank Darabont nació el 28 de enero de 1959 en Francia.'),
(5, 'James', 'Gunn', 'James Gunn nació el 5 de agosto de 1966 en St. Louis, Missouri, Estados Unidos.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genre`
--

CREATE TABLE `genre` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `genre`
--

INSERT INTO `genre` (`id`, `title`) VALUES
(1, 'Aventura'),
(2, 'Acción'),
(3, 'Ciencia Ficción'),
(4, 'Comedia'),
(5, 'Drama'),
(6, 'Fantasía'),
(7, 'Musical'),
(8, 'Terror');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory`
--

CREATE TABLE `inventory` (
  `movie_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `price` decimal(18,2) NOT NULL DEFAULT 1.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `inventory`
--

INSERT INTO `inventory` (`movie_id`, `shop_id`, `price`) VALUES
(1, 1, 3000.00),
(1, 2, 3000.00),
(2, 1, 3500.00),
(2, 2, 3500.00),
(2, 3, 3500.00),
(3, 1, 4000.00),
(3, 2, 4000.00),
(3, 3, 4500.00),
(4, 1, 3000.00),
(4, 2, 2800.00),
(4, 3, 3000.00),
(5, 1, 3000.00),
(5, 2, 2800.00),
(5, 3, 3000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movie`
--

CREATE TABLE `movie` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `year` smallint(4) UNSIGNED NOT NULL,
  `time` tinyint(4) UNSIGNED NOT NULL,
  `director_id` int(11) NOT NULL,
  `lang` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `movie`
--

INSERT INTO `movie` (`id`, `title`, `year`, `time`, `director_id`, `lang`) VALUES
(1, 'Top Gun: Maverick', 2022, 130, 1, 'Inglés'),
(2, 'Avatar', 2009, 162, 2, 'Inglés'),
(3, 'Black Panther: Wakanda Forever', 2022, 161, 3, 'Inglés'),
(4, 'Cadena perpetua', 1994, 142, 4, 'Inglés'),
(5, 'Guardianes de la Galaxia', 2014, 121, 5, 'Inglés');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movie_cast`
--

CREATE TABLE `movie_cast` (
  `actor_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `movie_cast`
--

INSERT INTO `movie_cast` (`actor_id`, `movie_id`, `role`) VALUES
(1, 2, 'Jake Sully'),
(2, 2, 'Neytiri Sully'),
(2, 5, 'Gamora'),
(3, 2, 'Doctora Grace Augustine'),
(4, 1, 'Pete Mitchell'),
(5, 1, 'Bradley Bradshaw'),
(6, 1, 'Penny Benjamin'),
(7, 1, 'Beau Simpson'),
(8, 3, 'Shuri'),
(9, 3, 'Nakia'),
(10, 3, 'Okoye'),
(11, 4, 'Andy Dufresne'),
(12, 4, 'Ellis Boyd, Red'),
(13, 4, 'Warden Notron'),
(14, 5, 'Peter Quill');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movie_genre`
--

CREATE TABLE `movie_genre` (
  `movie_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `movie_genre`
--

INSERT INTO `movie_genre` (`movie_id`, `genre_id`) VALUES
(1, 2),
(1, 5),
(2, 1),
(2, 2),
(2, 3),
(2, 6),
(3, 1),
(3, 2),
(3, 5),
(4, 5),
(5, 1),
(5, 2),
(5, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movie_image`
--

CREATE TABLE `movie_image` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `movie_image`
--

INSERT INTO `movie_image` (`id`, `movie_id`, `image`, `created_at`) VALUES
(1, 1, 'movie-66db12b9cf65f.jpg', '2024-09-06 14:33:29'),
(2, 2, 'movie-66db13123b751.jpg', '2024-09-06 14:34:58'),
(3, 4, 'movie-66db27183be49.jpg', '2024-09-06 16:00:24'),
(4, 5, 'movie-66db27a040c85.jpg', '2024-09-06 16:02:40'),
(5, 3, 'movie-66db27cfac929.jpg', '2024-09-06 16:03:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rental`
--

CREATE TABLE `rental` (
  `id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rental_date` date NOT NULL,
  `total` decimal(18,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `rental`
--

INSERT INTO `rental` (`id`, `shop_id`, `customer_id`, `rental_date`, `total`) VALUES
(1, 1, 2, '2025-01-30', 76000.00),
(2, 1, 3, '2025-02-03', 3500.00),
(3, 2, 4, '2025-02-05', 11200.00),
(4, 3, 5, '2025-03-04', 3000.00),
(5, 1, 3, '2025-03-13', 10000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rental_movie`
--

CREATE TABLE `rental_movie` (
  `rental_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `price` decimal(18,2) NOT NULL,
  `days` tinyint(4) NOT NULL DEFAULT 1,
  `subtotal` decimal(18,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `rental_movie`
--

INSERT INTO `rental_movie` (`rental_id`, `movie_id`, `price`, `days`, `subtotal`) VALUES
(1, 1, 3000.00, 2, 6000.00),
(1, 2, 3500.00, 2, 70000.00),
(2, 2, 3500.00, 1, 3500.00),
(3, 4, 2800.00, 2, 5600.00),
(3, 5, 2800.00, 2, 5600.00),
(4, 5, 3000.00, 1, 3000.00),
(5, 1, 3000.00, 1, 3000.00),
(5, 3, 4000.00, 1, 4000.00),
(5, 5, 3000.00, 1, 3000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `name` varchar(65) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `name`) VALUES
(1, 'Administrador'),
(2, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `shop_rental`
--

CREATE TABLE `shop_rental` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `shop_rental`
--

INSERT INTO `shop_rental` (`id`, `name`, `description`, `active`) VALUES
(1, 'Alajuela', 'Sucursal Alajuela, 100 m. este de la Catedral', 1),
(2, 'Heredia', 'Sucursal Heredia, 200 m. sur de la UNA', 1),
(3, 'San José', 'Sucursal San José, 150 m. este del parque de la Merce', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `rol_id` int(11) NOT NULL DEFAULT 2,
  `shop_id` int(11) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `rol_id`, `shop_id`, `date_created`, `date_updated`) VALUES
(1, 'Administrador', 'admin@prueba.com', '$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK', 1, NULL, '2024-01-04 17:54:45', '2024-01-04 17:54:45'),
(2, 'Karla Fonseca', 'cliente1@prueba.com', '$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK', 2, 1, '2024-01-23 15:54:45', '2024-01-23 15:54:45'),
(3, 'Pablo Ortiz', 'cliente2@prueba.com', '$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK', 2, 1, '2024-01-23 15:54:45', '2023-01-23 15:54:45'),
(4, 'Pamela Gómez', 'cliente3@prueba.com', '$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK', 2, 2, '2024-01-23 15:54:45', '2023-01-23 15:54:45'),
(5, 'Andrey Torres', 'cliente4@prueba.com', '$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK', 2, 3, '2024-01-23 15:54:45', '2023-01-23 15:54:45');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`movie_id`,`shop_id`),
  ADD KEY `inventory_shop_movie_idx` (`shop_id`);

--
-- Indices de la tabla `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_movie_director_idx` (`director_id`);

--
-- Indices de la tabla `movie_cast`
--
ALTER TABLE `movie_cast`
  ADD PRIMARY KEY (`actor_id`,`movie_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indices de la tabla `movie_genre`
--
ALTER TABLE `movie_genre`
  ADD PRIMARY KEY (`movie_id`,`genre_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indices de la tabla `movie_image`
--
ALTER TABLE `movie_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_images_movie_idx` (`movie_id`);

--
-- Indices de la tabla `rental`
--
ALTER TABLE `rental`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_inventory_shop_idx` (`shop_id`),
  ADD KEY `rental_user_idx` (`customer_id`);

--
-- Indices de la tabla `rental_movie`
--
ALTER TABLE `rental_movie`
  ADD PRIMARY KEY (`rental_id`,`movie_id`),
  ADD KEY `rental_movie_movie_idx` (`movie_id`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `shop_rental`
--
ALTER TABLE `shop_rental`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email` (`email`),
  ADD KEY `fk_user_rol_idx` (`rol_id`),
  ADD KEY `fk_user_shoprental_idx` (`shop_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actor`
--
ALTER TABLE `actor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `director`
--
ALTER TABLE `director`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `movie_image`
--
ALTER TABLE `movie_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `rental`
--
ALTER TABLE `rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `shop_rental`
--
ALTER TABLE `shop_rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `inventory_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop_rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `fk_movie_director` FOREIGN KEY (`director_id`) REFERENCES `director` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `movie_cast`
--
ALTER TABLE `movie_cast`
  ADD CONSTRAINT `movie_cast_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
  ADD CONSTRAINT `movie_cast_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Filtros para la tabla `movie_genre`
--
ALTER TABLE `movie_genre`
  ADD CONSTRAINT `movie_genre_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`),
  ADD CONSTRAINT `movie_genre_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Filtros para la tabla `movie_image`
--
ALTER TABLE `movie_image`
  ADD CONSTRAINT `movie_images_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `rental`
--
ALTER TABLE `rental`
  ADD CONSTRAINT `rental_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop_rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `rental_user` FOREIGN KEY (`customer_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `rental_movie`
--
ALTER TABLE `rental_movie`
  ADD CONSTRAINT `rental_movie_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `rental_movie_rental` FOREIGN KEY (`rental_id`) REFERENCES `rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_shoprental` FOREIGN KEY (`shop_id`) REFERENCES `shop_rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
