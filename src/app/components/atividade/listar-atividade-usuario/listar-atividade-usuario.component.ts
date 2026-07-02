import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Atividade } from '../../../model/atividade/atividade.module';
import { Usuario } from '../../../model/usuario/usuario.module';
import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-listar-atividade-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './listar-atividade-usuario.component.html',
  styleUrl: './listar-atividade-usuario.component.css'
})
export class ListarAtividadeUsuarioComponent implements OnInit {
  public atividades: Atividade[] = [];
  public usuarios: Usuario[] = [];
  public usuarioSelecionado: number | null = null;
  public atividadeFiltradas: Atividade[] = [];

  constructor(
    private atividadeService: AtividadeService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.getAllUsuarios().then(usuarios => {
      this.usuarios = usuarios;
    });
  }

  onUsuarioChange(event: any) {
    const usuarioId = Number(event.target.value);
    if (usuarioId) {
      this.usuarioSelecionado = usuarioId;
      this.filtrarAtividadesPorUsuario(usuarioId);
    } else {
      this.usuarioSelecionado = null;
      this.atividadeFiltradas = [];
    }
  }

  filtrarAtividadesPorUsuario(usuarioId: number) {
    this.atividadeService.getAtividadesByUsuario(usuarioId).then(atividades => {
      this.atividadeFiltradas = atividades;
    });
  }

  getNomeUsuarioSelecionado(): string {
    if (!this.usuarioSelecionado) return '';
    const usuario = this.usuarios.find(u => u.id === this.usuarioSelecionado);
    return usuario?.nome || '';
  }
}
