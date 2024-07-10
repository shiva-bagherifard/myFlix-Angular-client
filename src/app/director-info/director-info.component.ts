import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss']
})
export class DirectorInfoComponent {


  /**
   * Creates an instance of DirectorInfoComponent.
   * @param dialogRef - Angular Material dialog reference.
   * @param data - Data injected into the dialog.
   *               Contains director's name, bio, birth date, and death date.
   */
  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, bio: string }
  ) { }



  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
