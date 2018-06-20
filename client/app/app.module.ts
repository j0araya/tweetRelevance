// Angular CORE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
// Plugins
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCard } from '@angular/material';
import { MatListModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';
import { MatFormFieldModule, MatInputModule, MatStepperModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';


import { MatIconModule } from '@angular/material/icon';

// Main Components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstallComponent } from './install/install.component';
import { ModuleComponent } from './module/module.component';
import { ModuleChatComponent } from './module/module-chat/module-chat.component';
import { ModuleNoneComponent } from './module/module-none/module-none.component';
import { ModuleDiscussionsComponent } from './module/module-discussions/module-discussions.component';
import { ModuleNotesComponent } from './module/module-notes/module-notes.component';
import { ModulePollsComponent } from './module/module-polls/module-polls.component';
import { ModuleHelpCenterComponent } from './module/module-help-center/module-help-center.component';
import { PreviewComponent } from './preview/preview.component';
import { PreviewDiscussionsComponent } from './preview/preview-discussions/preview-discussions.component';
import { PreviewNoneComponent } from './preview/preview-none/preview-none.component';
import { SocketService } from './service/socket/socket.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TweetComponent } from './tweet/tweet.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { CorrelationService } from './service/correlation/correlation.service';




// Routes
const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
            title: 'Dashboard',
            wrap: 'dashboard',
            wrapper: 'dashboard'
        }
    },
    {
        path: 'install',
        component: InstallComponent,
        data: {
            title: 'Install',
            wrap: 'install',
            wrapper: 'install'
        }
    },
    {
        path: 'preview',
        component: PreviewComponent,
        data: {
            title: 'Preview',
            wrap: 'preview',
            wrapper: 'preview'
        },
        children: [
            {
                path: 'discussions',
                component: PreviewDiscussionsComponent
            },
            {
                path: '',
                component: PreviewNoneComponent
            }
        ]
    },
    {
        path: 'module',
        component: ModuleComponent,
        data: {
            title: 'Modules',
            wrap: 'modules',
            wrapper: 'dashboard'
        },
        children: [
            {
                path: 'chat',
                component: ModuleChatComponent
            },
            {
                path: 'discussions',
                component: ModuleDiscussionsComponent
            },
            {
                path: 'notes',
                component: ModuleNotesComponent
            },
            {
                path: 'polls',
                component: ModulePollsComponent
            },
            {
                path: 'help_center',
                component: ModuleHelpCenterComponent
            },
            {
                path: '',
                component: ModuleNoneComponent
            }
        ]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
];


// NgModule
@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ModuleComponent,
        PageNotFoundComponent,
        ModuleChatComponent,
        ModuleNoneComponent,
        ModuleDiscussionsComponent,
        ModuleNotesComponent,
        ModulePollsComponent,
        ModuleHelpCenterComponent,
        InstallComponent,
        PreviewComponent,
        PreviewDiscussionsComponent,
        PreviewNoneComponent,
        TweetComponent,
        TweetListComponent
    ],
    imports: [
        Angular2FontawesomeModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        // HttpModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatListModule,
        MatCardModule,
        MatGridListModule,
        MatTabsModule,
        ChartsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        ReactiveFormsModule,
    ],
    providers: [SocketService, CorrelationService],
    bootstrap: [AppComponent]
})
export class AppModule { }
