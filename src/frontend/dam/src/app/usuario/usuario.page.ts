import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { Usuario } from '../interfaces/usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  userData!: Usuario;
  username!: string;
  userDataUpdated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: DispositivoService
  ) {}

  ngOnInit() {
    const usernameParam = this.route.snapshot.paramMap.get('user');
    if (usernameParam !== null) {
      this.username = usernameParam;
      this.loadUserData();
    } else {
      console.error('No se proporcionó un nombre de usuario en la URL.');
    }
  }

  loadUserData() {
    this.usuarioService.getUser(this.username).subscribe({
      next: (data: Usuario) => {
        this.userData = data;
        console.log("Datos son:", this.userData);
        console.log("Datos separados son:", this.userData.apellido, this.userData.email, this.userData.nombre, this.userData.user, this.userData.userId);
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    });
  }

  actualizarDatos() {
    if (this.userData) {
      this.userDataUpdated = true;
      this.usuarioService.updateUser(this.username, this.userData).subscribe({
        next: () => {
          console.log('Datos del usuario actualizados exitosamente');
        },
        error: (error) => {
          console.error('Error al actualizar los datos del usuario:', error);
        }
      });
    } else {
      console.error('No hay datos de usuario para actualizar');
    }
  }  

}