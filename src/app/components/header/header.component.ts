import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MaskaService } from '../../services/maska.service';

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

  constructor(private maskaService: MaskaService) {
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
