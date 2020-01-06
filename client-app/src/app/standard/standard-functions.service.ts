import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StandardFunctionsService {

  constructor(private router: Router, private location: Location) { }

  onBack(url) {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([url]);
    }
  }

}
