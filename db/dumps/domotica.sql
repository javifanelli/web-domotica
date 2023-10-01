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

CREATE DATABASE IF NOT EXISTS `Domotica` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `Domotica`;

-- Tabla `Dispositivos`

CREATE TABLE `Dispositivos` (
  `dispositivoId` varchar(17) NOT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `mac` varchar(17) NOT NULL DEFAULT '',
  `tipo` varchar(100) NOT NULL,
  `alarma` int(11) NOT NULL,
  `act_al` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Dispositivos`

INSERT INTO `Dispositivos` (`dispositivoId`, `nombre`, `ubicacion`, `mac`, `tipo`, `alarma`, `act_al`) VALUES
('0028192332001', 'ESP32+DHT22', 'Habitación', '94:B5:55:2B:FF:64', 'Temperatura', 30, 1),
('0128192332001', 'ESP32', 'Sala', 'B0:A7:32:DD:18:0C', 'Luz dimmer', 0, 0);

-- Estructura de tabla para la tabla `Usuarios`

CREATE TABLE `Usuarios` (
  `userId` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `updated` TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcado de datos para la tabla `Usuarios`

INSERT INTO `Usuarios` (`userId`, `user`, `password`, `nombre`, `apellido`, `email`, `updated`) VALUES
(1, 'user1', 'user' , 'Nombre', 'Apellido', 'user1@example.com', 0),
(2, 'user2', 'user' , 'Nombre', 'Apellido', 'user2@example.com', 0),
(3, 'user3', 'user' , 'Nombre', 'Apellido', 'user3@example.com', 0);

-- Estructura de tabla para la tabla `Mediciones`

CREATE TABLE `Mediciones` (
  `medicionId` int(11) NOT NULL,
  `dispositivoId` varchar(17) NOT NULL,
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

-- AUTO_INCREMENT de la tabla `Usuarios`

ALTER TABLE `Usuarios`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- AUTO_INCREMENT de la tabla `Mediciones`

ALTER TABLE `Mediciones`
  MODIFY `medicionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

-- Filtros para la tabla `Mediciones`

ALTER TABLE `Mediciones`
  ADD CONSTRAINT `fk_Mediciones_Dispositivos` FOREIGN KEY (`dispositivoId`) REFERENCES `Dispositivos` (`dispositivoId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
  
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;