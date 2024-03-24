import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeTestComponent } from './cube-test.component';

describe('CubeTestComponent', () => {
  let component: CubeTestComponent;
  let fixture: ComponentFixture<CubeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CubeTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CubeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
