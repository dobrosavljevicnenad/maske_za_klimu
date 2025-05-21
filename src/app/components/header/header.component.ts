import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MaskaService } from '../../services/maska.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Promenjeno iz "styleUrl" u "styleUrls"
})
export class HeaderComponent {

  isModalOpen: boolean = false;
  cartProducts: any[] = [];

  cartCount$: Observable<number>;
  wishlistCount$: Observable<number>;

  searchQuery: string = '';

  @Output() searchQueryChanged = new EventEmitter<string>();

  constructor(private maskaService: MaskaService,private title: Title, private meta: Meta) {
      this.title.setTitle('Maske za klimu - Dekorativne, kvalitetne i povoljne maske za klimu');
      this.meta.updateTag({ name: 'description', content: 'Kupite moderne maske za klimu. Ulepsajte svoj prostor elegantnim dekorativnim resenjima za spoljasnje jedinice klima uredjaja.' });
      this.meta.updateTag({ name: 'keywords', content: 'maske za klimu, dekorativne maske za klimu, maske za spoljasnju jedinicu klime, klima maske, maske klima' });
      this.cartCount$ = this.maskaService.cartCount$;
      this.wishlistCount$ = this.maskaService.wishlistCount$;
      this.cartProducts = this.maskaService.getCartProducts();

      this.cartCount$.subscribe(() => {
        this.cartProducts = this.maskaService.getCartProducts();
      });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSearchChange() {
    this.searchQueryChanged.emit(this.searchQuery);
  }
}
