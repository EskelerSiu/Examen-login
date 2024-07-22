import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.http.get('https://api.escuelajs.co/api/v1/users/1').subscribe((data: any) => {
      this.user = data;
    });
  }

  showUserInfo(): void {
    $('#userModal').modal('show');
  }
}
