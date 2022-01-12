import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseAngularMaterialComponent } from './use-angular-material.component';

describe('UseAngularMaterialComponent', () => {
  let component: UseAngularMaterialComponent;
  let fixture: ComponentFixture<UseAngularMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseAngularMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseAngularMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
