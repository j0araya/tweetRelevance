import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { MatListModule } from '@angular/material'
import { SocketService } from '../service/socket/socket.service';
import { MatCardModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';


@Component({
    selector: 'tr-tweet',
    inputs: ['tweet'],
    templateUrl: './tweet.component.html',
    styleUrls: ['./tweet.component.css'],
    providers: [SocketService]
})

export class TweetComponent implements OnInit, OnDestroy {
    public tweets = [];
    public tweetList = [];
    public system = {};
    public memUsage = {};
    public diskUsage = {};
    private connection;

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
    constructor(private SocketService: SocketService) { }

    ngOnInit() {
        this.SocketService.getTweets().subscribe(
            (tweet) => {
                console.log(tweet);
                // if (tweet.item.data.retweet.retweet_count < 30000) {
                //     return;
                // } 
                // if (Array.isArray(tweet.item.data.retweet.entities.urls) && !tweet.item.data.retweet.entities.urls.length) {
                //     return;
                // }           
                switch (tweet.item.id) {
                    case ('new-tweet'):
                        // if (this.tweets.length > 10) {
                        //     this.tweets.pop();
                        // }
                        // this.tweets.unshift(tweet.item.data);
                        break;
                    case ('new-list'):

                        this.tweetList = tweet.item.data.list.map(t => {
                            t.radarChartData = [{
                                data: [
                                    t.normRetweet.toFixed(3),
                                    t.normReply.toFixed(3),
                                    t.normFavorite.toFixed(3),
                                    t.normQuote.toFixed(3)
                                ],
                                label: 'Normalized: ' + t.normTotal.toFixed(3)
                            }];
                            return t;
                        });
                        let tempData = [];
                        tweet.item.data.list.forEach((t, index) => {
                            tempData.push({
                                data: [
                                    t.normRetweet.toFixed(3),
                                    t.normReply.toFixed(3),
                                    t.normFavorite.toFixed(3),
                                    t.normQuote.toFixed(3)
                                ],
                                label: index + 1 + ''
                            });
                            // t.radarChartData = [
                            //     { data: [t.normRetweet, t.normReply, t.normFavorite, t.normQuote], label: 'Normalized: ' + t.normTotal },
                            // ]
                            // return t;
                        });
                        this.radarChartData = tempData;

                }
            });
        this.SocketService.getTweetsList().subscribe(
            (tweet) => {
                console.log('list', tweet);
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
            console.log(system);
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
        // this.SocketService.getSystemInfo().subscribe(
        //     (system) => {
        //         console.log(system);
        //         switch (system.action) {
        //             case ('sys-info'):
        //                 console.log('sys-info', system);
        //                 this.system = system.data;
        //                 break;
        //             case ('new-sys-info'):
        //                 console.log('new-info', system);
        //                 break;
        //         }
        //     });
    }
    ngOnDestroy() {

    }
}