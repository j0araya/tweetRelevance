import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class CorrelationService {

    constructor(private http: HttpClient) { }

    getPearson() {
        // const headers = new HttpHeaders();
        // headers.append('Access-Control-Allow-Headers', 'Content-Type');
        // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // headers.append('Access-Control-Allow-Methods', 'GET');
        // headers.append('Access-Control-Allow-Origin', '*');
        console.log('asdasdadasdasdasd');
        return this.http.get('http://localhost:1337/coefficient/getPearson');
        // this.io.socket.on("remove", (item: any) => observer.next({ action: "remove", item: item }) );
        // return () => this.io.socket.close();
    };
            // this.io.socket.post('/coefficient/getPearson', data => {
            //     console.log('data', data);
            //     return observer.next(data);
            // });
        // });
    getSpearman() {
        // return Observable.create((observer: any) => {
        //     this.io.socket.post('/coefficient/getSpearman', data => {
        //         console.log('sdata', data);
        //         return observer.next(data);
        //     });
        // });
    }

}
