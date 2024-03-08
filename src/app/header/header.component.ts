import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false;
  private authListenerSubs: Subscription = new Subscription;

  fName: string | undefined;
  email: string | undefined;

  constructor( private authService: AuthService){}


  ngOnInit(): void {
      this.userIsAuthenticated =  this.authService.getIsAuth();
      this.authListenerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
        if(isAuthenticated){
          this.authService.getUserDetails().subscribe(userDetails => {
            this.fName = userDetails.fName;
            this.email = userDetails.email;
          },
          error =>{
            console.log(error);
          });
        }
      });
      this.authService.autoAuthUser();
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
      this.authListenerSubs.unsubscribe();
  }



}
