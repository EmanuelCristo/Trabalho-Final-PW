import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Atividade } from '../../../model/atividade/atividade.module';
import { Usuario } from '../../../model/usuario/usuario.module';
import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-listar-atividade',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './listar-atividade.component.html',
  styleUrl: './listar-atividade.component.css'
})
export class ListarAtividadeComponent implements OnInit {
  public atividades: Atividade[] = [];
  public usuarios: Usuario[] = [];

  constructor(
    private atividadeService: AtividadeService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
    this.getAllAtividades();
  }

  carregarUsuarios() {
    this.usuarioService.getAllUsuarios().then(usuarios => {
      this.usuarios = usuarios;
    });
  }

  getAllAtividades() {
    this.atividadeService.getAllAtividades().then(atividades => {
      this.atividades = atividades;
    });
  }

  getNomeUsuarios(usuarioIds: number[]): string {
    if (!usuarioIds || usuarioIds.length === 0) return 'Sem usuários';
    const nomes = usuarioIds.map(id =>
      this.usuarios.find(u => u.id === id)?.nome
    ).join(', ');
    return nomes;
  }

  editAtividade(id?: number) {
    if (id) {
      this.router.navigate(['/atividade/editar-atividade', id]);
    }
  }

  deleteAtividade(id?: number) {
    if (!id) return;
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.atividadeService.deleteAtividade(id).then(() => {
          this.getAllAtividades();
        });
        Swal.fire('Excluído!', 'A atividade foi excluída com sucesso.', 'success');
      }
    });
  }
}
