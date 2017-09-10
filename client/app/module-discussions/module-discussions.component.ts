import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-module-discussions',
  templateUrl: './module-discussions.component.html',
  styleUrls: ['./module-discussions.component.css']
})
export class ModuleDiscussionsComponent implements OnInit {
    page = 1;

    constructor() { }

    ngOnInit() {
  }

}
