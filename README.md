# Taller - Registro de Trabajos

Aplicación web para registrar los trabajos realizados en el taller. Cada operario puede reportar sus tareas completadas mediante un formulario.

## Columnas de la tabla

| Campo | Descripción |
|-------|-------------|
| Trabajo | Descripción del trabajo realizado |
| Código | Código identificativo del trabajo |
| Vehículo | Matrícula o modelo del vehículo |
| Tiempo | Tiempo empleado en el trabajo |
| Observaciones | Notas adicionales (opcional) |

## Tecnologías

- **Next.js 15** (App Router, TypeScript)
- **Neon PostgreSQL** (base de datos serverless)
- **Tailwind CSS** (estilos)
- **Vercel** (despliegue)

## Configuración

1. Crea una base de datos en [Neon](https://console.neon.tech)
2. Copia `.env.example` a `.env.local` y configura `DATABASE_URL`
3. Ejecuta `npm install`
4. Ejecuta `npm run dev`
5. Visita `http://localhost:3000` y haz un POST a `/api/setup` para crear las tablas:
   ```bash
   curl -X POST http://localhost:3000/api/setup
   ```

## Despliegue en Vercel

1. Conecta el repositorio en [Vercel](https://vercel.com)
2. Añade la variable de entorno `DATABASE_URL` con la conexión de Neon
3. Despliega
4. Ejecuta el setup de la base de datos:
   ```bash
   curl -X POST https://tu-dominio.vercel.app/api/setup
   ```
