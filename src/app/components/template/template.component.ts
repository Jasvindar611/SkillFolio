import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit{

  userIsAuthenticated = false;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
      this.userIsAuthenticated = this.authService.getIsAuth();
  }



}
