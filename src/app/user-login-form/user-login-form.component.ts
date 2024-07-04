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
  @Input() userData = { username: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

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
