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
    if (!genre) {
      console.error('Genre name is undefined or null.');
      return;
    }
    
    this.fetchApiData.getOneGenre(genre).subscribe((resp: any) => {
      const genreInfo = resp; // Assuming response contains genre information
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
      console.log('Director data:', resp);
      const director = resp[0]?.director || {}; // Adjust based on actual response structure
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
