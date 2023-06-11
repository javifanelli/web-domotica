-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: mariadb-server
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

-- Base de datos: `riegos`

CREATE DATABASE IF NOT EXISTS `riegos` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `riegos`;

-- Tabla `Dispositivos`

CREATE TABLE `Dispositivos` (
  `dispositivoId` int(11) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `electrovalvulaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Dispositivos`

INSERT INTO `Dispositivos` (`dispositivoId`, `nombre`, `ubicacion`, `electrovalvulaId`) VALUES
(1, 'Sensor 1', 'Patio1', 1),
(2, 'Sensor 2', 'Patio2', 2),
(3, 'Sensor 3', 'Jardin1', 3),
(4, 'Sensor 4', 'Jardin2', 4),
(5, 'Sensor 5', 'Jardin3', 5),
(6, 'Sensor 6', 'Jardin4', 6),
(7, 'Sensor 7', 'Frente', 7);


-- Estructura de tabla para la tabla `Electrovalvulas`

CREATE TABLE `Electrovalvulas` (
  `electrovalvulaId` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Electrovalvulas`

INSERT INTO `Electrovalvulas` (`electrovalvulaId`, `nombre`) VALUES
(1, 'eLPatio1'),
(2, 'eLPatio2'),
(3, 'eLJardin1'),
(4, 'eLJardin2'),
(5, 'eLJardin3'),
(6, 'eLJardin4');

-- Estructura de tabla para la tabla `Log_Riegos`

CREATE TABLE `Log_Riegos` (
  `logRiegoId` int(11) NOT NULL,
  `apertura` tinynpm install --global jsonwebtokenint(4) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `electrovalvulaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Estructura de tabla para la tabla `Mediciones`

CREATE TABLE `Mediciones` (
  `medicionId` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `valor` int(10) DEFAULT NULL,
  `dispositivoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Mediciones`

INSERT INTO `Mediciones` (`medicionId`, `fecha`, `valor`, `dispositivoId`) VALUES
(1, '2023-04-20 21:19:41', 60, 1),
(2, '2023-04-20 21:19:41', 40, 1),
(3, '2023-04-20 21:19:41', 30, 2),
(4, '2023-04-20 21:19:41', 50, 3),
(5, '2023-04-20 21:19:41', 33, 5),
(6, '2023-04-20 21:19:41', 17, 4),
(7, '2023-04-20 21:19:41', 29, 6),
(8, '2023-04-20 22:19:41', 20, 1),
(9, '2023-04-20 22:19:41', 44, 4),
(10, '2023-04-20 22:19:41', 61, 5),
(11, '2023-04-20 22:19:41', 12, 2);


-- Indices de la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  ADD PRIMARY KEY (`dispositivoId`,`electrovalvulaId`),
  ADD KEY `fk_Dispositivos_Electrovalvulas1_idx` (`electrovalvulaId`);

-- Indices de la tabla `Electrovalvulas`
ALTER TABLE `Electrovalvulas`
  ADD PRIMARY KEY (`electrovalvulaId`);

-- Indices de la tabla `Log_Riegos`

ALTER TABLE `Log_Riegos`
  ADD PRIMARY KEY (`logRiegoId`,`electrovalvulaId`),
  ADD KEY `fk_Log_Riegos_Electrovalvulas1_idx` (`electrovalvulaId`);

-- Indices de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD PRIMARY KEY (`medicionId`,`dispositivoId`),
  ADD KEY `fk_Mediciones_Dispositivos_idx` (`dispositivoId`);


-- AUTO_INCREMENT de la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  MODIFY `dispositivoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- AUTO_INCREMENT de la tabla `Electrovalvulas`

ALTER TABLE `Electrovalvulas`
  MODIFY `electrovalvulaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

-- AUTO_INCREMENT de la tabla `Log_Riegos`

ALTER TABLE `Log_Riegos`
  MODIFY `logRiegoId` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;


-- Filtros para la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  ADD CONSTRAINT `fk_Dispositivos_Electrovalvulas1` FOREIGN KEY (`electrovalvulaId`) REFERENCES `Electrovalvulas` (`electrovalvulaId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Filtros para la tabla `Log_Riegos`

ALTER TABLE `Log_Riegos`
  ADD CONSTRAINT `fk_Log_Riegos_Electrovalvulas1` FOREIGN KEY (`electrovalvulaId`) REFERENCES `Electrovalvulas` (`electrovalvulaId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Filtros para la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD CONSTRAINT `fk_Mediciones_Dispositivos` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivos` (`dispositivoId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;