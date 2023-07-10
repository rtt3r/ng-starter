import { Component } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './auth.component.html'
})
export class AuthComponent { }