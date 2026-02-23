# tp-final-lucas-caballero


🐾 Sistema de Gestión Veterinaria
Este es un sistema integral para clínicas veterinarias que permite gestionar el acceso de profesionales, el registro de mascotas y el historial clínico de los pacientes.

Tecnologías utilizadas:

Backend: Node.js, Express, TypeScript.

Base de Datos: MySQL.

Seguridad: JSON Web Tokens (JWT) y Bcrypt para el hash de contraseñas.

Frontend: HTML5, CSS3 (Grid/Flexbox) y TypeScript.


🚀 Pasos para la Instalación
1. Clonar el proyecto y preparar dependencias
Primero, asegúrate de estar dentro de la carpeta del proyecto y ejecuta:

npm install


2. Configuración de la Base de Datos
Crea una base de datos en MySQL llamada veterinaria_db (o el nombre que prefieras) y ejecuta el siguiente script para crear las tablas:

SQL

CREATE TABLE duenos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    especie VARCHAR(50),
    fecha_de_nacimiento DATE,
    dueno_id INT,
    FOREIGN KEY (dueno_id) REFERENCES duenos(id)
);

CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    matricula VARCHAR(20) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE historial_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT,
    descripcion TEXT,
    fecha_de_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);


Gemini ha dicho
¡Excelente cierre! Un buen README es la carta de presentación de cualquier proyecto. Le permite a otra persona (o a tu profesor) instalar y correr todo en 5 minutos sin tener que adivinar qué librerías usaste o cómo se llama la base de datos.

Aquí tienes una estructura profesional y clara para tu archivo README.md:

🐾 Sistema de Gestión Veterinaria
Este es un sistema integral para clínicas veterinarias que permite gestionar el acceso de profesionales, el registro de mascotas y el historial clínico de los pacientes.

Tecnologías utilizadas:

Backend: Node.js, Express, TypeScript.

Base de Datos: MySQL.

Seguridad: JSON Web Tokens (JWT) y Bcrypt para el hash de contraseñas.

Frontend: HTML5, CSS3 (Grid/Flexbox) y TypeScript.

🚀 Pasos para la Instalación
1. Clonar el proyecto y preparar dependencias
Primero, asegúrate de estar dentro de la carpeta del proyecto y ejecuta:

Bash
npm install
2. Configuración de la Base de Datos
Crea una base de datos en MySQL llamada veterinaria_db (o el nombre que prefieras) y ejecuta el siguiente script para crear las tablas:

SQL
CREATE TABLE duenos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    especie VARCHAR(50),
    fecha_de_nacimiento DATE,
    dueno_id INT,
    FOREIGN KEY (dueno_id) REFERENCES duenos(id)
);

CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    matricula VARCHAR(20) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE historial_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT,
    descripcion TEXT,
    fecha_de_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
);




3. Variables de Entorno
Crea un archivo .env en la raíz del proyecto con tus credenciales:


DB_USER=root
DB_HOST=localhost
DB_PASSWORD=
DB_NAME=veterinaria_patitas_felices
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_super_segura




4. Compilación y Ejecución
Para iniciar el servidor en modo desarrollo utilizando TypeScript:


# Ejecutar el Backend
npx ts-node src/app.ts



🛠️ Funcionalidades Principales
Autenticación Segura: Los veterinarios deben ingresar con su matrícula y contraseña. El sistema utiliza JWT para proteger las rutas privadas.

Registro Inteligente de Mascotas: Al agregar una mascota, el sistema busca automáticamente si el dueño ya existe por su nombre. Si no existe, lo crea automáticamente.

Autocompletado (Datalist): Al escribir el nombre del dueño, el sistema sugiere nombres de dueños ya registrados.

Historial Clínico: Visualización de pacientes con su respectiva información de dueño y detalles médicos mediante LEFT JOIN para incluir pacientes nuevos sin registros.

Panel de Control Dinámico: Una interfaz que cambia según el estado de la sesión (Login vs Dashboard).



👨‍⚕️ Usuario de Prueba
Matrícula: 4501

Contraseña: admin123