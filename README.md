<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar el proyecto
2. Copiar el `.env.template` y renombrar a `.env`
3. Llenar variables de entorno
4. Ejecutar el siguiente comando para crear el JWT_SECRET: 
```
openssl rand -hex 32
```

5. Ejecutar

```
npm install
```

6. Levantar la imagen de docker (Tener Docker desktop instalado y ejecutadose) con el siguiente comando

```
docker-compose up -d
```

7. Levantar backend

```
npm run start:dev
```

8. Visitar el sitio

```
localhost:3000/graphql
```
