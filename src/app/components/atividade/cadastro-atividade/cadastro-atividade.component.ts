import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Atividade, TipoAtividade, Prioridade } from '../../../model/atividade/atividade.module';
import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/usuario/usuario.module';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

export function dataFimValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const dataInicio = formGroup.get('dataInicio')?.value;
    const dataFim = formGroup.get('dataFim')?.value;
    if (!dataFim) {
      return null;
    }

    if (!dataInicio) {
      return null;
    }

    const inicio = new Date(dataInicio).getTime();
    const fim = new Date(dataFim).getTime();

    if (fim < inicio) {
      return { dataFimMenorQueDataInicio: true };
    }

    return null;
  };
}

@Component({ 
  standalone: true,
  selector: 'app-cadastro-atividade',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './cadastro-atividade.component.html',
  styleUrl: './cadastro-atividade.component.css'
})
export class CadastroAtividadeComponent implements OnInit{

  private fb = inject(FormBuilder);
  formAtividade = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    tipo: ['', Validators.required],
    prioridade: [Prioridade.MEDIUM, Validators.required],
    dataInicio: ['', Validators.required],
    dataFim: ['']
  }, { validators: dataFimValidator() });

  tiposAtividade = Object.values(TipoAtividade);
  tiposPrioridade = Object.values(Prioridade);
  usuarios: Usuario[] = [];
  usuariosAuxiliares: Set<number> = new Set();
  descricaoOutro = '';
  mostraCampoDescricaoOutro = false;

  AtividadeId!: number;
  atividades: Atividade[] = [];

  constructor(
    private ativiadeService: AtividadeService, 
    private usuarioService: UsuarioService,
    private route: ActivatedRoute, 
    private router: Router
  ){}
  
  ngOnInit() {
    this.carregarUsuarios();
    this.AtividadeId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.AtividadeId) {
      this.ativiadeService.getAtividadeById(this.AtividadeId).then(atividade => {
        if (atividade) {
          this.formAtividade.patchValue({
            nome: atividade.nome,
            descricao: atividade.descricao,
            tipo: atividade.tipo,
            dataInicio: atividade.dataInicio,
            dataFim: atividade.dataFim,
            prioridade: atividade.prioridade
          });
          if (atividade.tipo === TipoAtividade.OUTRO) {
            this.mostraCampoDescricaoOutro = true;
            this.descricaoOutro = atividade.descricaoOutro || '';
          }
          if (atividade.usuarioIds) {
            this.usuariosAuxiliares = new Set(atividade.usuarioIds);
          }
        }
      });
    }
  }

  carregarUsuarios() {
    this.usuarioService.getAllUsuarios().then(usuarios => {
      this.usuarios = usuarios;
    });
  }

  onTipoChange(event: any) {
    const valor = event.target.value;
    if (valor === TipoAtividade.OUTRO) {
      this.mostraCampoDescricaoOutro = true;
    } else {
      this.mostraCampoDescricaoOutro = false;
      this.descricaoOutro = '';
    }
  }

  toggleUsuario(usuarioId: number) {
    if (this.usuariosAuxiliares.has(usuarioId)) {
      this.usuariosAuxiliares.delete(usuarioId);
    } else {
      this.usuariosAuxiliares.add(usuarioId);
    }
  }

  onToggleUsuario(usuario: Usuario) {
    if (usuario.id !== undefined) {
      this.toggleUsuario(usuario.id);
    }
  }

  addAtividade() {
  const dataInicio = this.formAtividade.get('dataInicio')?.value;
    const dataFim = this.formAtividade.get('dataFim')?.value;

    if (dataFim && dataInicio) {
      const inicio = new Date(dataInicio).getTime();
      const fim = new Date(dataFim).getTime();

      if (fim < inicio) {
        Swal.fire('Erro de validação!', 'A data de fim não pode ser anterior à data de início.', 'error');
        return;
      }
    }

    if (this.formAtividade.valid) {
      const tipoFinal = this.formAtividade.value.tipo as TipoAtividade;
  const prioridadeFinal = this.formAtividade.value.prioridade as Prioridade;
      const usuarioIdsFinal = Array.from(this.usuariosAuxiliares);

      if (!this.AtividadeId) {
        const novoAtividade: Atividade = {
          nome: this.formAtividade.value.nome!,
          descricao: this.formAtividade.value.descricao!,
          tipo: tipoFinal,
          dataInicio: this.formAtividade.value.dataInicio!,
          dataFim: this.formAtividade.value.dataFim || undefined,
          descricaoOutro: tipoFinal === TipoAtividade.OUTRO ? this.descricaoOutro : undefined,
          prioridade: prioridadeFinal,
          usuarioIds: usuarioIdsFinal
        };
        this.ativiadeService.addAtividade(novoAtividade).then(() => {
          Swal.fire('Cadastro realizado!', 'A atividade foi cadastrada com sucesso.', 'success');
          this.formAtividade.reset();
          this.descricaoOutro = '';
          this.mostraCampoDescricaoOutro = false;
          this.usuariosAuxiliares.clear();
        });
      } else {
        const atividadeEditada: Atividade = {
          id: this.AtividadeId,
          nome: this.formAtividade.value.nome!,
          descricao: this.formAtividade.value.descricao!,
          tipo: tipoFinal,
          dataInicio: this.formAtividade.value.dataInicio!,
          dataFim: this.formAtividade.value.dataFim || undefined,
          descricaoOutro: tipoFinal === TipoAtividade.OUTRO ? this.descricaoOutro : undefined,
          prioridade: prioridadeFinal,
          usuarioIds: usuarioIdsFinal
        };
        this.ativiadeService.updateAtividade(atividadeEditada).then(() => {
          Swal.fire('Atualizado!', 'A atividade foi atualizada com sucesso.', 'success');
          this.router.navigate(['/atividade/listar-atividade']);
        });
      }
    }
  }
}
