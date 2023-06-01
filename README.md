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

Para abrir cada dispositivo, sólo hay que hacer click en el ID que se desee visualizar.

### Desafíos realizados
* Se creó un pipe custom para que se muestre la presión equivalente en kg además de KPa en el gráfico original.
![Alt text](src/frontend/dam/src/assets/img/disp-pipe.png?raw=true "Conversión de presión")

* Se usó además un pipe estándar de Angular para convertir la fecha de las mediciones a un formato legible y más fácil de leer.

* Se implementó una directiva para que se altere el contenido de la celda del ID del dispositivo cuando se pasa el mouse por encima.

### Notas
* Se modificaron algunos valores que estaban en el dump de las tablas, como el nombre de los sensores y las fechas de medición.
* Se corrigió (parcialmente) el error de que el dispositivo sense más de 100 kPA.

### Solución de problemas
En caso de que al momento de correr el proyecto con *docker compose up --build* por primera vez, el módulo node-backend arrojara un error, se debe abrir una consola y dirigirse a la carpeta "src/backend" y correr el comando *npm install*.

En caso de no poder ver la base de datos actualizada, primero se debe bajar el contenedor con *docker compose down* o con las teclas *ctrl+c*. Luego se debe borrar la carpeta "data" dentro de "db" con permisos de administrador (en Linux se debe correr el comando *sudo rm -r data*) y volver a correr el contenedor con *dcoker compose up --build*.

En caso de querer ver la medición de un sensor con el gŕafico y que este no se muestre al entrar a la página de uno de ellos, debe refrescarse dicha página una vez seleccionado el dispositivo, ya que tiene un refresco automático de 20 segundos.

## Proyecto basado en

[Web App Full Stack Base](https://github.com/PedroRosito/dam-docker)