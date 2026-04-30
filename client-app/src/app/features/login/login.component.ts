import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Event, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoginMode = true;

  // Form Groups
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
  ) {}

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

  // Swaps the view between Login and Signup
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
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
    console.log(this.loginForm.valid)
  }

  // Handle Signup Submission
  onSignup() {
    if (this.signupForm.valid) {
      console.log('Creating account...', this.signupForm.value);
      // Integrate your Auth Service here
    }
  }
}
