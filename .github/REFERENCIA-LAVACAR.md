# Referência de Padrões - PW-Lavacar

**Objetivo:** Este documento lista os padrões utilizados no PW-Lavacar para orientar **TODO** o desenvolvimento do Trabalho-Final-PW. Conforme novas funcionalidades são implementadas aqui, elas serão espelhadas no Lavacar.

## 1. Estrutura de Modelos

### Padrão: Usar Classes com Constructor
```typescript
export class Produto {
    id?: number;
    nome: string;
    preco: number;
    quantidade: number;
    fornecedorId: number;
    nomeFornecedor?: string;  // Campo auxiliar para display

    constructor(nome: string, preco: number, quantidade: number, fornecedorId: number) {
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
        this.fornecedorId = fornecedorId;
    }
}
```

**Conformidade - Seu Projeto (Atividade):** ✅ Implementado
```typescript
export class Atividade {
    id?: number;
    nome: string;
    descricao: string;
    tipo: TipoAtividade;
    dataInicio: string;
    dataFim?: string;
    descricaoOutro?: string;
    priority: Priority;
    usuarioIds: number[];
    // Próximo: adicionar nomesUsuarios?: string para display
    
    constructor(nome: string, descricao: string, tipo: TipoAtividade, dataInicio: string, ...) {...}
}
```

**Conformidade - Seu Projeto (Usuario):** ✅ Implementado

## 2. Estrutura de Services

### Padrão: Filtro usando Índice Dexie
```typescript
getProdutosByFornecedorId(fornecedorId: number): Promise<Produto[]> {
    return this.dbService.produtos.where('fornecedorId')
        .equals(fornecedorId).toArray();
}
```

**Diferença no seu projeto:**
- Sua relação é N:N (múltiplos usuários por atividade)
- Use `.filter()` local já que `usuarioIds` é array:
```typescript
async getAtividadesByUsuario(usuarioId: number): Promise<Atividade[]> {
    const todas = await this.dbService.atividades.toArray();
    return todas.filter(a => a.usuarioIds?.includes(usuarioId));
}
```

## 3. Estrutura de Components Cadastro

### Padrão: Form com Select Dropdown (1:1)
- Lavacar: `<select formControlName="fornecedorId">`
- Seu projeto: Use **checkboxes** (N:N com múltiplas seleções)

**Padrão de Handle de Click em @for Loop:**
- Envolver o @for com `(click)` na div container
- Usar `readonly` no input
- Manter `toggleUsuario()` simples

## 4. Estrutura de Components Listagem

### Padrão: Componente com Filtro por ID
```typescript
ngOnInit() {
    this.fornecedorId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProdutosByFornecedorId(this.fornecedorId);
}
```

**Aplicar em ListarAtividadeUsuario:**
- Receber `usuarioId` da rota ou select
- Exibir nome do usuário no título
- Mostrar apenas suas atividades

## 5. Template Patterns

### Padrão: Condicional com @if/@else
```html
@if(produtos.length > 0){
    <table>...</table>
} @else {
    <p>Nenhum produto encontrado.</p>
}
```

### Padrão: Loop com Track
```html
@for (produto of produtos; track produto.id) {
    <tr>...</tr>
}
```

## 6. Database Schema (Dexie)

### Padrão: Indexação com Versão
```typescript
this.version(1).stores({
    fornecedores: '++id, nome, cnpj, fone',
    produtos: '++id, nome, preco, quantidade, fornecedorId',
});
```

**Seu Schema:**
- Versão 4 já possui índices para `tipo`, `priority`, `dataInicio`
- N:N com `usuarioIds` array não precisa de índice especial
- Se adicionar filtro por usuário na DB, aumentar versão

## 7. Nomenclatura

### Padrão Lavacar
- Models: `Produto`, `Fornecedor` (classes/interfaces)
- Services: `ProdutoService`, `FornecedorService`
- Components: `CadastroProduto`, `ListarProdutos`, `ListarProdutosFornecedor`
- Methods: `getProdutosByFornecedorId()`, `getProdutoById()`, `getAllProdutos()`

### Seu Projeto (Seguindo o padrão)
- Models: `Atividade`, `Usuario` ✓
- Services: `AtividadeService`, `UsuarioService` ✓
- Components: `CadastroAtividade`, `ListarAtividade`, `ListarAtividadeUsuario`, `ListarAtividadeCategoria` ✓
- Methods: `getAtividadesByUsuario()`, `getAtividadesByCategoria()` ✓

## 8. Checklist para Novas Features

- [ ] Criar model (classe com constructor)
- [ ] Criar service com métodos CRUD + filtros
- [ ] Atualizar Dexie com novos índices se necessário
- [ ] Criar componente de cadastro com form
- [ ] Criar componente de listagem geral
- [ ] Criar componente de listagem com filtro (se N:N)
- [ ] Adicionar rotas em `app.routes.ts`
- [ ] Adicionar links de navegação em `header.component.html`
- [ ] Testar CRUD completo

## 9. Armadilhas Conhecidas

### Bug Angular 19 com Event Binding em @for
- ❌ `(change)="toggleUsuario(usuario.id)"` dentro de @for causa erro `ɵassertType`
- ✅ Solução: `(click)` na div container, `readonly` no input

### Índices Dexie
- Mudança no schema = aumentar versão
- Usuários precisam limpar IndexedDB
- Usar formato: `'++id, campo1, campo2'` (chave primária primeiro)

### N:N vs 1:1
- 1:1 (Lavacar): Usar field `fornecedorId: number`
- N:N (Seu projeto): Usar `usuarioIds: number[]`
