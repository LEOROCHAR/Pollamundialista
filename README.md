# PollaMundialista (Mundial FIFA 2026)

Aplicación web para organizar **pollas mundialistas** (quinielas) del Mundial FIFA 2026: grupos con código, predicciones antes del kickoff, reglas de puntuación configurables, tablas por grupo y global, calendario (API simulada) y panel de administración.

> Este repo trae un **MVP funcional** (con datos simulados del calendario 2026) listo para evolucionar a datos oficiales cuando exista una API pública.

## Funcionalidades (MVP implementado)

- **Usuarios**: registro con email+contraseña, login, Google OAuth (opcional).
- **Grupos**: crear y unirse con **código único**.
- **Partidos**: calendario seed (API simulada), listado y detalle.
- **Predicciones**: marcador exacto (home/away) **bloqueado al inicio del partido**.
- **Puntuación**:
  - Base: acierto de ganador/empate vs. marcador exacto (editable).
  - **Bonus por fase** (JSON editable).
  - Re-cálculo desde panel admin.
- **Tablas**: por grupo y global (según predicciones ya puntuadas).
- **Admin**: edición de resultados/estado del partido + reglas de puntuación.
- **Notificaciones (stubs)**: endpoints para registrar push y enviar prueba (email/push) si se configuran credenciales.

## Stack

- **Frontend/Backend**: Next.js (App Router) + TypeScript + Tailwind
- **Auth**: NextAuth (credentials + Google)
- **DB**: Prisma + SQLite (dev)

## Cómo correrlo localmente

Desde la raíz del repo:

```bash
cd web
cp .env.example .env
npm install
npm run db:migrate   # crea DB + tablas
npm run dev
```

Luego abre `http://localhost:3000`.

### Crear un admin

1) Regístrate en la UI  
2) Marca tu usuario como admin:

```bash
cd web
npm run user:make-admin -- tu-email@ejemplo.com
```

Luego entra a `http://localhost:3000/admin`.

## Calendario Mundial 2026

Por ahora se usa un **calendario simulado** (seed) en `web/prisma/seed.ts`. La idea es reemplazarlo por:

- **Datos públicos** (cuando exista una API oficial o fuente confiable), o
- Una integración con una API de terceros (manteniendo el mismo modelo `Match`).

## Notificaciones

Hay endpoints para:

- Registrar push: `POST /api/notifications/push/subscribe`
- Enviar prueba: `POST /api/notifications/test` con `{ "channel": "email" | "push" }`

Para habilitar:

- **Email**: define `SMTP_URL` y `EMAIL_FROM` en `.env`
- **Push**: define `WEB_PUSH_PUBLIC_KEY` y `WEB_PUSH_PRIVATE_KEY`

## Próximos pasos recomendados (diseño)

- **Puntuación avanzada**: bonus por rondas, multiplicadores, “comodines”, desempates.
- **Tiempo real**: SSE/WebSockets para standings live.
- **Scheduler**: jobs (cron) para cerrar predicciones, puntuar al finalizar partido, disparar notificaciones.
- **Roles por grupo**: moderadores, expulsar miembros, reset de grupo.
- **Internacionalización**: ES/EN, zonas horarias.

