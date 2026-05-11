import { Component, OnInit, signal } from '@angular/core';
import { KeyFeature } from '../../../models/key-feature';
import { keyFeatures } from '../../../config/key-features';
import { SignupComponent } from "../signup/signup.component";
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent, SignupComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit{
  keyFeatures: KeyFeature[] = keyFeatures;
  isLoginMode  = this._authService.isLoginMode;

  constructor(private _authService: AuthService){}

  ngOnInit(){
  }
}
