import { Injectable } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import * as SailsIOClient from '/Users/jonathanaraya/Documents/www/tweetRelevance/server/.tmp/public/js/dependencies/sails.io.js';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SocketService {
    private url = 'http://localhost:1337';
    private transports = ['websocket','polling'];
    private autoConnect = true;
    private useCORSRouteToGetCookie = false;
    public io: SailsIOClient;
    // Observable<Response> ob = this.http.post(this.url+ '/user/create', { name:'bla'})
    
    constructor() {
        this.io = SailsIOClient(SocketIOClient);
        this.io.sails.transports = this.transports;
        this.io.sails.url = this.url;
        this.io.sails.autoConnect = this.autoConnect;
        this.io.sails.useCORSRouteToGetCookie = this.useCORSRouteToGetCookie;
        this.io.socket.post('/tweet/subscribe', data => {
            console.log('subscribe', data);
        });
    }
    sendMessage(message) {
        // this.socket.emit('message', message);
        this.io.socket.post('/tweet/create', (a,b) => {
            console.log(a,b);
        });
    }


    getMessages() {
        let observable = new Observable(observer => {
            // io.socket = io.sails.connect();
            this.io.socket.on('new-tweet', (data) => {
                console.log('uer', data);
                // observer.next(data);
            });
            this.io.socket.on('connect', () => {
                console.log('conectado');
                // io.socket.emit('message', { text: 'emit' });
            });
            this.io.socket.on('tweet', (data) => {
                console.log('nuevo tweet', data);
            });
            this.io.socket.on('disconnect', () => {
                console.log('disconnected...');
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
