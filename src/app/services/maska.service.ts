import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaskaService {

  private wishlist = new BehaviorSubject<Set<number>>(this.getWishlist());
  wishlist$ = this.wishlist.asObservable();

  private cart = new BehaviorSubject<Map<string, { productId: number, quantity: number, boja: string }>>(this.getCart());
  cart$ = this.cart.asObservable();

  constructor() { }

  maske = [
    {
      id: 1,
      naziv: 'Zaštitna maska za spoljnu jedinicu - Model 1',
      opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
      cena: 12490,
      slika: ['assets/maska4_4.jpg', 'assets/chatgpt_generated_pic.png', 'assets/maska4_5.webp'], // 'assets/maska4.jpg', 'assets/maska4_1.jpg',
      popust: 0,
      boja: 'Crna',
    },
    {
      id: 2,
      naziv: 'Zaštitna maska za spoljnu jedinicu - Model 2',
      opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
      cena: 12490,
      slika: ['assets/maska2_1.jpg', 'assets/maska2.jpg'],
      popust: 0,
      boja: 'Crna',
    },
    // {
    //   id: 3,
    //   naziv: 'Zaštitna maska za spoljnu jedinicu - Model 3',
    //   opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
    //   cena: 12999,
    //   slika: ['assets/maska3_1.jpg', 'assets/maska3.jpg'],
    //   popust: 15,
    //   boja: 'Crna',
    // },
    {
      id: 4,
      naziv: 'Zaštitna maska za spoljnu jedinicu - Model 3',
      opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
      cena: 12490,
      slika: ['assets/maska1_3.jpg','assets/maska1_2.webp', 'assets/maska1_1.webp', 'assets/maska1.jpg', 'assets/maska1_1.jpg'],
      popust: 0,
      boja: 'Crna',
    },
    // {
    //   id: 5,
    //   naziv: 'Zaštitna maska za spoljnu jedinicu - Model 5',
    //   opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
    //   cena: 12999,
    //   slika: ['assets/maska5.jpg', 'assets/maska5_1.png'],
    //   popust: 15,
    //   boja: 'Crna',
    // },
    {
      id: 5,
      naziv: 'Zaštitna maska za spoljnu jedinicu - Model 4',
      opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
      cena: 12490,
      slika: ['assets/maska20.jpg', 'assets/maska4_1.jpg'],
      popust: 0,
      boja: 'Crna',
    },
    {
      id: 6,
      naziv: 'Zaštitna maska za spoljnu jedinicu - Model 5',
      opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
      cena: 12490,
      slika: ['assets/maska6.png'],
      popust: 0,
      boja: 'Crna',
    },
    // {
    //   id:7,
    //   naziv: 'Zaštitna maska za spoljnu jedinicu - Model 7',
    //   opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
    //   cena: 12999,
    //   slika: ['assets/maska7.jpg'],
    //   popust: 15,
    //   boja: 'Crna',
    // },
    // {
    //   id: 8,
    //   naziv: 'Zaštitna maska za spoljnu jedinicu - Model 8',
    //   opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
    //   cena: 12999,
    //   slika: ['assets/maska8.webp'],
    //   popust: 15,
    //   boja: 'Crna',
    // },
    {
      id: 9,
      naziv: 'Zaštitna maska za spoljnu jedinicu - Model 6',
      opis: 'Stilizovana zaštita za klimu od laserski rezanog lima.',
      cena: 12490,
      slika: ['assets/maska9.jpg'],
      popust: 0,
      boja: 'Crna',
    }
  ];

  /*** --- WISHLIST METODE --- ***/
  saveWishlist(wishlist: Set<number>) {
    localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist)));
    this.wishlist.next(wishlist);
  }

  getWishlist(): Set<number> {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? new Set(JSON.parse(wishlist)) : new Set();
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
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
    this.cart.next(cart);
  }

  getCart(): Map<string, { productId: number, quantity: number, boja: string }> {
    const cartData = localStorage.getItem('cart');
    return cartData ? new Map(JSON.parse(cartData)) : new Map();
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

  getDiscountPrice(product: any):any {
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
