import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/**
   * Base URL of the API.
   */
const apiUrl = 'https://testingmovieapi-l6tp.onrender.com/';



/**
 * Injectable service for fetching data from the API.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {


  /**
   * Constructs a new FetchApiDataService with the HttpClient injected.
   * @param http - The injected HttpClient.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userDetails - The details of the user to be registered.
   * @returns An observable with the registration response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param userDetails - The user credentials.
   * @returns An observable with the login response.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all movies.
   * @returns An observable with all movies.
   */
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

  
    /**
   * Extracts response data from HTTP response.
   * @param res - The HTTP response.
   * @returns Extracted response data.
   */  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Retrieves details of a specific movie.
   * @param title - The title of the movie.
   * @returns An observable with the movie details.
   */
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

  /**
   * Retrieves details of a specific director.
   * @param directorName - The name of the director.
   * @returns An observable with the director details.
   */
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


  /**
   * Retrieves details of a specific genre.
   * @param genreName - The name of the genre.
   * @returns An observable with the genre details.
   */
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

  /**
   * Retrieves details of a specific genre.
   * @param genreName - The name of the genre.
   * @returns An observable with the genre details.
   */
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

  /**
   * Retrieves favorite movies of a user.
   * @param username - The username of the user.
   * @returns An observable with the user's favorite movies.
   */
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

  /**
   * Adds a movie to a user's favorite movies.
   * @param movieName - The name of the movie to be added.
   * @param userName - The username of the user.
   * @returns An observable with the response after adding the movie to favorites.
   */
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

  /**
   * Updates user details.
   * @param updatedUser - The updated user object.
   * @returns An observable with the updated user details.
   */
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

  /**
   * Deletes a user.
   * @returns An observable with the response after deleting the user.
   */
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

  /**
   * Deletes a movie from a user's favorite movies.
   * @param movieName - The name of the movie to be removed.
   * @param userName - The username of the user.
   * @returns An observable with the response after deleting the movie from favorites.
   */
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


  /**
   * Handles HTTP errors.
   * @param error - The HTTP error response.
   * @returns An observable with an error message.
   */
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
