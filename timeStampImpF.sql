-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 23-05-2025 a las 23:27:25
-- Versión del servidor: 8.0.39-0ubuntu0.22.04.1
-- Versión de PHP: 8.1.2-1ubuntu2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `timeStampImpF`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ncategoria`
--

CREATE TABLE `ncategoria` (
  `id` bigint UNSIGNED NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ncategoria`
--

INSERT INTO `ncategoria` (`id`, `descripcion`, `icon`, `create_at`, `delete_at`, `update_at`) VALUES
(1, 'Moda', 'skin', '2025-05-24 01:08:34', NULL, NULL),
(2, 'Hogar', 'home', '2025-05-24 01:08:34', NULL, NULL),
(3, 'Belleza', 'smileo', '2025-05-24 01:08:57', NULL, NULL),
(4, 'Electrónica', 'laptop', '2025-05-24 01:08:57', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nmarcas`
--

CREATE TABLE `nmarcas` (
  `id` bigint UNSIGNED NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT NULL,
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `nmarcas`
--

INSERT INTO `nmarcas` (`id`, `descripcion`, `create_at`, `update_at`, `delete_at`) VALUES
(5, 'Body Mist NBA', '2025-05-07 03:27:02', NULL, NULL),
(6, 'Body Mist Jafra', '2025-05-07 03:27:02', NULL, NULL),
(7, 'Body Mist Cloe', '2025-05-07 03:27:02', NULL, NULL),
(8, 'Body Mist Joop', '2025-05-07 03:27:02', NULL, NULL),
(9, 'Body Mist Bambú', '2025-05-07 03:27:02', NULL, NULL),
(10, 'Bonabel Violeta', '2025-05-07 03:27:02', NULL, NULL),
(11, 'Bonabel Orquidea', '2025-05-07 03:27:02', NULL, NULL),
(12, 'Bonabel Jazmín', '2025-05-07 03:27:02', NULL, NULL),
(13, 'Salerm', '2025-05-07 03:27:02', NULL, NULL),
(14, 'Obao', '2025-05-07 03:27:02', NULL, NULL),
(15, 'Keweell', '2025-05-07 03:27:02', NULL, NULL),
(16, 'Natural Wonder', '2025-05-07 03:27:02', NULL, NULL),
(17, 'Gillette', '2025-05-07 03:27:02', NULL, NULL),
(18, 'Axe', '2025-05-07 03:27:02', NULL, NULL),
(19, 'FavorBeauty', '2025-05-07 03:27:02', NULL, NULL),
(20, 'Honey', '2025-05-07 03:27:02', NULL, NULL),
(21, 'Oro Líquido', '2025-05-07 03:27:02', NULL, NULL),
(22, 'Head and Shoulders', '2025-05-07 03:27:02', NULL, NULL),
(23, 'S´nonas', '2025-05-07 03:27:02', NULL, NULL),
(24, 'Skala', '2025-05-07 03:27:02', NULL, NULL),
(25, 'Trompy', '2025-05-07 03:27:02', NULL, NULL),
(26, 'Duru', '2025-05-07 03:27:02', NULL, NULL),
(27, 'NT', '2025-05-07 03:27:02', NULL, NULL),
(28, 'Queray', '2025-05-07 03:27:02', NULL, NULL),
(29, 'Beauty Formulas', '2025-05-07 03:27:02', NULL, NULL),
(30, 'Nazca ORIGEM', '2025-05-07 03:27:02', NULL, NULL),
(31, 'Bribracare.', '2025-05-07 03:27:02', NULL, NULL),
(32, 'Daily Perfection', '2025-05-07 03:27:02', NULL, NULL),
(33, 'Alident Ice Cool Mint', '2025-05-07 03:27:02', NULL, NULL),
(34, 'Alident Aliento Fresco', '2025-05-07 03:27:02', NULL, NULL),
(35, 'Royal fresh', '2025-05-07 03:27:02', NULL, NULL),
(36, 'Colgate', '2025-05-07 03:27:02', NULL, NULL),
(37, 'Megami secret', '2025-05-07 03:27:02', NULL, NULL),
(38, 'TB Care', '2025-05-07 03:27:02', NULL, NULL),
(39, 'Prolight', '2025-05-07 03:27:02', NULL, NULL),
(40, 'ALAIZ', '2025-05-07 03:27:02', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nrol`
--

CREATE TABLE `nrol` (
  `id` bigint UNSIGNED NOT NULL,
  `descripcion` varchar(8) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nrol`
--

INSERT INTO `nrol` (`id`, `descripcion`) VALUES
(1, 'admin'),
(2, 'gestor'),
(3, 'user'),
(4, 'anonimo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nsexo`
--

CREATE TABLE `nsexo` (
  `id` bigint UNSIGNED NOT NULL,
  `descripcion` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `nsexo`
--

INSERT INTO `nsexo` (`id`, `descripcion`) VALUES
(1, 'Hombre'),
(2, 'Mujer');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ntipopago`
--

CREATE TABLE `ntipopago` (
  `id` bigint UNSIGNED NOT NULL,
  `descripcion` char(15) COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ntipopago`
--

INSERT INTO `ntipopago` (`id`, `descripcion`, `create_at`, `delete_at`, `update_at`) VALUES
(1, 'CASH', '2025-04-29 16:59:40', NULL, NULL),
(2, 'TRANSFERENCIA', '2025-04-29 16:59:40', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcarrito`
--

CREATE TABLE `tcarrito` (
  `id` bigint UNSIGNED NOT NULL,
  `idpersona` int NOT NULL,
  `idproducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tcarrito`
--

INSERT INTO `tcarrito` (`id`, `idpersona`, `idproducto`, `cantidad`, `create_at`, `delete_at`, `update_at`) VALUES
(1, 18, 6, 1, '2025-05-23 01:23:06', NULL, NULL),
(2, 18, 7, 1, '2025-05-23 01:23:07', NULL, NULL),
(3, 18, 9, 4, '2025-05-23 01:24:26', NULL, NULL),
(4, 18, 8, 2, '2025-05-23 01:24:28', NULL, NULL),
(5, 2, 1, 1, '2025-05-23 21:26:56', NULL, NULL),
(6, 18, 1, 2, '2025-05-23 23:13:20', NULL, NULL),
(7, 18, 2, 5, '2025-05-23 23:18:37', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcompras`
--

CREATE TABLE `tcompras` (
  `id` bigint UNSIGNED NOT NULL,
  `id_producto` int NOT NULL,
  `cant_ventas` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcontactos`
--

CREATE TABLE `tcontactos` (
  `id` bigint UNSIGNED NOT NULL,
  `numero` char(10) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tcontactos`
--

INSERT INTO `tcontactos` (`id`, `numero`, `direccion`, `create_at`, `delete_at`, `update_at`) VALUES
(1, '55835034', NULL, '2025-05-22 04:06:28', NULL, NULL),
(2, '54223460', 'Un', '2025-05-23 05:43:26', '2025-05-23 07:00:23', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tcontrolventas`
--

CREATE TABLE `tcontrolventas` (
  `id` int NOT NULL,
  `id_carrito` int NOT NULL,
  `idpersona` int NOT NULL,
  `idproducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio` double NOT NULL,
  `total` double NOT NULL,
  `fecha_venta` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `testadopago`
--

CREATE TABLE `testadopago` (
  `id` bigint UNSIGNED NOT NULL,
  `idpersona` int NOT NULL,
  `cantidad` decimal(10,0) NOT NULL,
  `estado` enum('Enviado','Procesando','Confirmado') COLLATE utf8mb4_general_ci NOT NULL,
  `mensajero` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehiculo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `tiempo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `create_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `timagenes`
--

CREATE TABLE `timagenes` (
  `id` bigint UNSIGNED NOT NULL,
  `ruta` text COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `timagenes`
--

INSERT INTO `timagenes` (`id`, `ruta`, `create_at`, `delete_at`) VALUES
(1, '/home/ductos/ALERTA/Alertas/media/backend/uploads/1748049982795-431226024.jpg', '2025-05-23 21:26:42', NULL),
(2, '/home/ductos/ALERTA/Alertas/media/backend/uploads/1748050172585-636196181.jpg', '2025-05-23 21:29:54', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tproductos`
--

CREATE TABLE `tproductos` (
  `id` bigint UNSIGNED NOT NULL,
  `nombre` char(25) COLLATE utf8mb4_general_ci NOT NULL,
  `precio` float NOT NULL,
  `imagen_id` text COLLATE utf8mb4_general_ci NOT NULL,
  `cantidad` int NOT NULL,
  `volumen` text COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` char(250) COLLATE utf8mb4_general_ci NOT NULL,
  `idsexo` int NOT NULL,
  `idmarca` int NOT NULL,
  `idcategoria` int DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tproductos`
--

INSERT INTO `tproductos` (`id`, `nombre`, `precio`, `imagen_id`, `cantidad`, `volumen`, `descripcion`, `idsexo`, `idmarca`, `idcategoria`, `create_at`, `delete_at`, `update_at`) VALUES
(1, 'Heché', 200, '1', 2, '200 ml', 'Jajaja', 1, 5, 4, '2025-05-23 21:26:43', NULL, NULL),
(2, 'Hjjhh', 509, '2', 13, '150 vl', 'Hhfdg', 2, 18, 2, '2025-05-23 21:29:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ttarjeta`
--

CREATE TABLE `ttarjeta` (
  `id` bigint UNSIGNED NOT NULL,
  `numero` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `preferida` enum('Preferida','No preferida') COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tusuarios`
--

CREATE TABLE `tusuarios` (
  `id` bigint UNSIGNED NOT NULL,
  `telefono` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `nick` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido1` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido2` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imagen_id` int DEFAULT NULL,
  `idrol` int DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `anonimo` tinyint(1) DEFAULT '0',
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tusuarios`
--

INSERT INTO `tusuarios` (`id`, `telefono`, `nick`, `nombre`, `apellido1`, `apellido2`, `direccion`, `password`, `imagen_id`, `idrol`, `create_at`, `delete_at`, `update_at`, `anonimo`, `email`) VALUES
(1, NULL, 'anon-1747703424198', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-19 21:10:24', '2025-05-19 23:58:26', NULL, 1, NULL),
(2, '54223460', 'admin', 'Administrador', 'Imperio', 'Versión1', 'Habana, Cuba', '$2b$10$nPTraPUoiAm1JYPdN1Rw7uXGUHGIDk6SOo805Tx4mkPqlj9HkQydy', NULL, 1, '2025-05-19 21:14:53', NULL, NULL, 0, NULL),
(3, '54546464', 'Omar', 'Omar', 'Linares', 'Áreas', 'Calle', '$2b$10$5lIlQk/gFVK3Y/xATEqH4.37r0Oo8JHa9zfXP.WT7e6ngdAVrMIgm', NULL, 3, '2025-05-19 22:15:56', '2025-05-22 03:20:47', NULL, 0, NULL),
(4, NULL, 'anon-1747815295781', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-21 04:14:55', '2025-05-22 03:18:13', NULL, 1, NULL),
(5, NULL, 'anon-1747815302063', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-21 04:15:02', '2025-05-22 03:18:18', NULL, 1, NULL),
(6, NULL, 'anon-1747885292270', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-21 23:41:32', '2025-05-22 03:18:21', NULL, 1, NULL),
(7, NULL, 'anon-1747890298622', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 01:04:58', '2025-05-22 03:18:36', NULL, 1, NULL),
(8, NULL, 'anon-1747893924473', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 02:05:24', '2025-05-22 02:30:35', NULL, 1, NULL),
(9, NULL, 'anon-1747894089106', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 02:08:09', '2025-05-22 02:30:30', NULL, 1, NULL),
(10, NULL, 'anon-1747894117780', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 02:08:37', '2025-05-22 02:30:25', NULL, 1, NULL),
(11, NULL, 'anon-1747894968506', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 02:22:48', '2025-05-22 02:30:19', NULL, 1, NULL),
(12, '555522554', 'Ooooo', 'o', 'O', 'Ijhvh', 'Tthhh', '$2b$10$iyCvjkfKOsQKxyLvGOLXUuBAQhgEY82oTpZcc8cEssutfyuDqv9s2', NULL, 3, '2025-05-22 02:28:16', '2025-05-22 03:18:08', NULL, 0, NULL),
(13, NULL, 'anon-1747895846035', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 02:37:26', '2025-05-22 03:18:31', NULL, 1, NULL),
(14, NULL, 'anon-1747898172549', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 03:16:12', '2025-05-22 03:18:42', NULL, 1, NULL),
(15, NULL, 'anon-1747928794130', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 11:46:34', '2025-05-23 00:32:27', NULL, 1, NULL),
(16, NULL, 'anon-1747960833359', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-22 20:40:33', '2025-05-23 00:32:23', NULL, 1, NULL),
(17, '55835034', 'Papo', 'Ibrain', 'Caballero', 'Luis', 'Calle 146 entre 239 y 241 #23915 Bauta , Artemisa ', '$2b$10$qevvyQlBGrYGJu68FyY.yOrCVuyG6c/6ciHcv4PetEmgCZP9exg9m', NULL, 1, '2025-05-22 21:30:02', NULL, NULL, 0, NULL),
(18, '545454548', 'Omar', 'Omar', 'Linares', 'Áreas', 'Calle jejdjdh', '$2b$10$TtRIc1DvKYb/rI0OVxUXjeQ32ztBPW5sAobog8KYdaQwosjfg/5uK', NULL, 3, '2025-05-23 01:22:13', NULL, NULL, 0, NULL),
(19, NULL, 'anon-1747982157506', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-23 02:35:57', '2025-05-23 03:00:31', NULL, 1, NULL),
(20, NULL, 'anon-1747982731944', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-23 02:45:31', '2025-05-23 03:00:49', NULL, 1, NULL),
(21, NULL, 'anon-1747983370661', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-23 02:56:10', '2025-05-23 03:00:52', NULL, 1, NULL),
(22, NULL, 'anon-1747997905357', NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-23 06:58:25', NULL, NULL, 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ncategoria`
--
ALTER TABLE `ncategoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `nmarcas`
--
ALTER TABLE `nmarcas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `nrol`
--
ALTER TABLE `nrol`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `nsexo`
--
ALTER TABLE `nsexo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `ntipopago`
--
ALTER TABLE `ntipopago`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tcarrito`
--
ALTER TABLE `tcarrito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tcompras`
--
ALTER TABLE `tcompras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tcontactos`
--
ALTER TABLE `tcontactos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tcontrolventas`
--
ALTER TABLE `tcontrolventas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `testadopago`
--
ALTER TABLE `testadopago`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `timagenes`
--
ALTER TABLE `timagenes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tproductos`
--
ALTER TABLE `tproductos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `idx_productos` (`id`);

--
-- Indices de la tabla `ttarjeta`
--
ALTER TABLE `ttarjeta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `tusuarios`
--
ALTER TABLE `tusuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ncategoria`
--
ALTER TABLE `ncategoria`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `nmarcas`
--
ALTER TABLE `nmarcas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `nrol`
--
ALTER TABLE `nrol`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `nsexo`
--
ALTER TABLE `nsexo`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ntipopago`
--
ALTER TABLE `ntipopago`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tcarrito`
--
ALTER TABLE `tcarrito`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tcompras`
--
ALTER TABLE `tcompras`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tcontactos`
--
ALTER TABLE `tcontactos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tcontrolventas`
--
ALTER TABLE `tcontrolventas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `testadopago`
--
ALTER TABLE `testadopago`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `timagenes`
--
ALTER TABLE `timagenes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tproductos`
--
ALTER TABLE `tproductos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ttarjeta`
--
ALTER TABLE `ttarjeta`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tusuarios`
--
ALTER TABLE `tusuarios`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
