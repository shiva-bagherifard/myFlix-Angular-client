import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

import { UserProfileComponent } from './user-profile.component';
import { NavbarComponent } from '../navbar/navbar.component';  // Assuming the path to navbar component
import { MovieCardComponent } from '../movie-card/movie-card.component';  // Assuming the path to movie card component

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserProfileComponent,
        NavbarComponent,
        MovieCardComponent
      ],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [DatePipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    // Mock data for userData and favoriteMovies
    component.userData = {
      username: 'JohnDoe',
      birthDate: new Date('1990-01-01').toISOString(),
      email: 'john.doe@example.com'
    };
    component.favoriteMovies = [
      { id: 1, title: 'Inception', year: 2010 },
      { id: 2, title: 'The Matrix', year: 1999 }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display favorite movies', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.favorite-movies-container')).toBeTruthy();
    const movieCards = compiled.querySelectorAll('app-movie-card');
    expect(movieCards.length).toBe(2);
    expect(movieCards[0].textContent).toContain('Inception');
    expect(movieCards[1].textContent).toContain('The Matrix');
  });
});
