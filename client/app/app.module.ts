// Angular CORE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes }   from '@angular/router';

// Main Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ModuleChatComponent } from './module-chat/module-chat.component';
import { ModuleNoneComponent } from './module-none/module-none.component';
import { ModuleDiscussionsComponent } from './module-discussions/module-discussions.component';
import { ModuleNotesComponent } from './module-notes/module-notes.component';
import { ModulePollsComponent } from './module-polls/module-polls.component';
import { ModuleHelpCenterComponent } from './module-help-center/module-help-center.component';

// Plugins
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';


// Routes
const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
            title: 'Dashboard',
            wrap: 'dashboard',
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
    { path: '',
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
        PageNotFoundComponent,
        ModuleChatComponent,
        ModuleNoneComponent,
        ModuleDiscussionsComponent,
        ModuleNotesComponent,
        ModulePollsComponent,
        ModuleHelpCenterComponent
    ],
    imports: [
        NgbModule.forRoot(),
        Angular2FontawesomeModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
