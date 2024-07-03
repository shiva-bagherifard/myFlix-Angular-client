// src/app/fetch-api-data.service.ts
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://testingmovieapi-l6tp.onrender.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) { }

  userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login?' + new URLSearchParams(userDetails), {}).pipe(
      catchError(this.handleError)
    );
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders({Authorization: 'Bearer ' + token})}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/directors/' + directorName, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.favoriteMovies),
      catchError(this.handleError)
    );
  }

  addFavoriteMovie(movieName: string, username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + `users/${username}/movies/${movieName}`, {}, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.username, updatedUser, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.username, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteFavoriteMovie(movieName: string, username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieName, {
      headers: new HttpHeaders({Authorization: 'Bearer ' + token})
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
