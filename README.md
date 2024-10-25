# dochmart_prueba_tecnica

# Instrucciones

## Frontend

Ejecutar los siguientes comandos desde la carpeta de `/backend`

`npm install`

`npm start`

> Nota: el puerto en el que se ejecuta el servidor de frontend debe coincidir con el indicado al backend en la variable de entorno `CORS_CLIENT_ORIGIN`. El puerto por defecto es `4200`

-----

## Backend
Requisitos de instalación:
- NodeJs
- MySQL

Crear un archivo .env en la carpeta `/backend`. A continuación se muestra un ejemplo de su contenido:
```
DATABASE_HOST="localhost"
DATABASE_NAME="dochmart_prueba_tecnica"
DATABASE_USERNAME="root"
DATABASE_PASSWORD="root"
SERVER_PORT=3000
JWT_SECRET="JWT_SECRET"
CORS_CLIENT_ORIGIN="http://localhost:4200"
USER_REPORT_URL="http://localhost:8000"
```

> Nota: verificar que la base de datos se encuentre disponible, y crear la nueva base de datos indicada en la variable de entorno `DATABASE_ENV`

Ejecutar los siguientes comandos desde la carpeta de `/backend`

`npm install`

`npx tsx index.ts`

El servidor de backend se encontrará disponible en el puerto `3000`.
En caso de algún error, se mostrará en consola (ej. conexión a base de datos)

### Actualización de tablas de base de datos

Actualmente la conexión a la base de datos se realiza con `Sequelize`, con configuración para siempre sincronizar la estructura de las tablas con los modelos.

**Cada vez que el servidor de backend es ejecutado, se realiza un DROP TABLE a todas las tablas.**

Para cambiar este comportamiento, comentar la línea correspondiente en el archivo `/backend/components/database.ts`

### Rutas de backend

| Método | Path | Descripción | Parámetros | Auth. Requerida |
| --- | --- | --- | --- | --- |
| POST | /auth/login | Recibe credenciales de usuario y devuelve un token de autenticación y datos del usuario | email, password | |
| POST | /auth/signup | Recibe credenciales de usuario y crea un registra un nuevo usuario en la base de datos | name, email, password, passwordConfirm | |
| POST | /auth/logout | Finaliza la sesión del usuario |  | |
| POST | /user/current | Devuelve la información del usuario correspondiente al token |  | Sí |
| POST | /user/report | Genera un reporte (PDF) con la información del usuario correspondiente al token |  | Sí |

### Autorización con token

> Solo aplicable a rutas con `Auth. Requerida -> Sí`

La autorización en las rutas de usuario se realiza mediante JWT, que debe ser enviado en el siguiente header (token bearer):

`Authorization`: `Bearer <token>`

-----

## Servicio de Reporte

Requisitos de instalación:
- NodeJs

Ejecutar el siguiente comando desde la carpeta de `/report_service`

`php -S localhost:8000 user_report.php`

El servidor del servicio de reporte se encontrará disponible en el puerto `8000`

> Nota: el puerto en el que se ejecuta el servicio de reporte debe coincidir con el indicado al backend en la variable de entorno USER_REPORT_URL