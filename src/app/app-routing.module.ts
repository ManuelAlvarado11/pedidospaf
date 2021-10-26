import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { FooterComponent } from './components/footer/footer.component';


const routes: Routes = [
  {path:'sidebar', component: SidebarComponent},
  {path:'navbar', component: NavbarComponent},
  {path:'pedidos', component: PedidosComponent},
  {path:'footer', component: FooterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
