import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { endOfDay, startOfDay } from 'date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { DOCUMENT } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
      NgbModalModule,
      HttpClientModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class  AppComponent {
  title = 'Calendar-Component';
    
  //   title = 'Calendar';
  //   loading: boolean = true;
  //   defaultData: any = {};
  //   mergedData: any = {};
  //   data: any = {};
  //   config: any = {};
  // router: any;

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params:any) => {
  //     if (params['env'] === 'domain') {
  //       this.router.navigate(['/calendar']);  
  //     } else {
  //       this.router.navigate(['/']);  
  //     }
  //   });
  // }
  // @ViewChild(CalendarComponent, { static: false }) child!: CalendarComponent;
  // ngAfterViewInit() {
  //   if (this.child && this.child.nativeElement) {
  //     this.addEvent();
  //   } else {
  //     console.error('Child component or nativeElement is not available');
  //   }
  // }
  // constructor(
  //   private http: HttpClient,
  //   @Inject(DOCUMENT) private document: Document,
  //   private route: ActivatedRoute
  // ){
      
  //   }

  // addEvent() {
  //   const eventHandlers = {
  //     requestData: (e: any) => {
  //       console.log('requestData event', e);
  //       this.http
  //         .get<any>('https://calendar.apnasite.in/api/appointments', {
  //           headers: {
  //             Authorization:
  //               'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTJiMjE2ZDAwZTZkMzU5YTk3OWNmZSIsImNvbXBhbnlJZCI6IjYzZTM1ZGY5YjE2N2FkZDk1NDExZTI1YyIsIm5hbWUiOiJWaWxhc0RldiIsImVtYWlsIjoidmlsYXNzaGV0a2FyQGdtYWlsLmNvbSIsInR5cGUiOiJDaXRpemVuIiwiY2F0ZWdvcnkiOiJVc2VyIiwiaWF0IjoxNzM4MzIwNTE3LCJleHAiOjE3Mzk2MTY1MTcsImlzcyI6ImZvcmVpZ25BZG1pdCJ9.Rm00eErhyJW6eW8VjgnZC5I3xJCDEho4B9j_XJDtzHk',
  //           },
  //         })
  //         .subscribe(
  //           (apiData: any) => {
  //             const customEvent = new CustomEvent('responseData', {
  //               bubbles: true,
  //               cancelable: true,
  //               detail: { res: apiData }
  //             });
  //             this.child.nativeElement.dispatchEvent(customEvent);
  //           }
  //         );
  //     }
  //   };
  //   console.log(this.child); // Debugging to check if child is available
  //   if (this.child) {
  //     this.child.nativeElement.addEventListener('requestData', eventHandlers.requestData);
  //   }
  // }
}
  