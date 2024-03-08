import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  fName: string | undefined;
  constructor(public authService: AuthService, private breakpointObserver: BreakpointObserver){}

  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }
    this.authService.login(form.value.email, form.value.password);  
  }

  isSmallScreen(): boolean{
    return this.breakpointObserver.isMatched([Breakpoints.HandsetPortrait]);
  }


}
