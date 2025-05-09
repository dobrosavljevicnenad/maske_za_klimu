import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaskaService } from '../../services/maska.service';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bannerImages: string[] = [];
  maske: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  proizvodi: any[] = [];
  schemaData: SafeHtml[] = [];

  maskeService = inject(MaskaService);

  constructor(private route: ActivatedRoute, private router: Router,private title: Title, private meta: Meta,     private sanitizer: DomSanitizer,   @Inject(PLATFORM_ID) private platformId: Object
) {
  this.proizvodi = this.maskeService.getMaske();

    if (isPlatformBrowser(this.platformId)) {
      this.schemaData = this.proizvodi.map(p => this.sanitizer.bypassSecurityTrustHtml(`
        <script type="application/ld+json">
        ${JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": p.naziv,
          "description": p.opis,
          "image": [`https://www.klimamaske.online/${p.slika[0]}`],
          "sku": `MASKA-${p.id}`,
          "offers": {
            "@type": "Offer",
            "url": `https://www.klimamaske.online/proizvodi/${p.id}`,
            "priceCurrency": "RSD",
            "price": p.cena,
            "availability": "https://schema.org/InStock"
          }
        })}
        </script>
      `));}
  }

  ngOnInit(): void {
    this.title.setTitle('Maske za klimu - Dekorativne, kvalitetne i povoljne maske za klimu');
    this.meta.updateTag({ name: 'description', content: 'Kupite moderne maske za klimu. Ulepsajte svoj prostor elegantnim dekorativnim resenjima za spoljasnje jedinice klima uredjaja.' });
    this.meta.updateTag({ name: 'keywords', content: 'maske za klimu, dekorativne maske za klimu, maske za spoljasnju jedinicu klime, klima maske, maske klima' });
    this.maske = this.maskeService.getMaske();
    this.maske.forEach(maska => this.bannerImages.push(maska.slika));

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.filterProducts();
    });
  }

  getDiscountPrice(product: any) {
    return (product.cena - (product.cena * product.popust) / 100).toFixed(0);
  }

  goTo(id: number) {
    this.router.navigate(['/maska', id]);
  }

  filterProducts(): void {
    if (this.searchQuery) {
      this.filteredProducts = this.maske.filter(product =>
        product.naziv.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = this.maske;
    }
  }
}
