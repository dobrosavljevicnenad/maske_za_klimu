import { Component, OnInit } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistProducts: any[] = [];

  constructor(private maskaService: MaskaService) {}

  ngOnInit() {
    this.loadWishlist();
    this.maskaService.wishlist$.subscribe(() => {
      this.loadWishlist();
    });
  }

  loadWishlist() {
    this.wishlistProducts = this.maskaService.getWishlistProducts();
  }

  removeFromWishlist(productId: number) {
    this.maskaService.toggleWishlist(productId);
    this.loadWishlist(); // Osvežava listu nakon brisanja
  }
}
