import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { response } from "express";
import { Subject, Subscription, tap} from "rxjs";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable({providedIn: "root"})
export class AuthService{

    private isAuthenticated = false;
    private token: any;
    private tokenTimer!: NodeJS.Timer;
    private userId: any;
    private authStatusListner = new Subject<boolean>();
    fName: string;
    userDetailsFetched: boolean;
    userIsLoggedOut: boolean;
    userFailedLogin: boolean;


    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getUserId(){
        return this.userId;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListner(){
        return this.authStatusListner.asObservable();
    }

    getUserDetails(){
        const headers = new HttpHeaders({
            Authorization: "Bearer " + this.token
        });
        return this.http.get<any>("http://localhost:3000/api/user/details", { headers });
    }


    createUser(fName: string,lName: string, email:string, gender:string, dob:string,image: File, password:string){
        const authData = new FormData();
        authData.append("fName", fName),
        authData.append("lName", lName),
        authData.append("email", email),
        authData.append("gender", gender),
        authData.append("dob", dob),
        authData.append("image", image),
        authData.append("password", password),
        this.http.post("http://localhost:3000/api/user/signup", authData)
        .subscribe(() =>{
            Swal.fire('Success!', 'User created successfully!', 'success').then(() =>{
                this.router.navigate(['/login']);
            });
        }, error =>{
            this.authStatusListner.next(false);
            
        });
        // const authData: AuthData = {fName: fName,lName: lName, email:email, gender:gender, dob:dob, password:password};
        // this.http.post("http://localhost:3000/api/user/signup", authData)
        // .subscribe(() =>{
        //     Swal.fire('Success!', 'User created successfully!', 'success').then(() =>{
        //         this.router.navigate(['/login']);
        //     })

        // }, error =>{
        //     this.authStatusListner.next(false);
        // })
    }

    login(email: string, password: string){
        const authData: AuthData = {
            email: email, password: password,
            fName: "",
            lName:"",
            gender: "",
            dob: "",
            imagePath: ""
        };
        this.http.post<{ token: string; expiresIn: number; userId: string }>
        ("http://localhost:3000/api/user/login", authData).subscribe(response =>{
            const token = response.token;
            this.token = token;
            if(token){
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListner.next(true);
                const now = new Date();
                const exirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(exirationDate);
                this.saveAuthData(token, exirationDate, this.userId);
                this.getUserDetails().subscribe(userDetails =>{
                    this.fName = userDetails.fName;
                    this.userDetailsFetched = true;
                    this.showLoginSuccessAlert();
                })

                this.router.navigate(["/"]);
            }
        }, error =>{
            this.authStatusListner.next(false);
        });
    }

    private showLoginSuccessAlert(){
        if(this.userDetailsFetched){
            Swal.fire({
              title: `Login Successfull`,
              text: 'You are Logged In Successfully!',
              icon: 'success',
            });
        }
    }


    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.exirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListner.next(true);
        }
    }


    logout(){
        this.getUserDetails().subscribe(userDetails =>{
            this.fName = userDetails.fName;
            this.userIsLoggedOut = true;
            this.showLogoutAlert();
        })
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListner.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/home"]);
    }
    private showLogoutAlert(){
        if(this.userIsLoggedOut){
            const styledTitle = `<span style="color: #FF0000; font-weight:bold;">${this.fName}!</span>`;
            Swal.fire({
              title: `${styledTitle}`,
              text: 'You are LoggedOut!',
              icon: 'success',
            });
        }
    }

    private setAuthTimer(duration: number){
        console.log("setting timer:" + duration);
        this.tokenTimer = setTimeout(() =>{
            this.logout();
        }, duration * 1000);   
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const exirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if(!token || !exirationDate){
            return;
        }
        return{
            token: token,
            exirationDate: new Date(exirationDate),
            userId: userId
        };
    }

}