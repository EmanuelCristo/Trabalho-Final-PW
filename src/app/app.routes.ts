import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroUsuarioComponent } from './components/usuario/cadastro-usuario/cadastro-usuario.component';
import { ListarUsuarioComponent } from './components/usuario/listar-usuario/listar-usuario.component';
import { CadastroAtividadeComponent } from './components/atividade/cadastro-atividade/cadastro-atividade.component';
import { ListarAtividadeComponent } from './components/atividade/listar-atividade/listar-atividade.component';
import { ListarAtividadeUsuarioComponent } from './components/atividade/listar-atividade-usuario/listar-atividade-usuario.component';
import { ListarAtividadeCategoriaComponent } from './components/atividade/listar-atividade-categoria/listar-atividade-categoria.component';
import { ToDoListComponent } from './components/lista/to-do-list/to-do-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'usuario/cadastro-usuario', component: CadastroUsuarioComponent},
    { path: 'usuario/listar-usuario', component: ListarUsuarioComponent},
    { path: 'atividade/cadastro-atividade', component: CadastroAtividadeComponent},
    { path: 'atividade/listar-atividade', component: ListarAtividadeComponent},
    { path: 'atividade/listar-atividade-usuario', component: ListarAtividadeUsuarioComponent},
    { path: 'atividade/listar-atividade-categoria', component: ListarAtividadeCategoriaComponent},
    { path: 'usuario/editar-usuario/:id', component: CadastroUsuarioComponent},
    { path: 'atividade/editar-atividade/:id', component: CadastroAtividadeComponent},
    { path: 'lista/to-do-list', component: ToDoListComponent},
];
