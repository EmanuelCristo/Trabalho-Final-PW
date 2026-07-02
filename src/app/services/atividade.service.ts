import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Atividade, TipoAtividade } from '../model/atividade/atividade.module';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {

  constructor(private dbService: DbService) { }

  addAtividade(atividade: Atividade){
    return this.dbService.atividades.add(atividade)
  }

  updateAtividade(atividade: Atividade){
    return this.dbService.atividades.put(atividade);
  }

  getAllAtividades(): Promise<Atividade[]> {
    return this.dbService.atividades.toArray();
  }

  getAtividadeById(id: number) {
    return this.dbService.atividades.get(id);
  }

  getAtividadesByCategoria(categoria: TipoAtividade): Promise<Atividade[]> {
    return this.dbService.atividades.where('tipo').equals(categoria).toArray();
  }

  getAtividadesByUsuario(usuarioId: number): Promise<Atividade[]> {
    return this.dbService.atividades.toArray().then(atividades => 
      atividades.filter(a => a.usuarioIds && a.usuarioIds.includes(usuarioId))
    );
  }

    deleteAtividade(id: number) {
      return this.dbService.atividades.delete(id);
    }

}
