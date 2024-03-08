import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Subscription, from } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from 'src/app/error/error.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  userIsAuthenticated = false;
  fName: string | undefined;

  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog){}

  ngOnInit(): void {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authService.getUserDetails().subscribe(userDetails =>{
        this.fName = userDetails.fName;
      }, error =>{
        console.log("user is not logged in");
        
      });
  }

  isSmallScreen(): boolean{
    return this.breakpointObserver.isMatched([Breakpoints.Small]);
  }

}
