Web app full stack con Ionic como frontend
==========================================
## Desarrollo de Aplicaciones para Internet de las cosas - TP final
Trabajo práctico final para la materia Desarrollo de aplicaciones Aplicaciones para Internet de las cosas de la especialización de IoT, FIUBA. Realizado por César Javier Fanelli.
El trabajo está realizado en el entorno Docker y está hecho a partir del repositorio nombrado más abajo, cumpliendo los requerimientos del enunciado.

### Pasos preliminares para correr la aplicación
Primero hay que instalar docker en el servidor con los comandos:
*curl -sSL https://get.docker.com | sh*
Luego instalar nodejs:
*curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -*
*sudo apt-get install -y nodejs*
Luego deben instalarse los complementos de Angular e Ionic en el editor de código que se utilice para poder hacer andar el proyecto (en este caso se utilizó Visual Studio Code). 
*sudo npm install -g @angular/cli*, *sudo npm install -g @ionic/cli* y *sudo npm install @angular/core*

Se debe correr además *sudo npm install --save highcharts* para poder hacer funcionar el gráfico.


### Siguientes pasos - Correr la aplicación
Una vez cargados los complementos, se debe correr el comando *docker compose up --build* solamente la primera vez en una consola nueva. Luego, solo con correr *docker compose up -d* es suficiente para correr la aplicacion. Por un navegador, en una pestaña nueva se debe ingresar a la dirección *http://localhost:8100/*, donde aparecerá la página de logueo. Ahí se deben ingresar los datos: "javier" para el campo *Username* y "ceiot" para *Password*. Luego, hacer click en *Login*. Ya se puede empezar a navegar por la aplicación.

![Alt text](src/frontend/dam/src/assets/img/login-page.png?raw=true "Página de Login")

Para bajar la aplicación, se debe apretar la combinación de teclas *ctrl+c*. Notar que si se hacen cambios en el Backend se debe reiniciar el contenedor o bajar la aplicación y luego volver a levantarla con *docker compose up*.

Para abrir cada dispositivo, sólo hay que hacer click en el ID que se desee visualizar.


### Solución de problemas
En caso de que al momento de correr el proyecto con *docker compose up --build* por primera vez, el módulo node-backend arrojara un error, se debe abrir una consola y dirigirse a la carpeta "src/backend" y correr el comando *npm install*.

En caso de no poder ver la base de datos actualizada, primero se debe bajar el contenedor con *docker compose down* o con las teclas *ctrl+c*. Luego se debe borrar la carpeta "data" dentro de "db" con permisos de administrador (en Linux se debe correr el comando *sudo rm -r data*) y volver a correr el contenedor con *dcoker compose up --build*.

En caso de querer ver la medición de un sensor con el gŕafico y que este no se muestre al entrar a la página de uno de ellos, debe refrescarse dicha página una vez seleccionado el dispositivo, ya que tiene un refresco automático de 20 segundos.

## Proyecto basado en

[Web App Full Stack Base](https://github.com/PedroRosito/dam-docker)