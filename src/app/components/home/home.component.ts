import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaskaService } from '../../services/maska.service';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
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
