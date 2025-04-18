# Prueba Técnica de Seneca

Crear una aplicación web con las siguientes funcionalidades requeridas:  
• Inicio de sesión  
  o Registrar fecha y hora de último inicio de sesión  
• Cerrar sesión  
• Registro de nuevos usuarios  
• Activación de cuenta por correo electrónico  
• Recuperación de contraseña  
• Formulario de actualización de información de usuario  
  o Nombres  
  o Apellidos  
  o Dirección  
  o Fecha de nacimiento  
• Incluir un usuario por defecto

---

## Tecnologías Utilizadas

### Backend
- Node.js v20.17.0
- Express.js
- PostgreSQL 17.0
- Sequelize ORM
- JWT para autenticación
- Nodemailer para envío de correos

### Frontend
- Angular v19.2.6 (standalone)
- Reactive Forms
- Estilos globales con SCSS

---

## Funcionalidades Implementadas

### Autenticación
- Registro de usuarios con verificación por correo
- Login solo si la cuenta está verificada
- Almacenamiento del token JWT
- Último inicio de sesión registrado en la base de datos y visualizado en frontend

### Recuperación de contraseña
- Solicitud por correo electrónico
- Formulario con doble campo para validación

### Gestión de perfil
- Visualización y actualización de:
  - Nombre
  - Apellido
  - Dirección
  - Fecha de nacimiento

### Navegación
- Rutas protegidas
- Redirección a login si no hay sesión
- Logout funcional

---

## Validaciones Implementadas

### Backend (Node.js + Express)

**Registro de usuario:**
- Verifica si el correo ya está registrado.
- Hashea la contraseña antes de guardarla.
- Genera token de verificación y lo almacena.

**Verificación de cuenta:**
- Solo permite acceso si el token es válido y no ha expirado.
- Cambia el estado de verificación y elimina el token.

**Login:**
- Requiere correo y contraseña válidos.
- Solo permite ingreso a cuentas verificadas.
- Guarda el `lastLogin` (fecha y hora del último inicio de sesión).

**Recuperación de contraseña:**
- Verifica existencia del correo antes de enviar.
- Token de recuperación con expiración.
- El token se invalida al cambiar la contraseña.

**Actualización de perfil:**
- Valida que el usuario exista antes de actualizar.
- Permite modificar nombre, apellido, dirección y fecha de nacimiento.

---

### Frontend (Angular)

**Formularios reactivos con validaciones personalizadas:**
- Todos los campos obligatorios están marcados como `required`.
- Correos deben tener formato válido (`Validators.email`).
- Contraseñas con mínimo 6 caracteres (`Validators.minLength(6)`).

**Mensajes visuales de error:**
- Muestra mensajes personalizados por campo si está vacío o inválido.
- Contraseñas no coinciden (en recuperación) muestra error claro.

**Control de envío de formularios:**
- Botones deshabilitados si el formulario es inválido o mientras se procesa.

**Mensajes de confirmación:**
- Muestra mensajes con íconos de ✅ éxito o ❌ error para cada acción.

**Carga automática de datos en Home:**
- Los datos del usuario se cargan automáticamente si está autenticado.

---

## Configuración del proyecto

### Requisitos
- Node.js y npm instalados
- PostgreSQL en funcionamiento
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)

---

### Instalación del proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Edriplx/prueba_seneca.git
   ```

2. Abre por separado la carpeta `seneca-backend` y `seneca-frontend` en Visual Studio Code.

3. Instala las dependencias del backend y frontend:
   ```bash
   npm install
   ```
   Nota: Importante ejecutar este comando para el backend y frontend en el terminal

4. En el backend, configura las variables de entorno en el archivo `.env`:
   ```env
   DB_NAME=seneca
   DB_USER=postgres
   DB_PASS=contraseña_de_base_de_datos
   DB_HOST=localhost
   ```

5. Crear la base de datos:
   Es necesario crear la base de datos en el servidor de PostgreSQL, en este caso, el nombre debe ser `seneca`.

6. Importar la base de datos (opcional):

   Si se desea iniciar con un usuario por defecto ya creado, importar el archivo `seneca.sql` usando **pgAdmin**:

   - Abrir pgAdmin  
   - Crear la base de datos con el nombre seneca (si aún no existe)
   - Hacer clic derecho sobre la base de datos seneca → Query Tool
   - Abrir el archivo seneca.sql o copiar y pegar su contenido
   - Ejecutar el script con el botón Run 

---

### Ejecución del proyecto

1. Asegurarse de que la base de datos esté activa.

2. Iniciar el servidor backend:
   ```bash
   npm run dev
   ```

3. Iniciar el servidor frontend:
   ```bash
   ng serve
   ```

4. Acceder a la aplicación en:  
   [http://localhost:4200](http://localhost:4200)

5. Se puede usar el siguiente usuario para acceder al Home (si se importó la base de datos):

   - **Correo:** edripl31@gmail.com  
   - **Contraseña:** 123456

---

### Imágenes del proyecto

Todas las imágenes de la aplicación se encuentran en la carpeta `img` del proyecto.

---

### Notas importantes

- Abrir el enlace de verificación del correo en el mismo navegador (o en la misma computadora) donde se está ejecutando el proyecto, ya que la aplicación corre en un servidor local (`localhost`).
- Es necesario crear únicamente la base de datos `seneca`, ya que las tablas y los campos se crean automáticamente al ejecutar el backend.
- El correo puede llegar a la bandeja de los correos no deseados en algunos casos.

---

**Desarrollado por Edri Villagrán como parte de un proceso de selección para un puesto de programador.**