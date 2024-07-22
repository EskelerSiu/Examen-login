import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.http.get('https://api.escuelajs.co/api/v1/users')
        .subscribe((users: any) => {
          const user = users.find((u: any) => u.email === email && u.password === password);
          if (user) {
            alert('Login Successful');
            localStorage.setItem('user', JSON.stringify(user)); 
            this.router.navigate(['/dashboard']);
          } else {
            alert('Invalid Credentials');
          }
        });
    }
  }
}
