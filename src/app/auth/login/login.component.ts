import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/Services/auth.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  captchaError: string = ''; // Field-level error message for CAPTCHA
  myToken: any = '';
  userName: string = '';
  role: any = '';
  captchaUrl: string = '';
  generatedCaptcha: string = '';

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required],
      captchaInput: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.generatedCaptcha = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 200;
    canvas.height = 50;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(this.generatedCaptcha, canvas.width / 2, canvas.height / 2);

    this.captchaUrl = canvas.toDataURL();
  }

  verifyCaptcha(inputCaptcha: string): boolean {
    return inputCaptcha === this.generatedCaptcha;
  }

  refreshCaptcha(): void {
    this.generateCaptcha();
  }

  onSubmit() {
    const captcha = this.loginForm.get('captchaInput')?.value;

    // Validate CAPTCHA
    if (!this.verifyCaptcha(captcha)) {
      // this.captchaError = 'Invalid CAPTCHA. Please try again.';
      // this.snackbar.open('Invalid CAPTCHA. Please try again.', 'Close', {
      //   duration: 3000,
      //   panelClass: ['error-snackbar'],
      // });
      alert('Invalid CAPTCHA. Please try again.');
      this.refreshCaptcha();
      return; // Halt form submission
    } else {
      this.captchaError = ''; // Clear CAPTCHA error
    }

    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      this.auth.login(formData.userName, formData.password).subscribe({
        next: (response) => {
          this.successMessage = 'Login successful!';
          this.errorMessage = '';

          this.myToken = response.headers.get('Jwt');
          localStorage.setItem('token', this.myToken);
          localStorage.setItem('userName', this.loginForm.get('userName')?.value!);

          this.role = response.body;

          if (this.role.roleName === 3) {
            this.router.navigateByUrl('/customer');
          } else if (this.role.roleName === 0) {
            this.router.navigateByUrl('/admin');
          } else if (this.role.roleName === 1) {
            this.router.navigateByUrl('/employee');
          } else if (this.role.roleName === 2) {
            this.router.navigateByUrl('/agent');
          } else {
            this.router.navigateByUrl('/login');
            this.snackbar.open('Invalid credentials. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          alert("Invalid credentials. Please try again");
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.snackbar.open('Please fill out the form correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}

