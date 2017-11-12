import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../service/socket.service';
// @Component({
//     selector: 'app-dashboard',
//     templateUrl: './dashboard.component.html',
//     styleUrls: ['./dashboard.component.css']
// })

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    messages = [];
    connection;
    message;

    constructor(private SocketService: SocketService) { }

    sendMessage(message) {
        console.log('message', message);
        this.SocketService.sendMessage(message);
        this.message = '';
    }

    ngOnInit() {
        this.connection = this.SocketService.getMessages().subscribe(message => {
            this.messages.push(message);
        })
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}