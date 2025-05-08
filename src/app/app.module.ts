import { RouterLink, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaskaDetailComponent } from './components/maska-detail/maska-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './components/order/order.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductCardComponent,
    ConfirmationDialogComponent,
    MaskaDetailComponent,
    CartComponent,
    OrderComponent,
    WishlistComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    RouterLink,
    ToastrModule.forRoot({
        positionClass: 'toast-top-center',
        timeOut: 2000, // automatski nestane posle 2 sekunde
        progressBar: true,
        closeButton: false
      }),
  ],

  providers: [provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule { }
