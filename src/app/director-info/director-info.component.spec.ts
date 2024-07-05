import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DirectorInfoComponent } from './director-info.component';

describe('DirectorInfoComponent', () => {
  let component: DirectorInfoComponent;
  let fixture: ComponentFixture<DirectorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectorInfoComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test Director', bio: 'Test Biography' } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
