import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * The UserRegistrationFormComponent is used for user registration.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})

/**
   * Holds the user's registration data.
   */
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { username: '', password: '', email: '', birthDate: '' };


  /**
   * Creates an instance of UserRegistrationFormComponent.
   * @param fetchApiData - Service to interact with the API.
   * @param dialogRef - Reference to the dialog opened.
   * @param snackBar - Service to show snack bar notifications.
   * @param router - Router to navigate after registration.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }
  

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
  }


  /**
   * Registers a new user by sending userData to the backend.
   */

  
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        console.log(result);
        this.snackBar.open('User registered successfully', 'OK', {
          duration: 2000
        });
      },
      (error) => {
        console.log(error);
        let errorMessage = 'Something bad happened; please try again later.';
        if (error.status === 400) {
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error; // Use the specific error message from backend
          } else {
            errorMessage = 'Username already exists. Please choose a different username.';
          }
        }
        this.snackBar.open(errorMessage, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
