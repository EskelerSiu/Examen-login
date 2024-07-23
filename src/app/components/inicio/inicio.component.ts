import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient, private router: Router) {}

  logout() {
    alert('Cierre de sesion exitoso!');
    localStorage.removeItem('user');  
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      alert('No has iniciado sesion');
      this.router.navigate(['/login']);
    }
  }

  showUserInfo(): void {
    $('#userModal').modal('show');
  }
}
