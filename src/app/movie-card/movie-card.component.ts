import { Component, OnInit, Input } from '@angular/core';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() isFromFav: boolean = false;

  movies: any[] = [];
  favoriteMovies: any[] = [];
  user: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getMovies();
  }

  getUserData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user.username).subscribe((resp: any) => {
      this.user = resp;
      this.favoriteMovies = this.user.FavoriteMovies || [];
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      if (this.isFromFav) this.getFavouriteMovies();
      return this.movies;
    });
  }

  getFavorites(): void {
    this.fetchApiData.getUser(this.user.username).subscribe((resp: any) => {
      this.favoriteMovies = resp.FavoriteMovies || [];
    });
  }

  getFavouriteMovies(): void {
    this.movies = this.movies.filter(movie => this.isFavorite(movie));
  }

  isFavorite(movie: any): boolean {
    return this.favoriteMovies.includes(movie._id);
  }

  toggleFavorite(movie: any): void {
    if (this.isFavorite(movie)) {
      this.fetchApiData.removeFavoriteMovie(movie._id).subscribe(() => {
        this.snackBar.open(`${movie.title} removed from favorites`, 'OK', { duration: 2000 });
        this.favoriteMovies = this.favoriteMovies.filter((id: string) => id !== movie._id);
        if (this.isFromFav) this.getFavouriteMovies(); // Update favorite movies if viewing only favorites
      });
    } else {
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe(() => {
        this.snackBar.open(`${movie.title} added to favorites`, 'OK', { duration: 2000 });
        this.favoriteMovies.push(movie._id);
        if (this.isFromFav) this.getFavouriteMovies(); // Update favorite movies if viewing only favorites
      });
    }
  }

  openGenreDialog(genre: string): void {
    if (!genre) {
      console.error('Genre name is undefined or null.');
      return;
    }

    this.fetchApiData.getOneGenre(genre).subscribe((resp: any) => {
      const genreInfo = resp;
      this.dialog.open(GenreInfoComponent, {
        data: {
          name: genreInfo.name,
          description: genreInfo.description
        },
        width: '500px'
      });
    });
  }

  openDirectorDialog(directorName: string): void {
    this.fetchApiData.getOneDirector(directorName).subscribe((resp: any) => {
      const director = resp[0]?.director || {};
      this.dialog.open(DirectorInfoComponent, {
        data: {
          name: director.name || directorName,
          bio: director.bio || 'No bio available',
        },
        width: '500px'
      });
    });
  }

  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        title: movieName,
        description: description
      },
      width: '500px'
    });
  }
}
