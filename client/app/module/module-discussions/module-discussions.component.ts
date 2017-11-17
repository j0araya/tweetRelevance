import { Component, OnInit } from '@angular/core';

import { Discussion } from './shared/discussion';
import { MOCK_DISCUSSIONS } from './shared/mock-discussions';

@Component({
    selector: 'app-module-discussions',
    templateUrl: './module-discussions.component.html',
    styleUrls: ['./module-discussions.component.css']
})
export class ModuleDiscussionsComponent implements OnInit {
    page = 1;
    listOfDiscussions: Discussion[];

    constructor() { }

    ngOnInit() {
        this.listOfDiscussions = MOCK_DISCUSSIONS;
    }

}
