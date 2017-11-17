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
                <button (click)="join()">Join</button>
                <input [(ngModel)]="message"  /><button (click)="sendMessage()">Send {{message}}</button>`,
    
    styleUrls: ['./dashboard.component.css'],
    providers: [SocketService]
})


// @Component({
//   moduleId: module.id,
//   selector: 'chat',
//   template: `<div *ngFor="let message of messages">
//                      {{message.text}}
//                    </div>
//                    <input [(ngModel)]="message"  /><button (click)="sendMessage()">Send</button>`,
//   providers: [ChatService]
// })


export class DashboardComponent implements OnInit, OnDestroy {
    messages;
    connection;
    message;

    constructor(private SocketService: SocketService) { }

    sendMessage() {
        this.SocketService.sendMessage(this.message);
        this.message = '';
    }
    join() {
        this.SocketService.join();
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


    // socket: any;
    // // public users: any[];
    // constructor(private http: Http) {

    // }

    // ngOnInit() {
        // this.http.get('/user').subscribe((success) => {
        //     var data = success.json();
        //     console.log(data);
        //     // for(var i = 0; i < data.length; i++) {
        //     //     this.messages.push(data[i].message);
        //     // }
        // }, (error) => {
        //     console.log(JSON.stringify(error));
        // });
    //    this.socket = io();
        // io.sails.socket.
        // this.socket.get('/user/subscribe', function(data, jwr) {
        //     console.log('get', data, jwr);
        //     io.socket.on('new_entry', function(entry) {
        //         console.log('entry', entry);
        //     //   $timeout(function() {
        //     //     $scope.feedEntries.unshift(entry);
        //     //   });
        //     });
        //   });
    //     let opts = {
    //         url: "http://localhost:4200",
    //         transports: ['polling', 'websocket'],
    //         // headers: {},
    //     }
    //     this._sailsService.connect(opts);
    //     this._sailsService
    //         .get('/user/')
    //         .subscribe(resData => {
    //             this.users = resData.data
    //             console.log('resdata', resData);∫
    //         }, error => {
    //             console.log("oooops, error occured")
    //         }, () => {
    //             console.log("we are finished")
    //         });
        // io.socket.on('tweet', function (event) {
        //     console.log(event);
        // });
        // console.log('io', io());
        // // io.socket.get('/tweets/join', function serverResponded(body, JWR) {

        // //     // JWR ==> "JSON WebSocket Response"
        // //     console.log('Sails responded with: ', body);
        // //     console.log('with headers: ', JWR.headers);
        // //     console.log('and with status code: ', JWR.statusCode);

        // //     // first argument `body` === `JWR.body`
        // //     // (just for convenience, and to maintain familiar usage, a la `JQuery.get()`)
        // // });
        // this.socket.emit('/tweet/join', (data) => {
        //     console.log('Socket ' + data.id + ' joined the party!');
        // });
        // this.socket.on('connect', function (data) {
        //     console.log('status => ' + data);
        // });
        //    this.socket.emit('event1', {
        //        msg: 'client to server'
        //    });
        //    this.socket.on('event2', (data: any) =>{
        //        console.log('event2', data.msg);
        //        this.socket.emit('event3', {
        //            msg: 'it works'
        //        });
        //    });
        //    this.socket.on('event4', (data: any) => {
        //        console.log('event4', data.msg);
        //    });

