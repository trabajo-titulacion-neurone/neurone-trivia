import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Questionnaire, QuestionnaireService } from '../../services/game/questionnaire.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from 'src/app/services/game/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-study-questionnaire',
  templateUrl: './post-study-questionnaire.component.html',
  styleUrls: ['./post-study-questionnaire.component.css']
})
export class PostStudyQuestionnaireComponent implements OnInit {
  questionnaireForm: FormGroup;
  values: number[] = [1, 2, 3, 4, 5, 6];
  questionnaires: Questionnaire[];
  requiredType: string = 'post-study';
  isLoggedIn = false;
  user: any;

  constructor(private formBuilder: FormBuilder,
              private questionnaireService: QuestionnaireService,
              private authService: AuthService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private gameService: GameService,
              public router: Router,
              private changeDetector: ChangeDetectorRef
              ) { }

  ngOnInit(): void {

    this.questionnaireForm = this.formBuilder.group({
      answers: new FormArray([])
    })

    this.questionnaireService.getQuestionnairesByType(this.requiredType)
    .subscribe(response => {
      this.questionnaires = response['questionnaires'];
      this.questionnaires.forEach(questionnaire => {
        for(var i=0; i<questionnaire.questions.length; i++){
          this.addAnswer();
        }
      });
      this.resetForm();
    });
    this.isLoggedIn = this.authService.loggedIn;
    this.user = this.authService.getUser();
    /*Dispatch poststudyquestionnaireenter event*/
    var evt = new CustomEvent('poststudyquestionnaireenter');
    window.dispatchEvent(evt);
    /*End dispatch poststudyquestionnaireenter event*/    
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }  

  get questionnaireFormControls(): any {
    return this.questionnaireForm['controls'];
  }

  addAnswer(): void {
    const answers = this.questionnaireForm.get('answers') as FormArray;
    answers.push(new FormControl(['', Validators.required]));
  }

  resetForm() {
    this.questionnaireForm.reset();
  }

  saveAnswers(){
    this.questionnaireService.postAnswers(this.user, this.questionnaires, this.questionnaireForm.value.answers, null, this.requiredType)
    .subscribe(async response => {
        this.toastr.success(this.translate.instant("QUESTIONNAIRE.POST_STUDY.TOAST.SUCCESS_MESSAGE"), this.translate.instant("QUESTIONNAIRE.POST_STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
          await this.gameService.finishPostStudy();
      },
      err => {
        this.toastr.error(this.translate.instant("QUESTIONNAIRE.POST_STUDY.TOAST.ERROR_MESSAGE"), this.translate.instant("QUESTIONNAIRE.POST_STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  ngOnDestroy(){
    /*Dispatch poststudyquestionnaireexit event*/
    var evt = new CustomEvent('poststudyquestionnaireexit');
    window.dispatchEvent(evt);
    /*End dispatch poststudyquestionnaireexit event*/    
  }  
}