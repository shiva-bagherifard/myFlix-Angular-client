import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = {
    username: '',
    password: '',
    email: '',
    birthDate: '',
  };
  formUserData: any = {
    username: '',
    password: '',
    email: '',
  };

  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];
  _id: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile(); // Call getProfile() during component initialization
  }

  public getProfile(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user);
  
    this.fetchApiData.getUser(user.username).subscribe((result: any) => {
      console.log('User profile data:', result);
      this.user = result;
  
      if (this.user.FavoriteMovies && this.user.FavoriteMovies.length > 0) {
        console.log('User favorite movies IDs:', this.user.FavoriteMovies);
        this._id = this.user.FavoriteMovies;
  
        // Fetch all movies and filter for favorite movies
        this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
          console.log('All movies:', movies);
          this.favoriteMovies = movies.filter((movie: any) =>
            this._id.includes(movie._id)
          );
          console.log('Favorite movies:', this.favoriteMovies); // Logging favorite movies for verification
        }, (error) => {
          console.error('Error fetching movies:', error);
        });
      } else {
        console.log('User has no favorite movies.');
        this.favoriteMovies = [];
      }
  
      this.userData.username = user.username;
      this.userData.email = user.email;
      
      console.log(this.userData)
      this.formUserData = { ...this.userData };
      this.formUserData.password = this.user.password;
    }, (error) => {
      console.error('Error fetching user profile:', error);
    });
  }
  
  updateUser(): void {
    let formData = this.formUserData;
    formData.birthDate = this.userData.birthDate;
    console.log(this.formUserData);

    this.fetchApiData.editUser(formData).subscribe((result) => {
      console.log(result);
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User information successfully updated!', 'OK', {
        duration: 2000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Profile has been successfully deleted!', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe(() => {
        localStorage.clear();
      });
    }
  }
}
