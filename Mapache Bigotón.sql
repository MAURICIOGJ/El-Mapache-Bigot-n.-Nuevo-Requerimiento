CREATE DATABASE mapache_bigoton;
USE mapache_bigoton;

CREATE TABLE cliente(
id_cliente bigint,
nombre Varchar(50),
telefono Varchar(15)
);

CREATE TABLE servicio(
id_servicio bigint,
descripcion Varchar(50),
costo double
);

CREATE TABLE cita(
id_cita bigint,
fecha date,
hora time
);

CREATE TABLE usuario(
id_usuario bigint,
nombre Varchar(45),
contraseña Varchar(45),
);


