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
SET time_zone = "+03:00";

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
  `mac` varchar(17) NOT NULL,
  `tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Dispositivos`

INSERT INTO `Dispositivos` (`dispositivoId`, `nombre`, `ubicacion`, `mac`, `tipo`) VALUES
(1, 'ESP32+DHT22', 'Habitación', '94:B5:55:2B:FF:64', 'Temperatura'),
(2, 'ESP32', 'Sala', '0C:B8:15:D8:7A:6C', 'Luz dimmer');

-- Estructura de tabla para la tabla `Usuarios`

CREATE TABLE `Usuarios` (
  `userId` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Usuarios`

INSERT INTO `Usuarios` (`userId`, `user`, `password`, `nombre`, `apellido`, `email`) VALUES
(1, 'javier', 'ceiot' , 'Javier', 'Fanelli', 'javifanelli@gmail.com'),
(2, 'jperez', '123456' , 'Juan', 'Pérez', 'jperez@cualmail.com'),
(3, 'maria', 'abcdef' , 'María', 'Fernández', 'mariaf@cualmail.com');

-- Estructura de tabla para la tabla `Mediciones`

CREATE TABLE `Mediciones` (
  `medicionId` int(11) NOT NULL,
  `dispositivoId` int(17) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `valor` int(10) DEFAULT NULL,
  `set_point` int(10) DEFAULT NULL,
  `modo` varchar(100) DEFAULT NULL,
  `salida` int(11) NOT NULL,
  `hon` int(11) NOT NULL,
  `mon` int(11) NOT NULL,
  `hoff` int(11) NOT NULL,
  `moff` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Mediciones`

INSERT INTO `Mediciones` (`medicionId`, `dispositivoId`, `tipo`, `fecha`, `valor`, `set_point`, `modo`, `salida`, `hon`, `mon`, `hoff`, `moff`) VALUES
(1, 1, 'Temperatura' ,'2023-08-23 21:19:41', 19, 22, "Manual", 0, 20, 0, 8, 0),
(2, 2, 'Luz dimmer', '2023-08-23 21:42:41', 40, 40, "Automático", 40, 20, 0, 8, 0),
(3, 3, 'Temperatura' ,'2023-08-23 21:23:41', 22, 20, "Manual", 100, 20, 0, 8, 0);

-- Indices de la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  ADD PRIMARY KEY (`dispositivoId`,`mac`);

-- Indices de la tabla `Usuarios`

ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`userId`);

-- Indices de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD PRIMARY KEY (`medicionId`,`dispositivoId`),
  ADD KEY `fk_Mediciones_Dispositivos_idx` (`dispositivoId`);

-- AUTO_INCREMENT de la tabla `Dispositivos`

ALTER TABLE `Dispositivos`
  MODIFY `dispositivoId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

-- AUTO_INCREMENT de la tabla `Usuarios`

ALTER TABLE `Usuarios`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- AUTO_INCREMENT de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- Filtros para la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD CONSTRAINT `fk_Mediciones_Dispositivos` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivos` (`dispositivoId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
  
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;