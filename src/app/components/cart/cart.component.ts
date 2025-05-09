import { Component, OnInit } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: any[] = [];
  schemaData: SafeHtml | null = null;

  editingColorIndex: number | null = null;
  newColorValue: string = '';

  constructor(private maskaService: MaskaService, private router: Router,private title: Title, private meta: Meta,   private sanitizer: DomSanitizer,
  @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.title.setTitle('Maske za klimu - Dekorativne, kvalitetne i povoljne maske za klimu');
    this.meta.updateTag({ name: 'description', content: 'Kupite moderne maske za klimu. Ulepsajte svoj prostor elegantnim dekorativnim resenjima za spoljasnje jedinice klima uredjaja.' });
    this.meta.updateTag({ name: 'keywords', content: 'maske za klimu, dekorativne maske za klimu, maske za spoljasnju jedinicu klime, klima maske, maske klima' });
    this.loadCart();

    if (isPlatformBrowser(this.platformId)) {
  const itemListElements = this.cartProducts.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.klimamaske.online/maska/${product.id}`,
    name: product.naziv
  }));

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": itemListElements
  };

  this.schemaData = this.sanitizer.bypassSecurityTrustHtml(`
    <script type="application/ld+json">
    ${JSON.stringify(schemaJson)}
    </script>
  `);
}

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

  navigateToOrder(): void {
  if (this.cartProducts.length > 0) {
    this.router.navigate(['/order']);
  }
}

}
