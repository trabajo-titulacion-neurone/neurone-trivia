import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';

import { AppComponent } from './app.component';
import { QuestionBarComponent } from './components/question-bar/question-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './views/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { StartComponent } from './views/start/start.component';
import { SearchComponent } from './views/search/search.component';
import { SearchResultComponent } from './views/search-result/search-result.component';
import { EndpointsService } from './services/endpoints/endpoints.service';
import { ViewPageComponent } from './views/view-page/view-page.component';
import { SafeurlPipe } from './services/safeurl/safeurl.pipe';
import { SessionComponent } from './views/session/session.component';
import { InitialQuestionaryComponent } from './views/initial-questionary/initial-questionary.component';
import { PreTestQuestionaryComponent } from './views/pre-test-questionary/pre-test-questionary.component';
import { PostTestQuestionaryComponent } from './views/post-test-questionary/post-test-questionary.component';
import { QuestionaryComponent } from './views/questionary/questionary.component';
import { ResourcesUploadComponent } from './views/resources-upload/resources-upload.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { ChallengeCreationComponent } from './views/challenge-creation/challenge-creation.component';
import { UploadComponent } from './views/upload/upload.component';
import { CreationComponent } from './views/creation/creation.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    QuestionBarComponent,
    HeaderComponent,
    LoginComponent,
    StartComponent,
    SearchComponent,
    SearchResultComponent,
    ViewPageComponent,
    SafeurlPipe,
    SessionComponent,
    InitialQuestionaryComponent,
    PreTestQuestionaryComponent,
    PostTestQuestionaryComponent,
    QuestionaryComponent,
    ResourcesUploadComponent,
    StudyCreationComponent,
    ChallengeCreationComponent,
    UploadComponent,
    CreationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AppRoutingModule,
  ],
  providers: [EndpointsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
