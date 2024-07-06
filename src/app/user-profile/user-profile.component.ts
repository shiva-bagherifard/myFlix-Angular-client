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
    this.getProfile();
  }

  public getProfile(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user.username).subscribe((result: any) => {
      console.log(result);
      this.user = result;
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
      this._id = this.user.favoriteMovies;

      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoriteMovies = movies.filter((movie: any) =>
          this._id.includes(movie._id)
        );
      });
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
        this.getProfile();
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
