import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Usuario } from '../model/usuario/usuario.module';
import { Atividade } from '../model/atividade/atividade.module';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie{

  usuarios!: Table<Usuario, number>;
  atividades!: Table<Atividade, number>;

  constructor() {
    super('To-do-ListDB');
    this.version(1).stores({
      usuarios: '++id, nome, fone',
      atividades: '++id, nome, dataInicio, tipo, prioridade'
    })
   }
}
