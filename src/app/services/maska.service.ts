import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MaskaService {

  private wishlist = new BehaviorSubject<Set<number>>(this.getWishlist());
  wishlist$ = this.wishlist.asObservable();

  private cart = new BehaviorSubject<Map<string, { productId: number, quantity: number, boja: string }>>(this.getCart());
  cart$ = this.cart.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  maske = [
    { id: 1, naziv: 'Zaštitna maska za spoljnu jedinicu - Model 1', opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.', cena: 12480, slika: ['assets/maska4_4.jpg'], popust: 0, boja: 'Crna' },
    { id: 2, naziv: 'Zaštitna maska za spoljnu jedinicu - Model 2', opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.', cena: 12480, slika: ['assets/maska2_1.jpg'], popust: 0, boja: 'Crna' },
    { id: 4, naziv: 'Zaštitna maska za spoljnu jedinicu - Model 3', opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.', cena: 12480, slika: ['assets/maska1_3.jpg'], popust: 0, boja: 'Crna' },
    { id: 5, naziv: 'Zaštitna maska za spoljnu jedinicu - Model 4', opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.', cena: 12480, slika: ['assets/maska20.jpg'], popust: 0, boja: 'Crna' },
    { id: 6, naziv: 'Zaštitna maska za spoljnu jedinicu - Model 5', opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.', cena: 12480, slika: ['assets/klima_br3.png'], popust: 0, boja: 'Crna' },
    { id: 9, naziv: 'Zaštitna maska za spoljnu jedinicu - Model 6', opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.', cena: 12480, slika: ['assets/maska_br5.png'], popust: 0, boja: 'Crna' }
  ];

  /*** --- WISHLIST METODE --- ***/
  saveWishlist(wishlist: Set<number>) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist)));
    }
    this.wishlist.next(wishlist);
  }

  getWishlist(): Set<number> {
    if (isPlatformBrowser(this.platformId)) {
      const wishlist = localStorage.getItem('wishlist');
      return wishlist ? new Set(JSON.parse(wishlist)) : new Set();
    }
    return new Set(); // Ako je server-side, vrati praznu kolekciju
  }

  toggleWishlist(productId: number) {
    let wishlist = this.getWishlist();
    wishlist.has(productId) ? wishlist.delete(productId) : wishlist.add(productId);
    this.saveWishlist(wishlist);
  }

  getWishlistProducts() {
    return this.maske.filter(product => this.getWishlist().has(product.id));
  }

  /*** --- CART METODE --- ***/

  saveCart(cart: Map<string, { productId: number, quantity: number, boja: string }>) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
    }
    this.cart.next(cart);
  }

  getCart(): Map<string, { productId: number, quantity: number, boja: string }> {
    if (isPlatformBrowser(this.platformId)) {
      const cartData = localStorage.getItem('cart');
      return cartData ? new Map(JSON.parse(cartData)) : new Map();
    }
    return new Map(); // Ako je server-side, vrati praznu Mapu
  }

  addToCart(productId: number, boja: string, kolicina: number = 1) {
    const cart = this.getCart();
    const key = `${productId}-${boja}`;
    const currentItem = cart.get(key);
    const currentQuantity = currentItem ? currentItem.quantity : 0;

    cart.set(key, { productId, quantity: currentQuantity + kolicina, boja });
    this.saveCart(cart);
  }

  removeFromCart(productId: number, boja: string) {
    const cart = this.getCart();
    const key = `${productId}-${boja}`;
    const item = cart.get(key);

    if (item) {
      if (item.quantity > 1) {
        cart.set(key, { ...item, quantity: item.quantity - 1 });
      } else {
        cart.delete(key);
      }
      this.saveCart(cart);
    }
  }

  updateQuantity(productId: number, boja: string, quantity: number) {
    const cart = this.getCart();
    const key = `${productId}-${boja}`;
    const item = cart.get(key);

    if (item) {
      cart.set(key, { ...item, quantity });
      this.saveCart(cart);
    }
  }

  deleteFromCart(productId: number, boja: string) {
    const cart = this.getCart();
    const key = `${productId}-${boja}`;
    cart.delete(key);
    this.saveCart(cart);
  }

  getCartProducts() {
    const cart = this.getCart();
    const products: any[] = [];

    cart.forEach((item, key) => {
      const baseProduct = this.maske.find(p => p.id === item.productId);
      if (baseProduct) {
        products.push({
          ...baseProduct,
          boja: item.boja,
          kolicina: item.quantity,
          cartKey: key
        });
      }
    });

    return products;
  }

  getTotalPrice(): number {
    return this.getCartProducts().reduce((total, product) => {
      return total + this.getDiscountPrice(product) * product.kolicina;
    }, 0);
  }

  getDiscountPrice(product: any): any {
    return (product.cena - (product.cena * product.popust) / 100).toFixed(0);
  }

  getMaske() {
    return this.maske;
  }

  cartCount$ = this.cart$.pipe(
    map(cart => {
      let count = 0;
      cart.forEach(item => count += item.quantity);
      return count;
    })
  );

  getFilteredProducts(searchQuery: string): any[] {
    const query = searchQuery.toLowerCase();  // Pretvaramo u mala slova radi lakšeg poređenja
    return this.maske.filter(product =>
      product.naziv.toLowerCase().includes(query) ||
      product.opis.toLowerCase().includes(query)
    );
  }

  wishlistCount$ = this.wishlist$.pipe(
    map(wishlist => wishlist.size)
  );
}
