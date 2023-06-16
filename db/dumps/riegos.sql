-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql-server
-- Tiempo de generación: 30-11-2020 a las 23:27:10
-- Versión del servidor: 5.7.27
-- Versión de PHP: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: `temperatura`

CREATE DATABASE IF NOT EXISTS `temperatura` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `temperatura`;

-- Tabla `Dispositivos`

CREATE TABLE `Dispositivos` (
  `dispositivoId` int(17) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `mac` varchar(17) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Dispositivos`

INSERT INTO `Dispositivos` (`dispositivoId`, `nombre`, `ubicacion`, `mac`) VALUES
(1, 'ESP32C3+BMP280', 'Cocina', '7C:DF:A1:D0:33:00'), -- 7C:DF:A1:D0:33:00
(2, 'ESP32+simluada', 'Habitacion', '94:B5:55:2B:FF:64'), -- 94:B5:55:2B:FF:64
(3, 'ESP32+simluada', 'Living', '0C:B8:15:D8:7A:6C'); -- 0C:B8:15:D8:7A:6C

-- Estructura de tabla para la tabla `Mediciones`

CREATE TABLE `Mediciones` (
  `medicionId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `valor` int(10) DEFAULT NULL,
  `dispositivoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Mediciones`

INSERT INTO `Mediciones` (`medicionId`, `fecha`, `valor`, `dispositivoId`) VALUES
(1, '2023-04-20 21:19:41', 20, 1),
(2, '2023-04-20 21:42:41', 21, 1),
(3, '2023-04-20 21:19:41', 30, 2),
(4, '2023-04-20 21:19:41', 17, 3),
(5, '2023-04-20 21:42:41', 33, 2),
(6, '2023-04-20 21:19:41', 17, 3),
(7, '2023-04-20 21:57:41', 29, 2),
(8, '2023-04-20 22:19:41', 20, 2),
(9, '2023-04-20 22:19:41', 24, 3),
(10, '2023-04-20 22:19:41', 19, 3),
(11, '2023-04-20 22:19:41', 27, 1);

-- Indices de la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  ADD PRIMARY KEY (`dispositivoId`,`mac`);

-- Indices de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD PRIMARY KEY (`medicionId`,`dispositivoId`),
  ADD KEY `fk_Mediciones_Dispositivos_idx` (`dispositivoId`);

-- AUTO_INCREMENT de la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  MODIFY `dispositivoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- AUTO_INCREMENT de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

-- Filtros para la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD CONSTRAINT `fk_Mediciones_Dispositivos` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivos` (`dispositivoId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;