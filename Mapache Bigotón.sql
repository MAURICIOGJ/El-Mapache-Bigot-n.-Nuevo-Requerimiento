CREATE DATABASE mapache_bigoton;
USE mapache_bigoton;

CREATE TABLE cliente(
id int,
nombre Varchar(50),
telefono Varchar(15)
);

CREATE TABLE servicio(
id int,
descripcion Varchar(50),
costo decimal
);

CREATE TABLE cita(
id int,
fecha date,
hora time
)


