import { Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { AuthService } from '../auth.service';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { mimeType } from 'src/app/components/resume-builder/mime-type.validator';




@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  imagePreview!: string;
  form!: FormGroup;


    constructor(public authService: AuthService, private breakpointObserver: BreakpointObserver){}

    ngOnInit(): void {
      this.form = new FormGroup({
        'fName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        'lName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
        'gender': new FormControl(null, {validators: [Validators.required]}),
        'dob': new FormControl(null, {validators: [Validators.required]}),
        'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
        'password': new FormControl(null, {validators: [Validators.required]}),
      });
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


    onSignup(){
      if(this.form.invalid){
        return;
      }else{
        this.authService.createUser(
          this.form.value.fName,
          this.form.value.lName,
          this.form.value.email,
          this.form.value.gender,
          this.form.value.dob,
          this.form.value.image,
          this.form.value.password
          );
      }
      
    }

    isSmallScreen(): boolean{
      return this.breakpointObserver.isMatched([Breakpoints.HandsetPortrait]);
    }


}
