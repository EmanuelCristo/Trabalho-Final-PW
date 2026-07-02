import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAtividadeComponent } from './listar-atividade.component';

describe('ListarAtividadeComponent', () => {
  let component: ListarAtividadeComponent;
  let fixture: ComponentFixture<ListarAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAtividadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
