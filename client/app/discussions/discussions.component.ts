import { Component, OnInit } from '@angular/core';

import { Discussion } from './shared/discussion';
import { MOCK_DISCUSSIONS } from './shared/mock-discussions';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css']
})
export class DiscussionsComponent implements OnInit {
    page = 1;
    listOfDiscussions: Discussion[];

    constructor() { }

    ngOnInit() {
        this.listOfDiscussions = MOCK_DISCUSSIONS;
    }

}
