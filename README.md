# ProyectoTD

## Descripción del proyecto

Este repositorio contiene el código fuente de un proyecto que busca desarrollar una plataforma web de autopromoción profesional, en la que trabajadores puedan crear perfiles detallados con su experiencia, certificaciones y habilidades. A diferencia de los portales de empleo tradicionales, esta plataforma permite que los clientes busquen trabajadores según sus necesidades específicas y dejen valoraciones sobre sus servicios, brindando mayor visibilidad y credibilidad a los trabajadores.

## Arquitectura del proyecto

La arquitectura del proyecto está dividida en dos partes principales: el backend y el frontend. El backend se encarga de la lógica del servidor, la autenticación y la conexión con la base de datos, mientras que el frontend se ocupa de la interfaz de usuario y la interacción con el servidor.

A continuación se presenta la estructura esquemática del proyecto (podría cambiar ligeramente a medida que se avanza en el desarrollo):

### Backend
```plaintext
├── backend
│   ├── src
│   │   ├── auth
│   │   │   └── passport.auth.js
│   │   ├── config
│   │   │   ├── .env.example
│   │   │   ├── configDb.js
│   │   │   ├── configEnv.js
│   │   │   └── initialSetup.js
│   │   ├── controllers
│   │   │   ├── auth.controller.js
│   │   │   └── user.controller.js
│   │   ├── entity
│   │   │   └── user.entity.js
│   │   ├── handlers
│   │   │   └── responseHandlers.js
│   │   ├── helpers
│   │   │   └── bcrypt.helper.js
│   │   ├── middlewares
│   │   │   ├── authentication.middleware.js
│   │   │   └── authorization.middleware.js
│   │   ├── routes
│   │   ├── services
│   │   ├── validations
│   │   └── index.js
│   ├── .gitignore
│   ├── .prettierrc.json
│   ├── .eslintrc.config.js
│   ├── package-lock.json
│   └── package.json
```
### Frontend
```plaintext
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── helpers
│   │   ├── hooks
│   │   │   ├── auth
│   │   │   └── users
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   ├── index.css
│   ├── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── .eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
└── └── vite.config.js
```

## Tecnologías a utilizar

<table>
    <thead>
        <tr>
            <th>Categoría</th>
            <th>Tecnologías</th>
            <th>Uso</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Backend</td>
            <td>Node.js, Express, MySQL, TypeORM, Passport.js, JWT, bcryptjs, Joi, dotenv</td>
            <td>Desarrollo de la lógica del servidor, autenticación, validaciones y conexión con la base de datos</td>
        </tr>
        <tr>
            <td>Frontend</td>
            <td>React, React DOM, Vite, Axios, React Router Dom, SweetAlert2</td>
            <td>Construcción de la interfaz de usuario y manejo de la interacción con el servidor</td>
        </tr>
        <tr>
            <td>Base de datos</td>
            <td>MySQL</td>
            <td>Almacenamiento y gestión de datos</td>
        </tr>
        <tr>
            <td>Herramientas de desarrollo</td>
            <td>ESLint, Prettier, Nodemon, Morgan</td>
            <td>Mejora de la calidad del código y administración del entorno de desarrollo</td>
        </tr>
        <tr>
            <td>Control de versiones</td>
            <td>Git, GitHub</td>
            <td>Gestión del código fuente y colaboración en equipo</td>
        </tr>
        <tr>
            <td>Entorno de desarrollo</td>
            <td>Visual Studio Code</td>
            <td>Edición y depuración del código</td>
        </tr>
        <tr>
            <td>Sistema de gestión de paquetes</td>
            <td>npm</td>
            <td>Instalación y gestión de dependencias</td>
        </tr>
        <tr>
            <td>Sistema operativo</td>
            <td>Windows (local), Linux (producción)</td>
            <td>Entorno de desarrollo local y despliegue en producción</td>
        </tr>
    </tbody>
</table>
