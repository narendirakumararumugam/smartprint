import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Event, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { KeyFeature } from '../../../models/key-feature';
import { keyFeatures } from '../../../config/key-features';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  keyFeatures: KeyFeature[] = keyFeatures;

  // Form Groups
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms() {
    // Login Form Initialization
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });

    // Signup Form Initialization
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Handle Login Submission
  onSubmit() {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value).subscribe({
        next: (data: any) => {
          this._router.navigateByUrl('/');
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
  }

  goToSignup(event: any): void{
    event.preventDefault();
    this._authService.setIsLoginMode(false);
  }
}
