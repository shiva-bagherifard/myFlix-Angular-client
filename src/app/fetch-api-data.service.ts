import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://testingmovieapi-l6tp.onrender.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // api call to get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // api call to get one movie endpoint
  getOneMovie(title: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // API call to get one director endpoint
  getOneDirector(directorName: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const encodedDirectorName = encodeURIComponent(directorName);
    return this.http.get(`${apiUrl}movies/director/${encodedDirectorName}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  // API call to get one genre by name
  getOneGenre(genreName: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.get(apiUrl + `movies/genres/${encodeURIComponent(genreName)}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api call to get the user profile endpoint
  public getUser(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api call to get favorite movies of a user endpoint
  getFavoriteMovies(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.favoriteMovies),
      catchError(this.handleError)
    );
  }

  // api call to add a movie to favorite Movies endpoint
  addFavoriteMovie(movieName: string, username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.post(apiUrl + `users/${username}/movies/${movieName}`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api call to edit user endpoint
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.put(apiUrl + 'users/' + user.username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api call to delete user endpoint
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.delete(apiUrl + 'users/' + user.username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Making the api call for the delete a movie from the favorite movies endpoint
  deleteFavoriteMovie(movieName: string, username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('user')).token;
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
