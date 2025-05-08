import { Component, OnInit } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: any[] = [];

  editingColorIndex: number | null = null;
  newColorValue: string = '';

  constructor(private maskaService: MaskaService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartProducts = this.maskaService.getCartProducts();
  }

  addToCart(productId: number, boja: string) {
    this.maskaService.addToCart(productId, boja, 1);
    this.loadCart();
  }

  removeFromCart(productId: number, boja: string) {
    this.maskaService.removeFromCart(productId, boja);
    this.loadCart();
  }

  deleteFromCart(productId: number, boja: string) {
    this.maskaService.deleteFromCart(productId, boja);
    this.loadCart();
  }

  updateCart(productId: number, kolicina: number, boja: string) {
    if (kolicina < 1) {
      this.deleteFromCart(productId, boja);
    } else {
      this.maskaService.updateQuantity(productId, boja, kolicina);
      this.loadCart();
    }
  }

  getTotalPrice() {
    return this.maskaService.getTotalPrice();
  }

  getDiscountPrice(product: any):any {
    console.log(product.boja);
    return (product.cena - (product.cena * product.popust) / 100).toFixed(0);
  }

  startEditingColor(index: number, currentColor: string) {
    this.editingColorIndex = index;
    this.newColorValue = currentColor;
  }

  changeColor(index: number, novaBoja: string) {
    const product = this.cartProducts[index];
    if (!novaBoja.trim()) return;

    // Ukloni stari
    this.maskaService.deleteFromCart(product.id, product.boja);
    // Dodaj novi sa novom bojom i istom količinom
    this.maskaService.addToCart(product.id, novaBoja.trim(), product.kolicina);

    // Resetuj UI
    this.editingColorIndex = null;
    this.newColorValue = '';
    this.loadCart();
  }

}
