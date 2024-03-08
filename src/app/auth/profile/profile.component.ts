import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';
import { ResumeService } from 'src/app/components/resume.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  userData:any;
  isFlipped = false;
  resumes: any[] = [];
  creatorId: any;
  userIsAuthenticated: boolean;

  constructor(private authService: AuthService, private resumeService: ResumeService, private router: Router){}

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  ngOnInit(): void {  

    this.userIsAuthenticated = this.authService.getIsAuth();
    if(!this.userIsAuthenticated){
     this.router.navigate(['/login']);
    }

    this.authService.getUserDetails().subscribe((result) =>{
      this.userData = result;
      console.log(this.userData); 
    }); 
    
    this.creatorId = this.authService.getUserId();
    this.resumeService.getResume(this.creatorId).subscribe((data: any) =>{
      this.resumes = data.resumeData;
    })
    
  }


}
