import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaskaService } from '../../services/maska.service';
import { isPlatformBrowser} from '@angular/common';
import { PLATFORM_ID } from '@angular/core';  // Ovo koristi @angular/core za PLATFORM_ID


@Component({
  selector: 'app-maska-detail',
  templateUrl: './maska-detail.component.html',
  styleUrls: ['./maska-detail.component.scss']
})
export class MaskaDetailComponent implements OnInit {
  maska: any;
  maske: any[] = [];
  izabranaSlika: string = '';
  uvelicano: boolean = false;
  kolicina: number = 1;
  izabranaBoja: string = '';
  drugaBoja: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private maskaService: MaskaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.maska = this.maskaService.maske.find(m => m.id === id);

    if (this.maska && this.maska.slika.length > 0) {
      this.izabranaSlika = this.maska.slika[0];
    }
  }

  promeniSliku(slika: string) {
    this.izabranaSlika = slika;
  }

  otvoriUvelicanuSliku() {
    this.uvelicano = true;
  }

  zatvoriUvelicanuSliku() {
    this.uvelicano = false;
  }

  sledecaSlika(event: Event) {
    event.stopPropagation();
    const trenutniIndex = this.maska.slika.indexOf(this.izabranaSlika);
    if (trenutniIndex < this.maska.slika.length - 1) {
      this.izabranaSlika = this.maska.slika[trenutniIndex + 1];
    }
  }

  prethodnaSlika(event: Event) {
    event.stopPropagation();
    const trenutniIndex = this.maska.slika.indexOf(this.izabranaSlika);
    if (trenutniIndex > 0) {
      this.izabranaSlika = this.maska.slika[trenutniIndex - 1];
    }
  }

  imaSledeci(): boolean {
    return this.maska.slika.indexOf(this.izabranaSlika) < this.maska.slika.length - 1;
  }

  imaPrethodni(): boolean {
    return this.maska.slika.indexOf(this.izabranaSlika) > 0;
  }

  imaSledecu(): boolean {
    return this.maska.slika.indexOf(this.izabranaSlika) < this.maska.slika.length - 1;
  }

  imaPrethodnu(): boolean {
    return this.maska.slika.indexOf(this.izabranaSlika) > 0;
  }


  sledeciProizvod() {
    const trenutniIndex = this.maskaService.maske.findIndex(m => m.id === this.maska.id);
    if (trenutniIndex < this.maskaService.maske.length - 1) {
      this.maska = this.maskaService.maske[trenutniIndex + 1];
      this.izabranaSlika = this.maska.slika[0]; // Resetuj prvu sliku za novi proizvod
    }
  }

  prethodniProizvod() {
    const trenutniIndex = this.maskaService.maske.findIndex(m => m.id === this.maska.id);
    if (trenutniIndex > 0) {
      this.maska = this.maskaService.maske[trenutniIndex - 1];
      this.izabranaSlika = this.maska.slika[0]; // Resetuj prvu sliku za novi proizvod
    }
  }

  // Funkcija za povećanje količine
  povecajKolicinu(): void {
    this.kolicina++;
  }

  onKolicinaChange() {
    // Ako je unesena količina manja od 1, setuj je na 1
    if (this.kolicina < 1) {
      this.kolicina = 1;
    }
  }

  // Funkcija za smanjivanje količine
  smanjiKolicinu(): void {
    if (this.kolicina > 1) {
      this.kolicina--;
    }
  }

  // Funkcija za dodavanje proizvoda u korpu
  dodajUKorpu(productId: any): void {
    const boja = this.drugaBoja.trim() ? this.drugaBoja : this.izabranaBoja;

    if (!boja) {
      alert('Molimo izaberite ili unesite boju.');
      return;
    }

    this.maskaService.addToCart(productId, boja, this.kolicina);

    // Ovde možeš koristiti `boja` zajedno sa ostalim podacima o proizvodu
    console.log('Dodaj u korpu:', {
      maska: this.maska,
      kolicina: this.kolicina,
      boja: boja
    });
    // Ovde možeš dodati logiku za dodavanje proizvoda u korpu
    console.log(`Proizvod "${this.maska.naziv}" sa količinom ${this.kolicina} dodat u korpu.`);
  }
}
