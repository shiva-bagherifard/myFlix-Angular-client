import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {


  /**
   * Object holding user data for login
   * @property {string} username - The user's username
   * @property {string} password - The user's password
   */
  @Input() userData = { username: '', password: '' };


  /**
   * Creates an instance of UserLoginFormComponent.
   * @param fetchApiData - API data fetching service.
   * @param dialogRef - Angular Material dialog reference.
   * @param snackBar - Angular Material snackbar service.
   * @param router - Angular Router service.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}



  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}



  /**
   * Logs in the user by sending the user data to the backend.
   * On success, stores user data and token in local storage, closes the dialog, shows a success message, and navigates to the movies page.
   * On failure, shows an error message.
   */
  logInUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (res) => {
        this.dialogRef.close(); // Close the login dialog on success
        this.snackBar.open(`Login success, Welcome ${res.user.username}`, 'OK', {
          duration: 2000,
        });
        const user = {
          id: res.user._id,
          username: res.user.username,
          birthday: res.user.birthday,
          email: res.user.email,
          token: res.token,
        };
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
        this.router.navigate(['movies']); // Navigate to movies page after successful login
      },
      (error) => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again later.';
        
        if (error.status === 401) {
          errorMessage = 'Incorrect username or password. Please try again.';
        } else if (error.status === 0) {
          errorMessage = 'Connection error. Please check your internet connection.';
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error; // Use specific error message from backend if available
        }
        
        this.snackBar.open(errorMessage, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
