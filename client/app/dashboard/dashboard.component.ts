import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from "@angular/http";
// import { Control } from '@angular/common';
import { SocketService } from '../service/socket/socket.service';

// import { SailsService } from "angular2-sails";
declare var io: any;

@Component({
    selector: 'app-dashboard',
    // templateUrl: './dashboard.component.html',
    template: `<div *ngFor="let message of messages">
                    {{message.text}}
                </div>
                <input [(ngModel)]="message"  /><button (click)="sendMessage()">Send {{message}}</button>`,
    
    styleUrls: ['./dashboard.component.css'],
    providers: [SocketService]
})

export class DashboardComponent implements OnInit, OnDestroy {
    messages;
    connection;
    message;

    constructor(private SocketService: SocketService) { }

    sendMessage() {
        this.SocketService.sendMessage(this.message);
        this.message = '';
    }

    ngOnInit() {
        this.connection = this.SocketService.getMessages().subscribe(message => {
            console.log('subscribe',message);
            this.messages.push(message);
        })
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}

