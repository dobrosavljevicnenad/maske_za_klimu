import { Component, OnInit } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  cartProducts: any[] = [];

  order: any = {
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  };

  constructor(private maskaService: MaskaService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartProducts = this.maskaService.getCartProducts();
    console.log(this.cartProducts);
  }

  getTotalPrice() {
    return this.maskaService.getTotalPrice();
  }

  // getDiscountPrice(product: any) {
  //   return product.cena - (product.cena * product.popust) / 100;
  // }

  getDiscountPrice(product: any):any {
    return (product.cena - (product.cena * product.popust) / 100).toFixed(0);
  }

  baseUrl: string = "https://klimamaske-pqoq.vercel.app/";

  submitOrder() {
      const templateParams = {
        firstName: this.order.firstName,
        lastName: this.order.lastName,
        phone: this.order.phone,
        address: this.order.address,
        cartProducts: this.cartProducts.map(product => ({
          naziv: product.naziv,
          kolicina: product.kolicina,
          boja: product.boja,
          cena: this.getDiscountPrice(product) * product.kolicina,
          // slika: product.slika[0].includes('assets')
          //   ? `${this.baseUrl}${product.slika[0]}`
          //   : product.slika[0]
          slika: `${this.baseUrl}${product.slika[0]}`
        }))
        ,
        totalPrice: this.getTotalPrice()
      };

      // console.log(JSON.stringify(templateParams, null, 2));


      emailjs.send('service_gmail', 'template_n00s0ad', templateParams, '_lXhY7X4MAMwrA-lj')
        .then((response) => {
          console.log('Email poslat!', response);
          alert('Porudžbina uspešno poslata!');
          this.router.navigate(['/confirmation']);  // Posle slanja emaila, prebaci korisnika na potvrdu
        })
        .catch((error) => {
          console.error('Greška pri slanju emaila:', error);
          alert('Došlo je do greške pri slanju emaila.');
        });
    }

  }
