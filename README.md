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



🏗️ Arquitectura del Sistema (MVC)
Dividimos el código en capas para que sea organizado y escalable:

1. El Backend (Servidor Node.js + Express)
Es el "cerebro" que se comunica con la base de datos MySQL.

Models (Modelos): Contienen las consultas SQL (SELECT, INSERT, DELETE). Es la única capa que "toca" la base de datos.

Controllers (Controladores): Reciben las peticiones del Frontend, validan los datos y llaman a los modelos.

Routes (Rutas): Definen los "endpoints" o direcciones.

/auth: Para el login.

/api: Para el historial, mascotas y dueños (protegidas por token).

Middlewares: El authMiddleware intercepta las peticiones a /api para verificar que el usuario tenga un token válido antes de dejarlo pasar.


Es lo que ve el usuario en el navegador.

HTML/CSS: La interfaz visual (formularios de login y registro).

TypeScript (index.ts): Gestiona la lógica del navegador.

Captura los datos del formulario.

Hace los fetch al servidor.

Guarda el Token en el localStorage.

Actualiza el DOM (la pantalla) sin recargar la página gracias a e.preventDefault().

.

🔐 Flujo de Seguridad (Login)
El usuario ingresa su Matrícula y Contraseña.

El Frontend envía un POST a http://localhost:3000/auth/login.

El Servidor verifica en la base de datos. Si es correcto, genera un Token JWT y lo devuelve.

El Frontend guarda ese Token y lo envía en el "Header" de cada petición futura (Authorization: Bearer <token>).


Aquí tienes una estructura profesional y clara para tu archivo README.md:

🐾 Sistema de Gestión Veterinaria
Este es un sistema integral para clínicas veterinarias que permite gestionar el acceso de profesionales, el registro de mascotas y el historial clínico de los pacientes.

Tecnologías utilizadas:

Backend: Node.js, Express, TypeScript.

Base de Datos: MySQL.

Seguridad: JSON Web Tokens (JWT) y Bcrypt para el hash de contraseñas.

Frontend: HTML5, CSS3 (Grid/Flexbox) y TypeScript.




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
npm run dev



🛠️ Funcionalidades Principales
Autenticación Segura: Los veterinarios deben ingresar con su matrícula y contraseña. El sistema utiliza JWT para proteger las rutas privadas.

Registro Inteligente de Mascotas: Al agregar una mascota, el sistema busca automáticamente si el dueño ya existe por su nombre. Si no existe, lo crea automáticamente.

Autocompletado (Datalist): Al escribir el nombre del dueño, el sistema sugiere nombres de dueños ya registrados.

Historial Clínico: Visualización de pacientes con su respectiva información de dueño y detalles médicos mediante LEFT JOIN para incluir pacientes nuevos sin registros.

Panel de Control Dinámico: Una interfaz que cambia según el estado de la sesión (Login vs Dashboard).



👨‍⚕️ Usuario de Prueba
Matrícula: 4501

Contraseña: admin123