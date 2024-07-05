import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss']
})
export class DirectorInfoComponent {

  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, bio: string }
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
