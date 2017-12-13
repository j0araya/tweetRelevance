import { Injectable } from '@angular/core';
import * as SocketIOClient from 'socket.io-client';
import * as SailsIOClient from '/Users/jonathanaraya/Documents/www/tweetRelevance/server/.tmp/public/js/dependencies/sails.io.js';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {
    private url = 'http://localhost:1337';
    private transports = ['websocket', 'polling'];
    private autoConnect = true;
    private useCORSRouteToGetCookie = false;
    public tweets;
    public system;
    public io: SailsIOClient;
    private subscriptors = new Subject<string>();
    private newTweet = this.subscriptors.asObservable();
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
    // sendMessage(message) {
    //     // this.socket.emit('message', message);
    //     this.io.socket.post('/tweet/create', (a,b) => {
    //         console.log(a,b);
    //     });
    // }
    stopTweets() {
        return this.io.socket.close();
    }

    getStaticSystemInfo() {
        // console.log('sys', data);
        return Observable.create((observer: any) => {
            this.io.socket.post('/user/sysInfo', data => {
                return observer.next(data);
            });

            // return Observable.create((observer: any) => {
            //     return this.io.socket.on('sys-info', (data) => {
            //         observer.next({ action: data.action, data: data });
            //     });
            // });
        });
    }

    getDinamicSystemInfo() {
        return Observable.create((observer: any) => {
            this.io.socket.on('sys-dinamic', data => {
                return observer.next(data);
            });

            // return Observable.create((observer: any) => {
            //     return this.io.socket.on('sys-info', (data) => {
            //         observer.next({ action: data.action, data: data });
            //     });
            // });
        });
    }

    getTweets() {
                // return new Observable(observer => {
                // io.socket = io.sails.connect();
                // this.io.socket.on('new-tweet', tweet => {
                //     console.log('new-tweet', tweet);
                //     return new Tweet(tweet);
                // })
                // this.io.socket.on('connect', () => {
                //     console.log('conectado');
                //     // io.socket.emit('message', { text: 'emit' });
                // });
                return Observable.create((observer: any) => {
                    return this.io.socket.on('tweet', (tweet: any) => {
                        observer.next({ action: "new-tweet", item: tweet })
                        // return () => this.io.socket.close();
                    });
                    // this.io.socket.on("remove", (item: any) => observer.next({ action: "remove", item: item }) );
                    // return () => this.io.socket.close();
                });
                // this.io.socket.on('tweet', (data) => {
                //     console.log('nuevo tweet', data);
                //     return new Tweet(data);
                // });
                // this.subscriptors.next()
                // this.io.socket.on('disconnect', () => {
                //     console.log('disconnected...');
                // });
                // return () => {
                //     io.socket.disconnect();
                // };
                // });
                // return observable;
            }
}

export class Tweet {
    public id: string;
    public created_at: string;//fecha de creacion del tweet
    public tweetId: number; // id Tweet
    public strTweetId: string; // id como string
    public text: string; // texto del tweet
    public user: object;
    public retweetCount: number;
    public replyCount: number;
    public favoriteCount: number;
    public isFavorited: boolean; // si es favorito de una cuent autentificada
    public isRetweeted: boolean; // si es retweteado de una cuent autentificada
    public lang: string;
    public hastags: string[];
    public urls: object[];

    constructor(tweet) {
        this.id = tweet.id;
        this.created_at = tweet.created_at;
        this.text = tweet.text;
        this.user = tweet.user;
        this.retweetCount = tweet.retweetCount;
        this.replyCount = tweet.replyCount;
        this.favoriteCount = tweet.favoriteCount;
        this.isFavorited = tweet.isFavorited;
    }
}
