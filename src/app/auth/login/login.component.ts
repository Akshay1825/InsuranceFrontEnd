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
  // adminLoginForm = new FormGroup({
  //   userName: new FormControl('', Validators['required']),
  //   password: new FormControl('', Validators['required']),
  // })
  // token: any = '';
  // jwtHelper = new JwtHelperService();
  ngOnInit(){
    this.generateCaptcha();
  }
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  myToken: any='';
  userName: string='';
  role: any='';

  captchaUrl: string = 'https://localhost:7117/api/Captcha'; 
  captchaInput: string = ''; 
  captchaResolved=false;
  captchaResponse="";
  generatedCaptcha: string = '';

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],  
      password: ['', Validators.required],
      captchaInput: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onCaptchaResolved(captchaResponse:any): void {
    this.captchaResolved = !!captchaResponse;
    this.captchaResponse=captchaResponse;
  }

  refreshCaptcha(): void {
    this.captchaUrl = 'https://localhost:7117/api/Captcha?' + new Date().getTime(); // Append timestamp to prevent caching
  }

  generateCaptcha() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.generatedCaptcha = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = 200;
    canvas.height = 50;
    
    // Set background color
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw the CAPTCHA text in the center of the canvas
    ctx.fillText(this.generatedCaptcha, canvas.width / 2, canvas.height / 2);
    
    // Convert the canvas to an image URL (base64 encoded)
    this.captchaUrl = canvas.toDataURL();
  }
  verifyCaptcha(inputCaptcha: string): boolean {
    return inputCaptcha === this.generatedCaptcha;
  }

  

  onSubmit() {
    
    const captcha = this.loginForm.get('captchaInput')?.value;
    // alert(captcha);
    if (!this.verifyCaptcha(captcha)) {
      this.snackbar.open('Invalid CAPTCHA. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.generateCaptcha();
      
    }

    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
     
      // Authenticate user
      this.authService.login(formData.userName, formData.password,formData.captchaInput).subscribe({
        
        next: (response) => {
          console.log('Login form data:', formData);
          
          this.successMessage = 'Login successful!';
          this.errorMessage = '';
  
          this.myToken = response.headers.get('Jwt'); // Retrieve token from headers
          // console.log('JWT Token:', this.myToken);
  
          localStorage.setItem('token', this.myToken); // Store JWT token locally
          localStorage.setItem("userName",this.loginForm.get('userName')?.value!)
          localStorage.setItem('password', this.loginForm.get('password')?.value!)
          this.role = response.body; // Retrieve role from body
          // console.log('Role:', this.role);
  
          if (this.role.roleName === 3) 
            {
            this.router.navigateByUrl('/customer')
            }
            else if (this.role.roleName === 0)
            {
              this.router.navigateByUrl('/admin')
            }
            else if (this.role.roleName === 1)
            {
              this.router.navigateByUrl('/employee')
            }
            else if (this.role.roleName === 2)
            {
              this.router.navigateByUrl('/agent')
            }
            else{
              this.router.navigateByUrl('/login')
              this.errorMessage = 'Invalid credentials. Please try again.';
              this.successMessage = '';
            } 
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Invalid credentials. Please try again.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.successMessage = '';
    }
  }
}
