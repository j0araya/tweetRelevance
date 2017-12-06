import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../service/socket/socket.service';


declare var io: any;

@Component({
    selector: 'app-dashboard',
    // templateUrl: './dashboard.component.html',
    template: `<div *ngFor="let tweet of tweets">
                    {{tweet.text}}
                </div>`,
    styleUrls: ['./dashboard.component.css'],
    providers: [SocketService]
})

export class DashboardComponent implements OnInit, OnDestroy {
    tweets = [];
    connection;
    // message;

    constructor(private SocketService: SocketService) { }

    ngOnInit() {
        this.connection = this.SocketService.getTweets().subscribe(
            (tweet) => {
                console.log(tweet);
                switch (tweet.action) {
                    case ('new-tweet'):
                        this.tweets.push(tweet.item.data);
                        break;
                }
            });
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}

