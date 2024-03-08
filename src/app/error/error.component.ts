import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit{


  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){}

  ngOnInit(): void {
    // this.showErrorAlert();
  }

  // private showErrorAlert() {
  //   Swal.fire({
  //     title: 'Error!',
  //     text: this.data.message,
  //     icon: 'error',
  //     customClass: {
  //       title: 'swal-custom-title', 
  //     },
  //   });
  // }

}
