import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../model/usuario/usuario.module';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'app-listar-usuario',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './listar-usuario.component.html',
  styleUrl: './listar-usuario.component.css'
})
export class ListarUsuarioComponent implements OnInit{
  usuarios: Usuario[]=[];

  constructor(private usuarioService: UsuarioService, private router: Router){}

  ngOnInit(): void {
    this.getAllUsuarios();
  }

  getAllUsuarios(){
    this.usuarioService.getAllUsuarios().then(usuarios =>{
      this.usuarios = usuarios;
    });
  }

  editUsuario(id: number){
    this.router.navigate(['/usuario/editar-usuario', id]);
  }

  deleteUsuario(id: number) {
    Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this.usuarioService.deleteUsuario(id).then(() => {
                this.getAllUsuarios();
            });
            Swal.fire('Excluído!', 'O Usuario foi excluído com sucesso.', 'success');
        }
    });
}


}
