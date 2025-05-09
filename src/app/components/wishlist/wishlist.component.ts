import { Component, OnInit } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistProducts: any[] = [];

  constructor(private maskaService: MaskaService,private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Maske za klimu - Dekorativne, kvalitetne i povoljne maske za klimu');
    this.meta.updateTag({ name: 'description', content: 'Kupite moderne maske za klimu. Ulepsajte svoj prostor elegantnim dekorativnim resenjima za spoljasnje jedinice klima uredjaja.' });
    this.meta.updateTag({ name: 'keywords', content: 'maske za klimu, dekorativne maske za klimu, maske za spoljasnju jedinicu klime, klima maske, maske klima' });
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
