import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    // SEO TITLE
    this.titleService.setTitle('Maske za klimu - Dekorativne i kvalitetne maske po meri');

    // SEO META DESCRIPTION
    this.metaService.updateTag({
      name: 'description',
      content: 'Kupite dekorativne maske za klimu koje ulepšavaju prostor i štite spoljašnju jedinicu. Prilagođene dimenzije, boje i dizajn po meri.'
    });

    // SEO META KEYWORDS (nije više presudan, ali može da pomogne)
    this.metaService.updateTag({
      name: 'keywords',
      content: 'maske za klimu, dekorativne maske za klimu, zaštita klima uređaja, metalne maske, klima kutije, klima maska'
    });
  }
}
