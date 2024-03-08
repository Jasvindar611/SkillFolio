import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {NgFor} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResumeService } from '../resume.service';
import { mimeType } from './mime-type.validator';
import { ResumeData } from '../resume-data.model';

export interface Skills {
  name: string;
}

@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css'],
})
export class ResumeBuilderComponent implements OnInit{

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skills: Skills[] = [{name: 'HTML'}, {name: 'JAVA'}, {name: 'C++'}]

  isUserAuthenticated = false;
  form!: FormGroup;
  imagePreview!: string;
  resumeData : ResumeData;
  creatorId : any;
  resumes: any[] = [];


  constructor(private authService: AuthService, private router: Router, private elementRef: ElementRef, private resumeService: ResumeService){}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuth();
    if(this.isUserAuthenticated === false){
     this.router.navigate(["/login"]);
    }

    this.creatorId = this.authService.getUserId();
    this.resumeService.getResume(this.creatorId).subscribe((data: any) =>{
      this.resumes = data.resumeData;
      if(Array.isArray(this.resumes) && this.resumes.length > 0){
        this.router.navigate(['/preview']);
      }else{
        console.log("there is no resume");
        
      }
    });


      
      this.form = new FormGroup({
        'fName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        'lName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
        'mob': new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(12)]}),
        'dob': new FormControl(null, {validators: [Validators.required]}),
        'address': new FormControl(null, {validators: [Validators.required, Validators.minLength(10)]}),
        'education1': new FormControl(null, {validators: [Validators.required]}),
        'college': new FormControl(null, {validators: [Validators.required]}),
        'startYear': new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)]}),
        'endYear': new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)]}),
        'skills': new FormControl(null, {validators: [Validators.required]}),
        'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
      })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(){
    if (this.form.invalid) {
      return;
    }else{
      this.resumeService.createResume(
        this.form.value.fName,
        this.form.value.lName,
        this.form.value.email,
        this.form.value.mob,
        this.form.value.dob,
        this.form.value.address,
        this.form.value.education1,
        this.form.value.college,
        this.form.value.startYear,
        this.form.value.endYear,
        this.form.value.skills,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  // onSubmit(form: NgForm){
  //   if(form.invalid){
  //     return;
  //   }
  //   else if(this.isUserAuthenticated === true){
  //     this.resumeService.createResume(
  //       form.value.fName, 
  //       form.value.lName, 
  //       form.value.email, 
  //       form.value.mob, 
  //       form.value.dob, 
  //       form.value.address,
  //       form.value.education1,
  //       form.value.college,
  //       form.value.startYear,
  //       form.value.endYear,
  //       form.value.skills
  //       );
  //   }
  //   else{
  //     this.router.navigate(['/login']);
  //   }
  // }

  openEDU3(){
  const eduBox = this.elementRef.nativeElement.querySelector('.education3');
    eduBox.classList.toggle('open');
  }


// Chips//////////////////
  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.skills.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(skills: Skills): void {
    const index = this.skills.indexOf(skills);

    if (index >= 0) {
      this.skills.splice(index, 1);

      this.announcer.announce(`Removed ${skills}`);
    }
  }

  edit(skills: Skills, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(skills);
      return;
    }

    // Edit existing fruit
    const index = this.skills.indexOf(skills);
    if (index >= 0) {
      this.skills[index].name = value;
    }
  }
//////////////////////

}


