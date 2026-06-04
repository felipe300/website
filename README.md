# Portafolio

Check the [website](https://felipe300.github.io/website/)

![Deploy Status](https://github.com/felipe300/website/actions/workflows/deploy.yml/badge.svg)

**Languages**:

- Bash
- Lua
- Javascript
- Typescript

**Frameworks**:

- Astrojs
- NextJS
- NodeJs
- ReactJS

**Stack**:

- Ansible
- AWS
- Docker
- Nginx
- CI/CD (GitHub Actions)
- Minikube (Kubernetes)
- Terraform

## Automatización y Despliegue (CI/CD)

Este portafolio cuenta con un pipeline de Integración y Despliegue Continuos (CI/CD) automatizado a través de **GitHub Actions**. Cada vez que se realiza un cambio en la rama `main`, el flujo ejecuta las siguientes etapas:

1. **Calidad de Código:** Analiza el código con `oxlint`, valida la estructura HTML y verifica que no existan enlaces rotos.
2. **Despliegue Web:** Compila los archivos estáticos optimizados con **Bun** y los despliega automáticamente en **GitHub Pages**.
3. **Contenerización:** Reutiliza el build optimizado, lo empaqueta dentro de una imagen ligera de **Docker** (utilizando Nginx como servidor web de producción) y lo publica en **Docker Hub**.

## Probar localmente con Docker

Si deseas clonar y ejecutar este portafolio en tu entorno local de forma inmediata sin necesidad de configurar dependencias, puedes descargar y correr el contenedor de Docker directamente desde mi registro público:

```bash
# Descargar y ejecutar el contenedor en el puerto 8080
docker run -d -p 8080:80 pipodev/portfolio:latest
```

Una vez ejecutado, abre tu navegador e ingresa a: `http://localhost:8080`
