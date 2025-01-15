-- Crear la base de datos
CREATE DATABASE transporte_cotizaciones;

-- Usar la base de datos
USE transporte_cotizaciones;

-- Crear la tabla administradores
CREATE TABLE administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    creado_en DATETIME
);

-- Insertar datos en la tabla administradores
INSERT INTO administradores (nombre, email, password, creado_en) VALUES
('Admin', 'admin@example.com', 'password_hash', NOW());

-- Crear la tabla camiones
CREATE TABLE camiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_transporte VARCHAR(50),
    tipo_vehiculo VARCHAR(50),
    placas_transporte VARCHAR(20),
    numero_economico VARCHAR(20),
    modelo_vehiculo INT,
    configuracion_vehicular VARCHAR(50),
    tipo_permiso_sct VARCHAR(50),
    numero_permiso_sct VARCHAR(50),
    nombre_aseguradora VARCHAR(100),
    numero_poliza VARCHAR(50),
    rendimiento DECIMAL(5,2),
    capacidad_carga DECIMAL(5,2)
);

-- Insertar datos en la tabla camiones
INSERT INTO camiones (tipo_transporte, tipo_vehiculo, placas_transporte, numero_economico, modelo_vehiculo, configuracion_vehicular, tipo_permiso_sct, numero_permiso_sct, nombre_aseguradora, numero_poliza, rendimiento, capacidad_carga) VALUES
('TORTON', 'CAJA GRANDE', '38-BC-2V', 'GZ-02', 1997, '2 EJES 6 LLANTAS', 'CARGA EN GENERAL', '1522РЕНК24032021021001000', 'QUALITAS', '0004406441', 4.00, 15.00);

-- Crear la tabla choferes
CREATE TABLE choferes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfc VARCHAR(30),
    nombre_completo VARCHAR(255),
    numero_licencia VARCHAR(50),
    numero_seguridad_social VARCHAR(50),
    numero_telefono VARCHAR(20)
);

-- Insertar datos en la tabla choferes
INSERT INTO choferes (rfc, nombre_completo, numero_licencia, numero_seguridad_social, numero_telefono) VALUES
('AAVM790930595', 'MIGUEL ANGEL ÁLVAREZ VARGAS', 'LFD00048683', '16-97-77-6142-4', '+52 712 222 9238');

-- Crear la tabla clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    correo VARCHAR(255),
    rfc VARCHAR(20),
    curp VARCHAR(20),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    nombre_empresa VARCHAR(255),
    password VARCHAR(255)
);

-- Insertar datos en la tabla clientes
INSERT INTO clientes (nombre, apellidos, correo, rfc, curp, telefono, direccion, nombre_empresa, password) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', 'JUPR850101HDFRRL01', 'JUPR850101HDFRRL01', '+52 555 123 4567', 'Calle Falsa 123, CDMX', 'Empresa S.A.', 'password_hash');

-- Crear la tabla rutas
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(255),
    destino VARCHAR(255),
    distancia VARCHAR(255),
    numero_casetas INT,
    nombre_caseta VARCHAR(255),
    costo_caseta VARCHAR(255),
    tiempo_aproximado VARCHAR(255),
    fecha_ruta DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Insertar datos en la tabla rutas
INSERT INTO rutas (origen, destino, distancia, numero_casetas, nombre_caseta, costo_caseta, tiempo_aproximado, fecha_ruta, created_at, updated_at) VALUES
('CDMX', 'TOLUCA', '52', 2, 'OCOYOACAC, LA MARQUESA', '22, 25', '30 MIN', '2024-12-13', '2024-12-13 17:59:02', '2024-12-13 18:09:50');

-- Crear la tabla tipo_material
CREATE TABLE tipo_material (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre_material VARCHAR(50)
);

-- Insertar datos en la tabla tipo_material
INSERT INTO tipo_material (nombre_material) VALUES
('Flamable'),
('Peligroso'),
('Perecedero'),
('No perecedero'),
('Químico'),
('Material de construcción'),
('Electrónico'),
('Automotriz'),
('Farmacéutico'),
('Tóxico'),
('Fragil'),
('A granel'),
('Refrigerado'),
('Textil'),
('Vidrio');

-- Crear la tabla contratos_clientes
CREATE TABLE contratos_clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    telefono VARCHAR(20),
    rfc VARCHAR(20),
    correo VARCHAR(100),
    nombre_empresa VARCHAR(100),
    ruta VARCHAR(255),
    peso DECIMAL(10,2),
    tipo_material VARCHAR(50),
    precio_total DECIMAL(10,2),
    estatus VARCHAR(50),
    fecha_creacion TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    nombre_camion VARCHAR(255),
    fecha_salida DATETIME,
    fecha_entrega DATETIME,
    id_usuario INT
);

-- Crear la tabla cotizaciones_rapidas
CREATE TABLE cotizaciones_rapidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    origen VARCHAR(255),
    destino VARCHAR(255),
    peso DECIMAL(10,2),
    tipo_mercancia VARCHAR(50),
    fecha_salida DATETIME,
    fecha_entrega DATETIME,
    costo DECIMAL(10,2),
    estatus VARCHAR(50),
    fecha_creacion TIMESTAMP,
    nombre_camion VARCHAR(255)
);


