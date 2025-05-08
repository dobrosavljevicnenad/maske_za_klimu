import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskaDetailComponent } from './maska-detail.component';

describe('MaskaDetailComponent', () => {
  let component: MaskaDetailComponent;
  let fixture: ComponentFixture<MaskaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaskaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaskaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
