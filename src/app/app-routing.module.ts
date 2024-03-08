import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { TemplateComponent } from './components/template/template.component';
import { ResumeBuilderComponent } from './components/resume-builder/resume-builder.component';
import { PreviewComponent } from './components/preview/preview.component';
import { ProfileComponent } from './auth/profile/profile.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'template', component: TemplateComponent},
  {path: 'resume-builder', component: ResumeBuilderComponent},
  {path: 'preview', component: PreviewComponent},
  {path: 'profile', component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
