# Proyecto TFG - Gestión de Tareas

Este proyecto es una aplicación web moderna desarrollada con Next.js y TypeScript para la gestión de tareas y proyectos. La aplicación implementa un sistema de gestión de tareas tipo Kanban con funcionalidades de autenticación y gestión de usuarios.

## Características Principales

- Sistema de autenticación (login/registro)
- Gestión de tareas con vista Kanban
- Creación y edición de tareas
- Sistema de etiquetas para categorización
- Interfaz de usuario moderna y responsive
- Gestión de ajustes de usuario
- Calendario integrado para visualización de tareas

## Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- React
- Node.js
- React Big Calendar
- date-fns

## Dependencias Principales

```json
{
  "dependencies": {
    "date-fns": "^4.1.0",
    "react-big-calendar": "^1.18.0"
  },
  "devDependencies": {
    "@types/react-big-calendar": "^1.16.2"
  }
}
```

## Estructura del Proyecto

```
tfg/
├── trabajo2/
│   ├── mi-app/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── about/
│   │   │   │   ├── ajustes/
│   │   │   │   ├── first/
│   │   │   │   ├── kanban/
│   │   │   │   ├── list/
│   │   │   │   ├── login/
│   │   │   │   ├── new/
│   │   │   │   ├── register/
│   │   │   │   ├── tarea/
│   │   │   │   ├── globals.css
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── components/
│   │   │       ├── etiqueta_alta.tsx
│   │   │       ├── etiqueta_completa.tsx
│   │   │       ├── etiqueta_larga.tsx
│   │   │       ├── header.tsx
│   │   │       ├── tarea_crear.tsx
│   │   │       ├── tarea_previa.tsx
│   │   │       └── tarea_vista1.tsx
│   │   ├── public/
│   │   ├── .next/
│   │   ├── node_modules/
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   └── postcss.config.mjs
│   └── README.md
└── package.json
```

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Uso

La aplicación estará disponible en `http://localhost:3000`

## Características de los Componentes

- **Header**: Componente de navegación principal
- **Tarea**: Componentes para la gestión de tareas
  - tarea_crear: Formulario de creación de tareas
  - tarea_previa: Vista previa de tareas
  - tarea_vista1: Vista detallada de tareas
- **Etiquetas**: Sistema de etiquetas para categorización
  - etiqueta_alta: Etiquetas de prioridad alta
  - etiqueta_completa: Etiquetas completas
  - etiqueta_larga: Etiquetas con descripción larga
- **Calendario**: Visualización de tareas en formato calendario

## Contribución

Para contribuir al proyecto, por favor sigue estos pasos:

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 
