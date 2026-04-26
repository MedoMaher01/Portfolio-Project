## Overview

A modern, fully responsive portfolio website built from scratch using HTML5, CSS3, and vanilla JavaScript. The site showcases projects, personal background, and a professional journey in a clean static deployment.

## Static Content Architecture

The portfolio uses a database-free content workflow designed for GitHub Pages:

- `data.json` stores project metadata only.
- `/projects/*.md` stores full project writeups.
- `data.js` loads the JSON metadata at runtime.
- `render.js` fetches each Markdown file only when the matching project detail page is opened.
- `dashboard.html` exports both the updated JSON metadata and the matching Markdown files.

## Features

- Responsive landing page, projects page, timeline page, and project detail page.
- Dynamic project cards grouped by category.
- Markdown-based project detail content.
- Client-side dashboard for editing metadata and project writeups.
- No database, server, or build step required.

## Security Notes

Markdown is parsed in the browser with `marked` and sanitized before being inserted into the page. Project Markdown paths are restricted to local files inside `/projects`, so the site does not fetch arbitrary external content.

## Deployment

The project remains fully static and works on GitHub Pages. Updating content is a file-based workflow:

1. Edit or add a project in the dashboard.
2. Export the generated `data.json` content.
3. Export the generated Markdown file for the project.
4. Commit the JSON and Markdown files to the repository.
