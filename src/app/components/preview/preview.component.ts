import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeData } from '../resume-data.model';
import { ResumeService } from '../resume.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy{

  creatorId : any;
  resumes: any[] = [];
  userIsAuthenticated = false;
  resumePreview!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private resumeService: ResumeService, private authService: AuthService, private router: Router){}

 public openPDF(resumeIndex: number): void {
  console.log("Function called for resume index: ", resumeIndex);
  let DATA: any = document.getElementById('htmlData-' + resumeIndex);
  console.log("HTML element retrieved: ", DATA);
  html2canvas(DATA, { scale: 2 }).then((canvas) => {
    let fileWidth = 208;
    let fileHeight = (canvas.height * fileWidth) / canvas.width;
    const FILEURI = canvas.toDataURL('image/png');
    let PDF = new jsPDF('p', 'mm', 'a4', true);
    let position = 0;
    PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

    const resume = this.resumes[resumeIndex];
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = resume.imagePath;

    image.onload = () => {
      const imgWidth = 40;
      let imgHeight = (image.height * imgWidth) / image.width;
      let imgX = (PDF.internal.pageSize.width - imgWidth) / 2; 
      let imgY = 6; 

      if(resumeIndex === 0){
        imgY = 10;
        imgX = 5;
      }else{
         imgX = (PDF.internal.pageSize.width - imgWidth) / 2; 
         imgY = 6; 
      }

      // Draw the circular image on the PDF
      PDF.clip(); // Start a new clipping path
      PDF.circle(imgX + imgWidth / 2, imgY + imgHeight / 2, imgWidth / 2); // Create a circular clipping path
      PDF.addImage(image, imgX, imgY, imgWidth, imgHeight); // Draw the image within the clipping path

      PDF.save(`${resume.fName}.pdf`);
      }
    });

  }


  ngOnInit(): void {
    
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(!this.userIsAuthenticated){
     this.router.navigate(['/login']);
    }
      
     this.creatorId = this.authService.getUserId();
     this.resumeService.getResume(this.creatorId).subscribe((data: any) =>{
      this.resumes = data.resumeData;
     });

  }

  

  ngOnDestroy(): void {
     
  }


}
