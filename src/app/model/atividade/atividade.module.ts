export enum TipoAtividade {
  ESTUDO = 'Estudo',
  TRABALHO = 'Trabalho',
  LAZER = 'Lazer',
  PESQUISA = 'Pesquisa',
  OUTRO = 'Outro'
}

export enum Prioridade {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Urgente'
}

export class Atividade {
  id?: number;
  nome: string;
  descricao: string;
  tipo: TipoAtividade;
  dataInicio: string;
  dataFim?: string;
  descricaoOutro?: string;
  prioridade: Prioridade;
  usuarioIds: number[];
  status?: string;

  constructor(nome: string, descricao: string, tipo: TipoAtividade, dataInicio: string, dataFim?: string, descricaoOutro?: string, prioridade: Prioridade = Prioridade.MEDIUM, usuarioIds: number[] = [], status?: string) {
      this.nome = nome;
      this.descricao = descricao;
      this.tipo = tipo;
      this.dataInicio = dataInicio;
      this.dataFim = dataFim;
      this.descricaoOutro = descricaoOutro;
      this.prioridade = prioridade;
      this.usuarioIds = usuarioIds;
      this.status = status;
  }
}