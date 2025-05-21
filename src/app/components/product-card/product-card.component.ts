import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MaskaService } from '../../services/maska.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  isWishlisted = false;
  isCarted = false;
  schemaData: SafeHtml | null = null;


  constructor(
    private maskaService: MaskaService,
    private dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const cart = this.maskaService.getCart();
    const key = `${this.product.id}-${this.product.boja}`;
    this.isWishlisted = this.maskaService.getWishlist().has(this.product.id);
    this.isCarted = cart.has(key);

    if (isPlatformBrowser(this.platformId)) {
      const schemaJson = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": this.product.naziv,
        "description": this.product.opis,
        "image": [`https://www.klimamaske.online/${this.product.slika[0]}`],
        "sku": `MASKA-${this.product.id}`,
        "offers": {
          "@type": "Offer",
          "url": `https://www.klimamaske.online/maska/${this.product.id}`,
          "priceCurrency": "RSD",
          "price": this.getDiscountPrice(this.product),
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 4.5,
          "reviewCount": 23
        }
      };


      this.schemaData = this.sanitizer.bypassSecurityTrustHtml(`
        <script type="application/ld+json">
        ${JSON.stringify(schemaJson)}
        </script>
      `);
    }
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

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Proizvod dodat u korpu!',
          message: 'Želite li da pregledate korpu ili da nastavite sa kupovinom?',
        },
        width: '400px',
        panelClass: 'blur-dialog-backdrop'
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'cart') {
          this.router.navigate(['/cart']);
        }
      });
    }
  }

  getDiscountPrice(product: any) {
    return (product.cena - (product.cena * product.popust) / 100).toFixed(0);
  }
}
