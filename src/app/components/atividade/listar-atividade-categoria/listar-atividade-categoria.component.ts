import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Atividade, TipoAtividade } from '../../../model/atividade/atividade.module';
import { Usuario } from '../../../model/usuario/usuario.module';
import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-listar-atividade-categoria',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './listar-atividade-categoria.component.html',
  styleUrl: './listar-atividade-categoria.component.css'
})
export class ListarAtividadeCategoriaComponent implements OnInit {
  public atividades: Atividade[] = [];
  public usuarios: Usuario[] = [];
  public tiposAtividade = Object.values(TipoAtividade);
  public categoriaSelecionada: TipoAtividade | null = null;
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

  onCategoriaChange(event: any) {
    const categoria = event.target.value;
    if (categoria) {
      this.categoriaSelecionada = categoria as TipoAtividade;
      this.filtrarAtividadesPorCategoria(categoria);
    } else {
      this.categoriaSelecionada = null;
      this.atividadeFiltradas = [];
    }
  }

  filtrarAtividadesPorCategoria(categoria: TipoAtividade) {
    this.atividadeService.getAtividadesByCategoria(categoria).then(atividades => {
      this.atividadeFiltradas = atividades;
    });
  }

  getNomeUsuarios(usuarioIds: number[]): string {
    if (!usuarioIds || usuarioIds.length === 0) return 'Sem usuários';
    const nomes = usuarioIds.map(id => 
      this.usuarios.find(u => u.id === id)?.nome || `ID: ${id}`
    ).join(', ');
    return nomes;
  }
}
