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
                if (tweet.item.data.retweet.retweet_count < 100000) {
                    return;
                }              
                switch (tweet.action) {
                    case ('new-tweet'):
                        if (this.tweets.length > 10) {
                            this.tweets.shift();
                        }
                        this.tweets.push(tweet.item.data);
                        break;
                }
            });
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