import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { MatListModule } from '@angular/material'
import { SocketService } from '../service/socket/socket.service';
import { CorrelationService } from '../service/correlation/correlation.service';
import { MatCardModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';
import { MatHorizontalStepper, MatStepper } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';



@Component({
    selector: 'tr-tweet',
    inputs: ['tweet'],
    templateUrl: './tweet.component.html',
    styleUrls: ['./tweet.component.css'],
    providers: [SocketService]
})

export class TweetComponent implements OnInit, OnDestroy {
    public tweets = [];
    public normTotal = [];
    public system = {};
    public memUsage = {};
    public diskUsage = {};
    private connection;
    public isLinear = true;

    // Procesador
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartData: any[] = [
        { data: [0], label: 'Anterior' },
        { data: [0], label: 'Actual' }
    ];

    public replies = [];
    public retweets = [];
    public favorites = [];
    public quotes = [];
    public normalized = [];
    public fullNormalized = [];

    public radarChartLabels: string[] = ['Retweet', 'Replies', 'Favorite', 'Menciones'];

    public radarChartData: any = [
        { data: [0, 0, 0, 0], label: 'Series 1' },
        { data: [0, 0, 0, 0], label: 'Series 2' },
        { data: [0, 0, 0, 0], label: 'Series 3' },
        { data: [0, 0, 0, 0], label: 'Series 4' },
        { data: [0, 0, 0, 0], label: 'Series 5' },
        { data: [0, 0, 0, 0], label: 'Series 6' },
        { data: [0, 0, 0, 0], label: 'Series 7' },
        { data: [0, 0, 0, 0], label: 'Series 8' },
        { data: [0, 0, 0, 0], label: 'Series 9' },
        { data: [0, 0, 0, 0], label: 'Series 10' },
    ];
    public radarChartType: string = 'radar';

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }


    public cpuUsage: number = 0;
    // disco 
    public pieChartLabels: string[] = ['Libre', 'Usado'];
    public pieChartData: number[] = [0, 0];
    public pieChartType: string = 'pie';
    private diskSize: number = 0;

    //Buttons
    public values: any = {
        comments: 0.125,
        replies: 0.125,
        favorites: 0.125,
        mentions: 0.125,
        hashtags: 0.25,
        urls: 0.25
    };
    public delay: any = {
        seconds: 5,
        quantity: 0.005,
    };

    constructor(private SocketService: SocketService, private CorrelationService: CorrelationService) { }

    ngOnInit() {
       
        this.CorrelationService.getPearson().subscribe(data => {
            console.log('lawea', data);
        });
        // this.SocketService.getTweets().subscribe(
        //     (tweet) => {

        //         // if (tweet.item.data.retweet.retweet_count < 30000) {
        //         //     return;
        //         // } 
        //         // if (Array.isArray(tweet.item.data.retweet.entities.urls) && !tweet.item.data.retweet.entities.urls.length) {
        //         //     return;
        //         // }  
        //         console.log('adasdadad-list',tweet);         
        //         switch (tweet.id) {
        //             case ('new-tweet'):
        //                 // if (this.tweets.length > 10) {
        //                 //     this.tweets.pop();
        //                 // }
        //                 // this.tweets.unshift(tweet.item.data);
        //                 break;
        //             case ('new-list'):

        //                 this.tweetList = tweet.data.list.map(t => {
        //                     t.radarChartData = [{
        //                         data: [
        //                             t.normRetweet.toFixed(3),
        //                             t.normReply.toFixed(3),
        //                             t.normFavorite.toFixed(3),
        //                             t.normQuote.toFixed(3)
        //                         ],
        //                         label: 'Normalized: ' + t.normTotal.toFixed(3)
        //                     }];
        //                     return t;
        //                 });
        //                 let tempData = [];
        //                 tweet.data.list.forEach((t, index) => {
        //                     tempData.push({
        //                         data: [
        //                             t.normRetweet.toFixed(3),
        //                             t.normReply.toFixed(3),
        //                             t.normFavorite.toFixed(3),
        //                             t.normQuote.toFixed(3)
        //                         ],
        //                         label: index + 1 + ''
        //                     });
        //                     // t.radarChartData = [
        //                     //     { data: [t.normRetweet, t.normReply, t.normFavorite, t.normQuote], label: 'Normalized: ' + t.normTotal },
        //                     // ]
        //                     // return t;
        //                 });
        //                 this.radarChartData = tempData;
        //                 break;
        //             case ('reply-list'):
        //                 console.log('reply-list', tweet);
        //                 break;

        //         }
        //     });
        this.SocketService.getTweetsList().subscribe(
            (data) => {
                let temp = [];
                let position = 0;
                console.log('list', data);
                switch (data.where) {
                    case ('RP'):
                        position = 0;
                        this.replies = data.list;
                        break;
                    case ('RT'):
                        position = 1;
                        this.retweets = data.list;
                        break;
                    case ('FV'):
                        position = 2;
                        this.favorites = data.list;
                        break;
                    case ('QT'):
                        position = 3;
                        this.quotes = data.list;
                        break;
                    case ('ND'):
                        position = 4;
                        this.normalized = data.list;
                    case ('NT'):
                        position = 5;
                        this.fullNormalized = data.list;
                    default:
                        break;
                }
                for (let i = 0; i < data.list.length; i++) {
                    // console.log(i, position, this.radarChartData[i].data[position])
                    this.radarChartData[i].data[position] = data.list[i].normValue;
                }
                // this[data.where] = data.list.map(t => {
                //     // t.radarChartData = [{
                //     //     data: [
                //     //         t.normRetweet.toFixed(3),
                //     //         t.normReply.toFixed(3),
                //     //         t.normFavorite.toFixed(3),
                //     //         t.normQuote.toFixed(3)
                //     //     ],
                //     //     label: 'Normalized: ' + t.normTotal.toFixed(3)
                //     // }];
                //     return t;
                // });
            }
        )
        this.SocketService.getStaticSystemInfo().subscribe(system => {
            console.log('sysa', system.data)
            this.system = system.data;
            this.diskSize = system.data.diskLayout[0].size / (1024 * 1024);
            this.barChartLabels = new Array(system.data.cpu.cores).fill(undefined).map((x, index) => '' + (index + 1));
            console.log('adad', this.barChartLabels);
        })

        this.SocketService.getDinamicSystemInfo().subscribe(system => {
            // console.log(system);
            // Procesador
            let tempData = [
                { data: this.barChartData[1].data, label: this.barChartData[0].label },
                { data: system.data[2].cpus.map(c => parseInt(c.load)), label: this.barChartData[1].label }
            ]
            this.barChartData = tempData;
            this.cpuUsage = parseInt(system.data[2].currentload);
            // Disco
            let used = 0;
            system.data[3].forEach(d => {
                used += d.used;
            });
            used = used / (1024 * 1024);
            // this.pieChartLabels = [ parseInt(system.data[3][0].use)', 'Usado: ' + parseInt(100 - system.data[3][0].use) + '%']
            // this.diskUsage = parseInt(system.data[3][0].use);
            this.pieChartData = [this.diskSize - used, used]
        });
    }
    ngOnDestroy() {

    }
    // getCorrelations() {
    //     this.SocketService.getPearsonCorrelation().subscribe(data => {
    //         console.log('adadad', data);
    //     });
    //     this.SocketService.getSpearmanCorrelation().subscribe(data => {
    //         console.log('adadad', data);
    //     });
    // }
}