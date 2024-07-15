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
  
      if (this.user.favoriteMovies && this.user.favoriteMovies.length > 0) {
        console.log('User favorite movies IDs:', this.user.favoriteMovies);
        this._id = this.user.favoriteMovies;
  
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
  
      this.userData.username = this.user.username;
      this.userData.email = this.user.email;
      if (this.user.birthday) {
        let Birthday = new Date(this.user.birthday);
        if (!isNaN(Birthday.getTime())) {
          this.userData.birthDate = Birthday.toISOString().split('T')[0];
        }
      }
      this.formUserData = { ...this.userData };
      this.formUserData.password = this.user.password;
    }, (error) => {
      console.error('Error fetching user profile:', error);
    });
  }
  
  

  async updateUser(): Promise<void> {
    let formData = this.formUserData;
    formData.birthDate = this.user.birthday.slice(0, 10);
    console.log(formData);
    this.fetchApiData.editUser(formData).subscribe(
      (result: any) => {
        console.log('User update success:', result);
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 2000,
        });
        this.getProfile(); // Refresh profile data after update
      },
      (error) => {
        console.log('Error updating user:', error);
        this.snackBar.open('Failed to update user: ' + error, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  async deleteUser(): Promise<void> {
    console.log('deleteUser function called:', this.user.username);
    this.fetchApiData.deleteUser().subscribe(
      (response: any) => {
        localStorage.clear();
        this.snackBar.open('User deleted successfully!', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['welcome']);
      },
      (error) => {
        console.log('Error deleting user:', error);
        this.snackBar.open('Failed to delete user: ' + error, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
