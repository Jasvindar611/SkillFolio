import { Injectable } from '@angular/core';
import { ResumeData } from './resume-data.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private resumes: any[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }


  createResume(
    fName: string,
    lName: string,
    email: string,
    mob: string,
    dob: string,
    address: string,
    education1: string,
    college: string,
    startYear:string,
    endYear: string,
    skills: string,
    image: File
    )
    {
      const resumeData = new FormData();
      resumeData.append("fName", fName),
      resumeData.append("lName", lName),
      resumeData.append("email", email),
      resumeData.append("mob", mob),
      resumeData.append("dob", dob),
      resumeData.append("address", address),
      resumeData.append("education1", education1),
      resumeData.append("college", college),
      resumeData.append("startYear", startYear),
      resumeData.append("endYear", endYear),
      resumeData.append("skills", skills),
      resumeData.append("image", image),
      this.http.post("http://localhost:3000/api/resume/builder", resumeData)
      .subscribe({
        next: (response) => {
          const token = this.authService.getToken();
          console.log("this is token" + token);
          this.router.navigate(['/preview']);
        },
        error: (_err)=> {
          console.log(_err);
          
        }
      });
    }

    getResume(creatorId: string): Observable<any[]> {
      return this.http.get<any[]>('http://localhost:3000/api/resume/preview/' + creatorId);
    }
}
