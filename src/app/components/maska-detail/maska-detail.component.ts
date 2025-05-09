import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaskaService } from '../../services/maska.service';
import { ToastrService } from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-maska-detail',
  templateUrl: './maska-detail.component.html',
  styleUrls: ['./maska-detail.component.scss']
})
export class MaskaDetailComponent implements OnInit {
  maska: any;
  maske:any[] = [];
  izabranaSlika: string = '';
  uvelicano: boolean = false;
  kolicina: number = 1;
  izabranaBoja: string = '';
  drugaBoja: string = '';
  schemaData: SafeHtml | null = null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private maskaService: MaskaService,
    private toastr: ToastrService,
    private title: Title, private meta: Meta,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
       this.title.setTitle('Maske za klimu - Dekorativne, kvalitetne i povoljne maske za klimu');
    this.meta.updateTag({ name: 'description', content: 'Kupite moderne maske za klimu. Ulepsajte svoj prostor elegantnim dekorativnim resenjima za spoljasnje jedinice klima uredjaja.' });
    this.meta.updateTag({ name: 'keywords', content: 'maske za klimu, dekorativne maske za klimu, maske za spoljasnju jedinicu klime, klima maske, maske klima' });
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.maska = this.maskaService.maske.find(m => m.id === id);

    if (this.maska && this.maska.slika.length > 0) {
      this.izabranaSlika = this.maska.slika[0];
    }

    if (this.maska) {
    this.izabranaSlika = this.maska.slika[0];

    // SEO: title, description, keywords
    this.title.setTitle(`${this.maska.naziv} - Dekorativna maska za klimu | KlimaMaske`);
    this.meta.updateTag({
      name: 'description',
      content: `Kupite dekorativnu masku "${this.maska.naziv}" za vašu klimu. Kvalitetna izrada, više boja i jednostavna montaža.`
    });
    this.meta.updateTag({
      name: 'keywords',
      content: `maska za klimu ${this.maska.naziv}, dekorativna maska za klimu, klima maska, ${this.maska.boja || ''}`
    });

    // Schema.org
    const schemaJson = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": this.maska.naziv,
      "description": this.maska.opis,
      "image": this.maska.slika.map((s: string) => `https://www.klimamaske.online/${s}`),
      "sku": `MASKA-${this.maska.id}`,
      "offers": {
        "@type": "Offer",
        "url": `https://www.klimamaske.online/maska/${this.maska.id}`,
        "priceCurrency": "RSD",
        "price": this.maska.cena,
        "availability": "https://schema.org/InStock"
      }
    };

    this.schemaData = this.sanitizer.bypassSecurityTrustHtml(`
      <script type="application/ld+json">
        ${JSON.stringify(schemaJson)}
      </script>
    `);
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

  imaSledeci(): boolean {
    const trenutniIndex = this.maskaService.maske.findIndex(m => m.id === this.maska.id);
    return trenutniIndex < this.maskaService.maske.length - 1;
  }

  imaPrethodni(): boolean {
    const trenutniIndex = this.maskaService.maske.findIndex(m => m.id === this.maska.id);
    return trenutniIndex > 0;
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
    // Na primer, pozovi servis koji čuva proizvode u korpi

    this.toastr.success(`Proizvod "${this.maska.naziv}" je dodat u korpu.`, 'Uspešno');
  }


}
