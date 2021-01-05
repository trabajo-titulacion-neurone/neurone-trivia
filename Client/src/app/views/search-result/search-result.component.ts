import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  query: string;
  locale: string;
  task: string;
  domain: string;
  documents = [];
  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute, public router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.query = params.get('query');
        this.locale = params.get('locale');
        this.task = params.get('task');
        this.domain = params.get('domain');
      });
    this.endpointsService.getDocuments(this.query, this.locale, this.task, this.domain)
      .subscribe((data: []) => { // Success
        this.documents = data;
      },
      (error) => {
        console.error(error);
      });
  }

  search(){
    if(this.query !== ''){
      this.router.navigate(['session/search-result', this.query]);
    }
  }

}
