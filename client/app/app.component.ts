import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: []
})
export class AppComponent implements OnInit {
    // private url = 'http://localhost:1337';
    // public socket: any;
    constructor() {
    //     this.socket = io(this.url);
    }
    ngOnInit() {
        // this.socket.emit('connect', 'aaaa');
        // this.socket.on('connection', (socket) => {
        //     let token = socket.handshake.query.token;
        //     console.log('token', token)
        // });
        // let observable = new Observable(observer => {
        //     this.socket = io(this.url);
        //     this.socket.on('message', (data) => {
        //         observer.next(data);
        //     });
        //     return () => {
        //         this.socket.disconnect();
        //     };
        // })
    }
}
