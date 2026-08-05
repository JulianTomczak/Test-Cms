# Mi CMS

Sitio de blog construido con [Next.js](https://nextjs.org) (App Router), React y TypeScript. Los artículos se escriben en Markdown con frontmatter y pueden almacenarse localmente en `content/posts` o publicarse en un repositorio de GitHub a través de la interfaz de administración.

## Stack

- **Next.js 16** (App Router) con TypeScript
- **React 19**
- **Tailwind CSS 4**
- **gray-matter** — parsing de frontmatter en Markdown
- **react-markdown** — renderizado de Markdown
- **@octokit/rest** — integración con la API de GitHub
- **Yarn 4** como gestor de paquetes

## Estructura del proyecto

```
├── app/                          # Aplicación (App Router)
│   ├── admin/
│   │   └── page.tsx              # Panel de administración (cliente): crear posts y probar conexión
│   ├── api/
│   │   └── admin/
│   │       └── posts/
│   │           └── route.ts      # API: GET (conexión + listar) y POST (crear post)
│   ├── components/
│   │   └── Navbar.tsx            # Barra de navegación (Home / Admin)
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx          # Vista de un post (Markdown renderizado)
│   ├── globals.css               # Estilos globales (Tailwind)
│   ├── layout.tsx                # Layout raíz
│   └── page.tsx                  # Home: listado de posts
├── content/
│   └── posts/                    # Posts en Markdown (slug.md)
├── lib/
│   ├── posts.ts                  # Lectura local de posts (fs + gray-matter)
│   └── github/
│       ├── client.ts             # Cliente Octokit singleton
│       └── posts.ts              # Conexión, listado y creación de posts en GitHub
├── public/                       # Assets estáticos
├── .env.local                    # Variables de entorno (ver abajo)
├── next.config.ts
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

## Variables de entorno

Copia el archivo `.env.local` con la siguiente configuración:

```
GITHUB_TOKEN=<tu token de GitHub>
GITHUB_OWNER=<usuario o organización dueña del repo>
GITHUB_REPO=<nombre del repositorio>
```

## Getting Started

```bash
yarn install
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador.

- **`/`** — listado de posts publicados.
- **`/posts/[slug]`** — detalle de un post.
- **`/admin`** — panel para probar la conexión con GitHub, listar los posts remotos y crear/ publicar nuevos posts en el repositorio.

## Scripts

| Comando        | Descripción                     |
| -------------- | ------------------------------- |
| `yarn dev`     | Servidor de desarrollo          |
| `yarn build`   | Build de producción             |
| `yarn start`   | Servidor de producción          |
| `yarn lint`    | Ejecuta ESLint                  |

## Formato de un post

Los posts son archivos Markdown con frontmatter en `content/posts/<slug>.md`:

```markdown
---
title: Mi artículo
slug: mi-articulo
description: Una breve descripción
date: 2026-01-01
published: true
---

Contenido del post en Markdown.
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
