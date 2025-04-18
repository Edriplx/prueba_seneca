-- PostgreSQL database partial dump
-- Versión ajustada para ejecución en pgAdmin

-- Configuraciones
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Crear tabla Users
CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    address character varying(255),
    birthdate date,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    verified boolean DEFAULT false,
    "verificationToken" character varying(255),
    "resetToken" character varying(255),
    "resetTokenExpiry" timestamp with time zone,
    "lastLogin" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- Crear secuencia
CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Asociar la secuencia con la tabla
ALTER TABLE ONLY public."Users"
    ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);

-- Insertar datos de ejemplo (usuario por defecto)
INSERT INTO public."Users" (id, "firstName", "lastName", address, birthdate, email, password, verified, "verificationToken", "resetToken", "resetTokenExpiry", "lastLogin", "createdAt", "updatedAt")
VALUES (1, 'Edri', 'Villagran', 'Quito', '2000-04-25', 'edripl31@gmail.com', '$2b$10$ky1gxJ4zmofe3yOx7vCADulfaJUsKAiLNELVzxMqi1wDtPCJw8LH6', true, NULL, NULL, NULL, '2025-04-17 20:16:02.769-05', '2025-04-17 20:15:37.031-05', '2025-04-17 20:16:02.77-05');

-- Establecer valor actual de la secuencia
SELECT pg_catalog.setval('public."Users_id_seq"', 1, true);

-- Restricciones
ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);
