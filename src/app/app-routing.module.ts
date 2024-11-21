import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'charts', loadComponent: () => import("./charts/details/details.component").then(d => d.DetailsComponent)
  },
  {
    path: 'charts/radar', loadComponent: () => import("./charts/radar/radar.component").then(r => r.RadarComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
