# Sistema de domótica

El siguiente proyecto es el componente Web app full stack con Ionic como frontend del trabajo práctico final para la carrera de Especialización en Internet de las Cosas, FIUBA. El proyecto consta de 3 componentes, el presente para el servidor, el ubicado [aquí](https://github.com/javifanelli/embebido_luz-proyecto) para el control de dimmer de luz y el ubicado [aquí] para el control de temperatura (https://github.com/javifanelli/embebido_temp-proyecto).

El trabajo está realizado en el entorno Docker y está hecho a partir del repositorio nombrado más abajo.

Realizado por César Javier Fanelli.

## Pasos preliminares para correr la aplicación
### Instalación de Docker
Remover todos los paquetes que pueden causar conflictos

*for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done*

Luego instalar Docker

*# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/raspbian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg*
*# Set up Docker's APT repository:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/raspbian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update*

Hacer Docker que sea "sudo"

*sudo groupadd docker
sudo usermod -aG docker $USER*

Fuentes:
https://docs.docker.com/engine/install/raspberry-pi-os/
https://docs.docker.com/engine/install/linux-postinstall/

### Instalación y configuración de GitHub
Instalar Git
*sudo apt-get install git gh*
Configurar cuenta de Github. Asignar usuario
*git config --global user.name "javifanelli"
git config --global user.email "javifanelli@gmail.com"*
Clonar el repositorio
*sudo git clone https://github.com/javifanelli/web-domotica*

Fuentes:
https://linuxize.com/post/how-to-install-git-on-raspberry-pi/
https://docs.github.com/en/get-started/quickstart/set-up-git

### Instalación de nvm y nodejs:
*sudo apt install nodejs
sudo apt install npm*
Luego deben instalarse los complementos de Angular e Ionic en el editor de código que se utilice para poder hacer andar el proyecto (en este caso se utilizó Visual Studio Code). 
*sudo npm install -g @angular/cli*, *sudo npm install -g @ionic/cli* y *sudo npm install @angular/core@15.0.0*

*sudo npm install express*

*npm install -g npm@9.7.1*

- Si los datos no llegaran a ostrarse correctamente debe borrarse primero la carpeta *data* dentro de *db* para purgar los datos grabados anteriormente.

## Siguientes pasos - Correr la aplicación
Una vez cargados los complementos, se debe correr el comando *docker compose up --build* solamente la primera vez en una consola nueva. Luego, solo con correr *docker compose up -d* es suficiente para correr la aplicacion. Por un navegador, en una pestaña nueva se debe ingresar a la dirección *http://localhost:8100/*, donde aparecerá la página de logueo. Ahí se deben ingresar los datos: "javier" para el campo *Username* y "ceiot" para *Password*. Luego, hacer click en *Login*. Ya se puede empezar a navegar por la aplicación.

![Alt text](src/frontend/dam/src/assets/img/login-page.png?raw=true "Página de Login")

Para bajar la aplicación, se debe apretar la combinación de teclas *ctrl+c*. Notar que si se hacen cambios en el Backend se debe reiniciar el contenedor o bajar la aplicación y luego volver a levantarla con *docker compose up*.

Para abrir cada dispositivo, sólo hay que hacer click en el ID que se desee visualizar.

### Solución de problemas
En caso de que al momento de correr el proyecto con *docker compose up --build* por primera vez, el módulo node-backend arrojara un errorProyecto basado ene debe correr el comando *sudo rm -r data*) y volver a correr el contenedor con *dcoker compose up --build*.

En caso de querer ver la medición de un sensor con el gŕafico y que este no se muestre al entrar a la página de uno de ellos, debe refrescarse dicha página una vez seleccionado el dispositivo, ya que tiene un refresco automático de 20 segundos.

### Enlaces útiles
Proyecto basado en [Web App Full Stack Base](https://github.com/PedroRosito/dam-docker) para la materia Desarrollo de aplicaciones multiplataforma.
