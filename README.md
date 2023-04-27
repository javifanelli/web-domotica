Web app full stack con Ionic como frontend
==========================================
## Desarrollo de aplicaciones multiplataforma - TP final
Trabajo práctico final para la materia Desarrollo de aplicaciones multiplataforma de la especialización de IoT, FIUBA. Realizado por César Javier Fanelli.
El trabajo está realizado en el entorno Docker y está hecho a partir del repositorio nombrado más abajo, cumpliendo los requerimientos del enunciado.

### Pasos preliminares para correr la aplicación
Primero deben instalarse los complementos de Angular e Ionic en el editor de código que se utilice para poder hacer andar el proyecto (en este caso se utilizó Visual Studio Code). Se debe correr además *npm install --save highcharts* para poder hacer funcionar el gráfico.

### Siguientes pasos - Correr la aplicación
Una vez cargados los complementos, se debe correr el comando *docker compose up* en una consola nueva. Por un navegador, en una pestaña nueva se debe ingresar a la dirección *http://localhost:8100/*, donde aparecerá la página de logueo. Ahí se deben ingresar los datos: "javier" para el campo *Username* y "ceiot" para *Password*. Luego, hacer click en *Login*. Ya se puede empezar a navegar por la aplicación.

![Alt text](src/frontend/dam/src/assets/img/login-page.png?raw=true "Página de Login")

Para bajar la aplicación, se debe apretar la combinación de teclas *ctrl+c*. Notar que si se hacen cambios en el Backend se debe reiniciar el contenedor o bajar la aplicación y luego volver a levantarla con *docker compose up*.

### Notas
Se modificaron algunos valores que estaban en el dump de las tablas, como el nombre de los sensores y las fechas de medición.

### Solución de problemas
En caso de no poder ver la base de datos actualizada, primero se debe bajar el contenedor con *docker compose down* o con las teclas ctrl+c. Luego se debe borrar la carpeta "data" dentro de "db" con permisos de administrador (en Linux se debe correr el comando *sudo rm -r data*) y volver a correr el contenedor con *dcoker compose up --build*.

## Proyecto basado en

[Web App Full Stack Base](https://github.com/PedroRosito/dam-docker)

## Licencia 📄

Este proyecto está bajo Licencia ([MIT](https://choosealicense.com/licenses/mit/)). Podés ver el archivo [LICENSE.md](LICENSE.md) para más detalles sobre el uso de este material.
