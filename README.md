# 🧩 OnOff_ToDoList_Front

## 📘 Descripción general

**OnOff_ToDoList_Front** es la aplicación **frontend** desarrollada en **Angular 19**, diseñada para consumir los servicios REST del microservicio `WebApi_OnOff_ToDoList`.  
Esta interfaz permite **autenticación JWT**, **gestión de tareas**, **visualización dinámica** y **operaciones CRUD** sobre los registros del sistema.

Su objetivo es ofrecer una interfaz moderna, adaptable y sólida, desarrollada bajo buenas prácticas de arquitectura y mantenibilidad.

---

## ⚙️ Arquitectura y tecnologías utilizadas

El proyecto se estructura siguiendo un modelo **modular y escalable**, aplicando principios de **clean code** y **reactividad** con **Signals**:

---
onoff-todolist-front/
│
├── src/
│ ├── app/
│ │ ├── core/ → Servicios, interfaces y utilidades globales
│ │ │ ├── interfaces/ → Modelos: IUser, ITask, IStatusTask, ILoginResponse
│ │ │ └── services/ → AuthService, TaskService, AlertsMessagesService, etc.
│ │ ├── layout/ → Componentes de interfaz principal (sidebar, topbar)
│ │ ├── pages/ → Vistas principales (login, dashboard, tasks)
│ │ ├── shared/ → Componentes reutilizables
│ │ ├── app.config.ts → Configuración global (routing, providers, PrimeNG, JWT)
│ │ └── app.component.ts/html → Raíz de la aplicación
│ │
│ ├── environments/ → Configuración de entornos
│ ├── assets/ → Recursos estáticos (iconos, logos, estilos)
│ └── styles.scss → Estilos globales con Tailwind y PrimeNG
│
├── proxy.conf.json → Proxy local para redirigir solicitudes /api al backend
├── package.json → Dependencias y scripts del proyecto
└── angular.json → Configuración de build y estilos globales

---

## 💡 Decisiones técnicas tomadas

1. **Angular 19 con Standalone Components:**  
   Se eliminó el uso de `app.module.ts`, usando la nueva API de configuración basada en `app.config.ts` y `provideRouter`.

2. **JWT Auth Interceptor:**  
   Se implementó un interceptor global (`jwt.interceptor.ts`) que adjunta automáticamente el token JWT almacenado en `localStorage` a todas las peticiones HTTP autenticadas.

3. **Arquitectura basada en Signals:**  
   Se utilizó el API de `signal()` para manejar estados reactivos (por ejemplo, usuario actual, loading states, mensajes globales).

4. **Proxy local (`proxy.conf.json`):**  
   Permite que el frontend acceda al backend (`https://localhost:7266/api`) evitando problemas de CORS durante desarrollo.

5. **Manejo de errores centralizado:**  
   Se implementaron interceptores y alertas globales (`AlertsMessagesService`) con PrimeNG Toast/Dialog para mostrar mensajes de error o éxito al usuario.

6. **PrimeNG + TailwindCSS:**  
   - **PrimeNG** para componentes visuales (tablas, botones, diálogos, formularios).  
   - **TailwindCSS** para diseño responsivo, espaciados, fuentes y estilos modernos.

7. **Paginación y Lazy Loading:**  
   La tabla de tareas (`TasksComponent`) carga datos de forma paginada desde el backend usando `onLazyLoad`.

8. **Modularidad y mantenibilidad:**  
   Cada feature (auth, tasks, alerts) está aislada y desacoplada, facilitando nuevas extensiones o integraciones futuras.

---

## 🔐 Autenticación y manejo de sesión

- El **login** se realiza mediante el endpoint `/api/login` del backend.  
- Al iniciar sesión correctamente, se guarda:
  - `token` → en `localStorage`
  - `user` → objeto serializado con nombre y correo
- El interceptor **JWT** agrega el encabezado:

## Authorization: Bearer <token>
a cada solicitud autenticada.
- Al cerrar sesión, se limpian los datos del `localStorage` y se redirige automáticamente al `login`.

---

## 🧱 Funcionalidades principales

### 🔹 Login
- Formulario validado con Reactive Forms.
- Manejo de errores con PrimeNG Toast.
- Redirección automática al dashboard tras autenticarse.

### 🔹 Dashboard
- Vista inicial (ruta `/`) que mostrará métricas generales:
- Total de tareas  
- Tareas completadas  
- Tareas pendientes

### 🔹 Módulo de Tareas (`/tasks`)
- Tabla dinámica con **paginación**, **filtros por usuario/correo/título**, **ordenamiento** y **búsqueda global**.
- Botones de acción (editar/eliminar).
- Diálogo modal para crear o editar tareas (`TaskEditCreateComponent`).
- Confirmaciones y notificaciones visuales mediante Toast/Dialog.

---

## 🧩 Configuración de entorno

### 🔹 Proxy local
Archivo `proxy.conf.json`:

```json
{
"/api": {
  "target": "https://localhost:7266",
  "secure": false,
  "changeOrigin": true
}
}
---
## Comando de ejecución con proxy
```
ng serve --proxy-config proxy.conf.json

```

# 🚀 Ejecución del proyecto
🔸 Requisitos previos
> Node.js 20+
> Angular CLI 19+
> Backend WebApi_OnOff_ToDoList en ejecución (https://localhost:7266)

🔸 Instalación
1. Instalar dependencias:
```
npm install
```

2. (Opcional) Si ocurre un error de dependencias o compilación:
```
npm cache clean --force
npm install
```

3. Ejecutar el proyecto:
````
ng serve --proxy-config proxy.conf.json
````

4. Abrir en navegador:
````
http://localhost:4200
````

