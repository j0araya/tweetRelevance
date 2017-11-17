import { Injectable } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import * as SailsIOClient from '/Users/jonathanaraya/Documents/www/tweetRelevance/server/.tmp/public/js/dependencies/sails.io.js';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';



@Injectable()
export class SocketService {
    private url = 'http://localhost:1337';
    private transports = ['websocket','polling'];
    private autoConnect = true;
    private useCORSRouteToGetCookie = false;
    public socket: any;
    public io;
    // Observable<Response> ob = this.http.post(this.url+ '/user/create', { name:'bla'})
    
    constructor() {
        this.io = SailsIOClient(SocketIOClient);
        this.io.sails.transports = this.transports;
        this.io.sails.url = this.url;
        this.io.sails.autoConnect = this.autoConnect;
        this.io.sails.useCORSRouteToGetCookie = this.useCORSRouteToGetCookie;
        // this.io.socket.on('message', (data) => {
        //     console.log('uer', data);
        //     // observer.next(data);
        // });
        // this.io.socket.on('connect', () => {
        //     console.log('conectado');
        //     // io.socket.emit('message', { text: 'emit' });
        // });
        // this.io.socket.on('user', (data) => {
        //     console.log('uer', data);
        // });
        // this.io.socket.on('disconnect', () => {
        //     console.log('disconnect...');
        // });
    }

    sendMessage(message) {
        // this.socket.emit('message', message);
        this.io.socket.post('/user/create', (a,b) => {
            console.log(a,b);
        })
    }
    join() {
        this.io.socket.post('/user/subscribe', (a,b) => {
            console.log(a,b);
        })
        
    }

    getMessages() {
        let observable = new Observable(observer => {
            // io.socket = io.sails.connect();
            this.io.socket.on('message', (data) => {
                console.log('uer', data);
                // observer.next(data);
            });
            this.io.socket.on('connect', () => {
                console.log('conectado');
                // io.socket.emit('message', { text: 'emit' });
            });
            this.io.socket.on('user', (data) => {
                console.log('uer', data);
            });
            this.io.socket.on('disconnect', () => {
                console.log('disconnect...');
            });
            // return () => {
            //     io.socket.disconnect();
            // };
        })
        return observable;
    }
}
    // constructor() {
    //     this.socket = io(this.url);
    // }
    // ngOnInit() {

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
        // });
//     }
// }
