
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Atividade, Prioridade } from '../../../model/atividade/atividade.module';
import { AtividadeService } from '../../../services/atividade.service';
import { Usuario } from '../../../model/usuario/usuario.module';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

type KanbanStatus = 'PENDENTE' | 'AFAZER' | 'PROGRESSO' | 'CONCLUIDO';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public usuarioSelecionado: number | null = null;
  public atividadesUsuario: Atividade[] = [];

  public pendentes: Atividade[] = [];
  public afazer: Atividade[] = [];
  public progresso: Atividade[] = [];
  public concluido: Atividade[] = [];

  constructor(
    private atividadeService: AtividadeService,
     private usuarioService: UsuarioService,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.getAllUsuarios().then(u => this.usuarios = u || []);
  }

  onUsuarioChange(event: any) {
    const id = Number(event.target.value);
    if (id) {
      this.usuarioSelecionado = id;
      this.carregarAtividadesDoUsuario(id);
    } else {
      this.usuarioSelecionado = null;
      this.limparListas();
    }
  }

  carregarAtividadesDoUsuario(usuarioId: number) {
    this.atividadeService.getAtividadesByUsuario(usuarioId).then(atividades => {
      this.atividadesUsuario = atividades || [];
      this.distribuirPorColunas();
    });
  }

  distribuirPorColunas() {
    this.limparListas();
    for (const a of this.atividadesUsuario) {
      switch (a.status) {
        case 'AFAZER':
          this.afazer.push(a);
          break;
        case 'PROGRESSO':
          this.progresso.push(a);
          break;
        case 'CONCLUIDO':
          this.concluido.push(a);
          break;
        default:
          this.pendentes.push(a);
      }
    }
  }

  limparListas() {
    this.pendentes = [];
    this.afazer = [];
    this.progresso = [];
    this.concluido = [];
  }

  onDragStart(event: DragEvent, atividadeId?: number) {
    if (!event.dataTransfer || !atividadeId) return;
    event.dataTransfer.setData('text/plain', String(atividadeId));
    event.dataTransfer.effectAllowed = 'move';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  async onDrop(event: DragEvent, status: KanbanStatus) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    const idStr = event.dataTransfer.getData('text/plain');
    const id = Number(idStr);
    if (!id) return;

    const atividade = this.atividadesUsuario.find(a => a.id === id);
    if (!atividade) return;

    const statusAnterior = (atividade.status || 'PENDENTE') as KanbanStatus;
    
    if (await this.verificarPrioridadeeMostrarAlerta(atividade, statusAnterior, status)) {
      atividade.status = status === 'PENDENTE' ? undefined : status;
      await this.atividadeService.updateAtividade(atividade);
      this.distribuirPorColunas();
    }
  }

  private async verificarPrioridadeeMostrarAlerta(atividade: Atividade, statusAnterior: KanbanStatus, novoStatus: KanbanStatus): Promise<boolean> {
    const prioridadeAtual = this.obterNumericoPrioridade(atividade.prioridade);
    const ordemStatus = { 'PENDENTE': 0, 'AFAZER': 1, 'PROGRESSO': 2, 'CONCLUIDO': 3 };
    
    const estaMovendoParaFrente = ordemStatus[novoStatus] > ordemStatus[statusAnterior];
    
    if (!estaMovendoParaFrente) {
      return true;
    }

    const atividadesStatusAnterior = this.obterAtividadesDoStatus(statusAnterior);
    const temMaiorPrioridade = atividadesStatusAnterior.some(a => 
      a.id !== atividade.id && this.obterNumericoPrioridade(a.prioridade) > prioridadeAtual
    );

    if (temMaiorPrioridade) {
      const resultado = await Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: `Tem certeza? Existe outra atividade com maior prioridade que você está deixando para trás.`,
        showCancelButton: true,
        confirmButtonText: 'Sim, mover',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ffc107'
      });
      return resultado.isConfirmed;
    }
    return true;
  }

  private obterNumericoPrioridade(prioridade: string): number {
    switch (prioridade) {
      case 'Urgente':
        return 4;
      case 'Alta':
        return 3;
      case 'Média':
        return 2;
      case 'Baixa':
        return 1;
      default:
        return 0;
    }
  }

  private obterAtividadesDoStatus(status: KanbanStatus): Atividade[] {
    switch (status) {
      case 'PENDENTE':
        return this.pendentes;
      case 'AFAZER':
        return this.afazer;
      case 'PROGRESSO':
        return this.progresso;
      case 'CONCLUIDO':
        return this.concluido;
      default:
        return [];
    }
  }

  formatAtividadeResumo(a: Atividade) {
    return `${a.nome} (${a.prioridade})`;
  }

  getNomeUsuarioSelecionado(): string {
    if (!this.usuarioSelecionado) return '';
    const u = this.usuarios.find(x => x.id === this.usuarioSelecionado);
    return u?.nome || '';
  }

  getCorPrioridade(prioridade: string): string {
    switch (prioridade) {
      case 'Baixa':
        return '#28a745';
      case 'Média':
        return '#ffc107';
      case 'Alta':
        return '#fd7e14';
      case 'Urgente':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  estaProximoDeVencer(dataFim?: string): boolean {
    if (!dataFim) return false;
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diasRestantes = Math.floor((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes >= 0 && diasRestantes <= 3;
  }

  obterClasseIndicadorVencimento(dataFim?: string): string {
    if (!dataFim) return '';
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diasRestantes = Math.floor((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) return '🔴';
    if (diasRestantes <= 1) return '🔴';
    if (diasRestantes <= 3) return '🟡';
    return '';
  }

    editarAtividade(id?: number) {
      if (id) {
        this.router.navigate(['/atividade/editar-atividade', id]);
      }
    }

    deletarAtividade(id?: number) {
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
            Swal.fire('Excluído!', 'A atividade foi excluída com sucesso.', 'success');
            if (this.usuarioSelecionado) {
              this.carregarAtividadesDoUsuario(this.usuarioSelecionado);
            }
          });
        }
      });
    }
}
