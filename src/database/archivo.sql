CREATE DATABASE veterinaria_patitas_felices;

USE veterinaria_patitas_felices;


CREATE TABLE duenos (

	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR (50) NOT NULL,
    apellido VARCHAR (50) NOT NULL,
    telefono VARCHAR (20) NOT NULL,
    direccion VARCHAR (100)

);

USE veterinaria_patitas_felices;

CREATE TABLE mascotas (

    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR (50) NOT NULL,
    especie VARCHAR (30) NOT NULL,
    fecha_de_nacimiento DATE,
    dueno_id INT NOT NULL,
    FOREIGN KEY (dueno_id) REFERENCES duenos(id) ON DELETE CASCADE

);

USE veterinaria_patitas_felices;

CREATE TABLE veterinarios (

	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    especialidad VARCHAR(50) NOT NULL

);


USE veterinaria_patitas_felices;
CREATE TABLE historial_clinico(

    id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT,
    veterinario_id INT,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id),
    fecha_de_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(250) NOT NULL

);

USE veterinaria_patitas_felices;

INSERT INTO duenos (id,nombre,apellido,telefono,direccion) VALUES
(1,'Ash', 'Ketchup', 45236848, 'Pueblo paleta'),
(2,'Gary', 'Oak', 45236040, 'Pueblo paleta'),
(3,'Misty', 'Kasumi', 45236041, 'ciudad Celeste');


INSERT INTO mascotas (nombre,especie, fecha_de_nacimiento,dueno_id) VALUES 
('Pikachu','Electrico', '1996-02-27', 1),
('Arcanine','Fuego', '1996-04-27', 2),
('Starmie', 'Agua', '1996-03-27',3);


INSERT INTO veterinarios (nombre,apellido, matricula, especialidad) VALUES 
('Profesor','Oak', '4501', 'Iniciales'),
('Profesor','Abedul', '4502', 'Aventura');


INSERT INTO historial_clinico (mascota_id, veterinario_id, fecha_de_registro, descripcion) VALUES
(1,1,'2025-12-17', 'Esta teniendo problemas de estatica inconciente'),
(2,1,'2025-12-18', 'Tiene una inflamacion en la garganta'),
(3,2,'2025-12-17', 'Se le rompio un poco el cristal');

UPDATE duenos SET direccion = 'Hoenn' WHERE id = 2;

SELECT * FROM veterinaria_patitas_felices.veterinarios;

UPDATE veterinarios
SET especialidad = 'Exterior'
WHERE matricula = '4502';


SELECT * FROM veterinaria_patitas_felices.historial_clinico;

UPDATE historial_clinico
SET descripcion = 'Mejoro de la estatica pero sigue con fiebre'
WHERE id= 1;


DELETE FROM mascotas WHERE id = 2;


SELECT * FROM veterinaria_patitas_felices.historial_clinico;


SELECT 
m.nombre , m.especie, 
CONCAT (d.nombre, ' ', d.apellido) AS dueno_nombre_completo
FROM mascotas m 
JOIN duenos d ON m.id = d.id;


SELECT 
CONCAT(m.nombre , ' ', m.especie) AS nombre_y_especie_de_mascota, 
CONCAT(d.nombre, ' ', d.apellido) AS dueno_nombre_completo,
CONCAT(v.nombre, ' ', v.apellido) AS veterinario_nombre_completo,
h.fecha_de_registro,
h.descripcion 
FROM historial_clinico h
JOIN mascotas m ON h.mascota_id = m.id
JOIN duenos d ON m.dueno_id = d.id
JOIN veterinarios v ON h.veterinario_id = v.id
ORDER BY h.fecha_de_registro DESC;


ALTER TABLE veterinarios ADD COLUMN password VARCHAR(255);


SET SQL_SAFE_UPDATES = 0;

UPDATE veterinarios 
SET password = '$2b$10$7vN6j.h77u9eK83U.L6EuenLpBv6P9N6YmX7vM.8o3A1Q5X7vM.8o' 
WHERE matricula = '4501';

SET SQL_SAFE_UPDATES = 1;

