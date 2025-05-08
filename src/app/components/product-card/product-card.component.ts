import { Component, Input, OnInit } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'] // Ispravljeno sa 'styleUrl' na 'styleUrls'
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  isWishlisted = false;
  isCarted = false;

  constructor(
    private maskaService: MaskaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    const cart = this.maskaService.getCart();
    const key = `${this.product.id}-${this.product.boja}`;
    this.isWishlisted = this.maskaService.getWishlist().has(this.product.id);
    this.isCarted = cart.has(key);
  }

  toggleWishlist() {
    this.maskaService.toggleWishlist(this.product.id);
    this.isWishlisted = !this.isWishlisted;
  }

  toggleCart() {
    const key = `${this.product.id}-${this.product.boja}`;
    if (this.isCarted) {
      this.maskaService.removeFromCart(this.product.id, this.product.boja);
      this.isCarted = false;
    } else {
      this.maskaService.addToCart(this.product.id, this.product.boja, 1);
      this.isCarted = true;

      // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //   data: {
      //     title: 'Proizvod dodat u korpu!',
      //     message: 'Želite li da pregledate korpu ili da nastavite sa kupovinom?',
      //   },
      //   width: '400px',
      //   panelClass: 'blur-dialog-backdrop'
      // });

      // dialogRef.afterClosed().subscribe((result) => {
      //   if (result === 'cart') {
      //     this.router.navigate(['/cart']);
      //   }
      // });
    }
  }

  getDiscountPrice(product: any) {
    return (product.cena - (product.cena * product.popust) / 100).toFixed(0);
  }
}
