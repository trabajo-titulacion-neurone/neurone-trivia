import { Component, OnInit , ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GamificationService } from 'src/app/services/game/gamification.service';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private router: Router, private gamificationService: GamificationService, private toastr: ToastrService, private translate: TranslateService) { }

  StudioSelected;
  gamified: false;
  connected: false;

  ngOnInit(): void {
    this.checkPath();
    this.gamificationStatus();
  }

  CreateStudy(){
    this.router.navigate(['create/study']);
  }
  CreateChallenge(){
    this.router.navigate(['create/challenge']);
  }
  studySelectedHandler(event){
    this.StudioSelected = true;
    this.router.navigate([event]);
  }

  gamificationStatus(){
    this.gamificationService.gamificationStatus().subscribe(
      response => {
        this.gamified = response.gamified;
        this.connected = response.connected;
      },
      err => {
        console.log(err)
      }
    );
  }

  gamify(){
    this.gamificationService.gamify().subscribe(
      response => {
        console.log(response);
        this.gamificationService.gamifyDependent().subscribe(
          response2 => {
            console.log(response2);
            this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE"), this.translate.instant("STUDY.TOAST.SUCCESS"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
            this.gamificationStatus();
          },
          err => {
            console.log(err)
          }
        );
      },
      err => {
        console.log(err)
      }
    );
  }

  checkPath(){
    let path= this.router.url;
    console.log('path', path);
    if(path!= '/admin_panel'){
      console.log('in study');
      this.StudioSelected = true;
    }else{
      this.StudioSelected= false;
    }
  }
}
