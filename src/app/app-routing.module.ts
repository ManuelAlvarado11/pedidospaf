import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PedidoCrearComponent } from './components/pedidos/pedido-crear/pedido-crear.component';
import { PedidoListarComponent } from './components/pedidos/pedido-listar/pedido-listar.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component:LoginComponent},
  {path: 'home', component:HomeComponent,canActivate: [AuthGuard],
    children: [
      {path: 'pedidos', component:PedidosComponent, canActivate: [AuthGuard],
        children: [
          {path: 'listar', component:PedidoListarComponent,canActivate: [AuthGuard]},
          {path: 'crear', component:PedidoCrearComponent,canActivate: [AuthGuard]}
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
