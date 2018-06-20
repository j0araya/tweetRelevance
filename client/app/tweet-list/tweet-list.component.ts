import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
    selector: 'app-tweet-list',
    templateUrl: './tweet-list.component.html',
    styleUrls: ['./tweet-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TweetListComponent implements OnInit {
    
    constructor() { }
    
    @Input() public tweets;
    
    ngOnInit() {
    }
}
