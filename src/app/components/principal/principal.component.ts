import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  ropas: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalRopas: number = 0;
  pagedRopas: any[] = [];
  selectedRopa: any = null;
  updateForm: FormGroup;
  addForm: FormGroup;
  user: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRopasFromApi();
    this.getUserInfo();
  }

  loadRopasFromApi(): void {
    this.http.get('https://fakestoreapi.com/products')
      .subscribe((data: any) => {
        this.ropas = data;
        this.saveRopasToLocalStorage();
        this.getRopas(this.currentPage);
      });
  }
  
  loadRopasFromLocalStorage(): void {
    const storedRopas = localStorage.getItem('ropas');
    if (storedRopas) {
      this.ropas = JSON.parse(storedRopas);
      this.totalRopas = this.ropas.length;
      this.getRopas(this.currentPage);
    }
  }

  saveRopasToLocalStorage(): void {
    localStorage.setItem('ropas', JSON.stringify(this.ropas));
  }

  logout() {
    alert('Cierre de sesión exitoso!');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getUserInfo(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
  }

  showUserInfo(): void {
    $('#userModal').modal('show');
  }

  getRopas(page: number = 1): void {
    const offset = (page - 1) * this.pageSize;
    this.pagedRopas = this.ropas.slice(offset, offset + this.pageSize);
    this.totalRopas = this.ropas.length;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getRopas(this.currentPage);
  }
  
  showDetails(ropa: any): void {
    this.selectedRopa = ropa;
    $('#ropaModal').modal('show');
  }

  deleteRopa(ropa: any): void {
    const confirmed = confirm(`¿Estás seguro de que deseas eliminar ${ropa.title}?`);
    if (confirmed) {
      this.ropas = this.ropas.filter(r => r.id !== ropa.id);
      this.saveRopasToLocalStorage();
      alert('Producto eliminado con éxito');
      this.getRopas(this.currentPage);
    }
  }

  showUpdateForm(ropa: any): void {
    this.selectedRopa = ropa;
    this.updateForm.patchValue({
      title: ropa.title,
      price: ropa.price,
      description: ropa.description,
      category: ropa.category,
      image: ropa.image
    });
    $('#updateModal').modal('show');
  }

  updateRopa(): void {
    if (this.updateForm.valid) {
      const updatedRopa = this.updateForm.value;
      const index = this.ropas.findIndex(r => r.id === this.selectedRopa.id);
      if (index !== -1) {
        this.ropas[index] = { ...this.selectedRopa, ...updatedRopa };
        this.saveRopasToLocalStorage();
        alert('Producto actualizado con éxito');
        this.getRopas(this.currentPage);
        $('#updateModal').modal('hide');
      }
    }
  }

  showAddForm(): void {
    this.addForm.reset();
    $('#addModal').modal('show');
  }

  addRopa(): void {
    if (this.addForm.valid) {
      const newRopa = this.addForm.value;
      newRopa.id = Date.now(); // Assign a unique ID based on the current timestamp
      this.ropas.push(newRopa);
      this.saveRopasToLocalStorage();
      alert('Producto agregado con éxito');
      this.getRopas(this.currentPage);
      $('#addModal').modal('hide');
    }
  }
}
