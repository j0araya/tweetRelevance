// Angular CORE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
import { RouterModule, Routes }   from '@angular/router';
// Plugins
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

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
        PreviewNoneComponent
    ],
    imports: [
        Angular2FontawesomeModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        BrowserModule,
        FormsModule,
        MatButtonModule, 
        MatCheckboxModule,
    ],
    providers: [SocketService],
    bootstrap: [AppComponent]
})
export class AppModule { }
