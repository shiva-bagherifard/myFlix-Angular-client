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
  genre: any = '';
  director: any = '';
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getFavorites();
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      if (this.isFromFav) this.getFavouriteMovies();
      return this.movies;
    });
  }

  getFavouriteMovies(): void {
    this.movies = this.movies.filter(({ title }) => this.favoriteMovies.includes(title));
  }

  getFavorites(): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.favoriteMovies = parsedUser.favoriteMovies;
    }
  }

  openGenreDialog(genre: string): void {
    this.fetchApiData.getOneGenre(genre).subscribe((resp: any) => {
      this.genre = resp;
      this.dialog.open(GenreInfoComponent, {
        data: {
          name: this.genre,
          description: this.genre.description
        },
        width: '500px'
      });
    });
  }

  openDirectorDialog(directorName: string): void {
    this.fetchApiData.getOneDirector(directorName).subscribe((resp: any) => {
      this.director = resp;
      this.dialog.open(DirectorInfoComponent, {
        data: {
          name: this.director.name,
          bio: this.director.bio,
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

  isFav(movie: any): boolean {
    return this.favoriteMovies.includes(movie.title);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite ? this.deleteFavMovies(movie) : this.addFavMovies(movie);
  }

  addFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.addFavoriteMovie(movie.title, parsedUser.username).subscribe((resp: any) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this.favoriteMovies.push(movie.title);
        this.snackBar.open(`${movie.title} has been added to your favorites`, 'OK', {
          duration: 3000
        });
      });
    }
  }

  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.deleteFavoriteMovie(movie.title, parsedUser.username).subscribe((resp) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this.favoriteMovies = this.favoriteMovies.filter(title => title !== movie.title);
        this.snackBar.open(`${movie.title} has been removed from your favorites`, 'OK', {
          duration: 3000
        });
      });
    }
  }
}
