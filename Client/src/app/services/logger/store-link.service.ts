import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreLinkService {

  visitedLinkUri = environment.apiURL + 'visitedLink'

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Save visited link
  postVisitedLink(data) {
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      if(this.authService.getUser().study){
        data.studyId = this.authService.getUser().study;
      }
      if(localStorage.getItem('chall')){
        data.challengeId = localStorage.getItem('chall');
      }
      this.http.post(this.visitedLinkUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }
}
