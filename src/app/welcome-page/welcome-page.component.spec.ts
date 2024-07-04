import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeViewComponent } from './welcome-page.component';

describe('WelcomeViewComponent', () => {
  let component: WelcomeViewComponent;
  let fixture: ComponentFixture<WelcomeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});