CREATE TABLE contratos_clientes_maps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    telefono VARCHAR(20),
    rfc VARCHAR(20),
    correo VARCHAR(100),
    nombre_empresa VARCHAR(100),
    origen VARCHAR(255),
    destino VARCHAR(255),
    distancia DECIMAL(10,2),
    duracion VARCHAR(50),
    peajes DECIMAL(10,2),
    tipo_vehiculo VARCHAR(50),
    tipo_material VARCHAR(50),
    peso DECIMAL(10,2),
    fecha_salida DATETIME,
    fecha_entrega DATETIME,
    estatus VARCHAR(50),
    precio_total DECIMAL(10,2),
    id_usuario INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


