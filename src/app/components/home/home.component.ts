import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaskaService } from '../../services/maska.service';
import { Title, Meta } from '@angular/platform-browser';

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

  maskeService = inject(MaskaService);

  constructor(private route: ActivatedRoute, private router: Router,private title: Title, private meta: Meta) {}

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
