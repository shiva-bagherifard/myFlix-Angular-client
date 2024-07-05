import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent {
  
  // Define properties to hold dialog data
  genre: string;
  description: string;

  constructor(
    public dialogRef: MatDialogRef<GenreInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Define type for data
  ) {
    this.genre = data.name; // Assign data properties to component properties
    this.description = data.description;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
