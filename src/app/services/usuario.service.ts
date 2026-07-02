import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Usuario } from '../model/usuario/usuario.module';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private dbService: DbService) { }

  async addUsuario(usuario: Usuario){
    return this.dbService.usuarios.add(usuario);
  }
  async updateUsuario(usuario: Usuario) {
    return this.dbService.usuarios.put(usuario);
  }
  async getUsuarioById(id: number): Promise<Usuario | undefined>{
    return await this.dbService.usuarios.get(id);
  }
  async getAllUsuarios(): Promise<Usuario[]>{
    return this.dbService.usuarios.toArray();
  }
  async deleteUsuario(id: number): Promise<void>{
    return await this.dbService.usuarios.delete(id);
  }

}
