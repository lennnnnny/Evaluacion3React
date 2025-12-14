# Aplicación Expo  Lista de Tareas

Esta es una aplicación desarrollada con [Expo](https://expo.dev) y usa enrutamiento basado en archivos (`expo-router`).

## Comenzar (rápido)

1. Instalar dependencias

```bash
npm install
```

2. Iniciar la aplicación

```bash
npx expo start
```

En la salida verás opciones para abrir la app en:

- un build de desarrollo
- emulador Android
- simulador iOS
- Expo Go

Puedes comenzar a desarrollar editando los archivos dentro del directorio `app/`.
# iniciar en modo desarrollo
npx expo start

# iniciar con cache limpia (útil si recibes errores de bundling)
npx expo start -c

# reinstalar dependencias
```

## Reescribir proyecto de ejemplo
Si quieres recuperar el proyecto inicial de ejemplo ejecuta:

```bash
npm run reset-project
```
Este comando moverá el código inicial a la carpeta `app-example` y creará un directorio `app` vacío.

## Estructura y rutas principales

La aplicación usa `expo-router` con una estructura basada en archivos dentro de `app/`.

- `app/login.tsx`  pantalla de inicio de sesión.
- `app/(tabs)/tasks.tsx`  listado y CRUD de tareas.
- `components/`  componentes reutilizables (UI y contextos).

## Autores

Proyecto desarrollado por:

- Lenny Rodríguez  Desarrollo de funcionalidades, integración con backend y autenticación.
- Claudio Escobar  Implementación Login utilizando backend 

Ambos autores colaboraron en la arquitectura, las decisiones de diseño y la depuración.

## Uso de IA

Durante el desarrollo se contó con asistencia de IA para apoyo en:

- generación y revisión de código,
- propuestas de mejoras visuales y de UX,
- depuración y diagnóstico de errores,
- redacción y actualización de documentación.

Las sugerencias automáticas fueron revisadas y validadas por los autores; las decisiones finales, la integración y el control de calidad fueron realizadas por Lenny Rodríguez y Claudio Escobar.

## Integración con la API

La aplicación se integra con una API externa para la gestión de tareas y autenticación. Puntos importantes:

- La URL base de la API está configurada en `constants/config.ts`.
- La autenticación usa JWT; el token se guarda en `AsyncStorage` y se envía en el header `Authorization: Bearer <token>`.
- Las tareas se obtienen/crean/actualizan/eliminan desde el backend (`/todos`).
- Las imágenes se suben mediante `POST /images` (multipart) y se eliminan con `DELETE /images/:key`.

## Errores comunes y soluciones rápidas

- Si obtienes errores de bundling o módulos no encontrados, limpia el cache e reinicia Metro:

```bash
npx expo start -c
```

- Si al subir imágenes obtienes `413 Payload Too Large`, la app aplica una reducción de resolución y compresión antes de subir (ver `components/ui/new-task.tsx`). Si necesitas más control, puedo añadir verificación de tamaño y compresión iterativa con `expo-file-system`.

## Licencia / Uso

Este repositorio incluye trabajo de los autores mencionados y contribuciones asistidas por IA. Usa y modifica el código según lo permita la licencia de tu organización o la que desees aplicar.

## Demostración

Video de desmotración de la app:

[Ver demo en YouTube](https://youtube.com/shorts/qPHYh726q9Q)


