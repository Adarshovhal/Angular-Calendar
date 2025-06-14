import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { startOfDay, endOfDay, isSameMonth, isSameYear, addDays, startOfWeek, isPast, isToday, isFuture, isWeekend } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { WeekDay } from 'calendar-utils';
import { CommonModule, formatDate } from '@angular/common';
import { NgbDateAdapter, NgbDropdownModule, NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports:[
    CommonModule, 
    FormsModule,
    NgbDropdownModule,
    CalendarModule,
    NgbModalModule,
    MatDatepickerModule, 
    MatNativeDateModule
  ],  
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter }, // Provide DateAdapter
    { provide: MAT_DATE_FORMATS, useValue: { display: { dateInput: 'input' } } },  // Define your date format
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },  // Optional: Set locale for date
  ]
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnChanges {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  selectedEventType: string = 'AllEvents'; // Default to "All Events"
  selectedDate: Date = new Date(); // Example selected date
  @Input() config: any = {
    eventColors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFFF33'],
    backgroundColor: '#fafafa', 
    modalHeaderColor: '#f1f1f1',
    modalTitle: 'Custom Events Modal',
    name: 'name',
    startText: 'Event Start',
    endText: 'Event End',
    removeText: 'Delete Event',
    deleteText: 'Delete',
    monthViewClass: 'custom-month-view',
    weekViewClass: 'custom-week-view',
    dayViewClass: 'custom-day-view',
  };
  @Input() data: any = {};

  defaultData= {
    view: CalendarView.Month,
    viewDate: new Date(),
    events: [
      { name: 'Holiday', start: new Date('2024-12-25'), end: new Date('2024-12-25'), meta: { type: 'Holiday' }, color: 'red' },
      { name: 'Doctor Appointment', start: new Date('2024-12-20'), end: new Date('2024-12-20'), meta: { type: 'Appointment' }, color: 'blue' },
      { name: 'Sample Event', start: new Date(), end: new Date(), meta: { type: 'Events' }, color: 'red' },
    { name: 'Doctor', start: new Date(), end: new Date(), meta: { type: 'Appointment' }, color: 'blue' },
    { name: 'Team Meeting', start: new Date(), end: new Date(), meta: { type: 'Meeting' }, color: 'green' },
    ],
    selectedDateEvents: [],
    activeDayIsOpen: false,
  };
  
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('eventModal') eventModal!: TemplateRef<any>;
  @ViewChild('monthHeaderTemplate', { static: true }) monthHeaderTemplate!: TemplateRef<any>;

  get nativeElement() {
    return this.viewcontainer.element.nativeElement;
  }

  mergedData: any = {};

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  currentViewLabel: string = 'Month';
  viewDate: Date = new Date();
  selectedDateEvents: any[] = [];
  modalData: { action: string; event: CalendarEvent } = { action: '', event: {} as CalendarEvent };

  refresh = new Subject<void>();
  events!: CalendarEvent[];
  days: WeekDay[] = [];
  locale: string = 'en-US';
  activeDayIsOpen: boolean = false;
  loading: boolean | undefined;


  getEventsByType(type: string): CalendarEvent[] {
    return this.events?.filter((event) => event.meta?.type === type);
  }
  eventTypes: { id: number; type: string }[] = [
    { id: 1, type: 'DaySpecial' },
    { id: 2, type: 'Birthday' },
    { id: 3, type: 'Anniversary' },
    { id: 4, type: 'Events' },
    { id: 5, type: 'Appointment' },
    { id: 6, type: 'Webinar' },
    { id: 7, type: 'MasterClass' },
    { id: 8, type: 'Meeting' },
    { id: 9, type: 'Holiday' },
  ];

  listenerAdded: any = false;

  constructor(private modal: NgbModal, private viewcontainer: ViewContainerRef, ) {
    console.log('CalendarComponent instantiated!');
  }

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['data']) {
      this.mergeData();
    }
  }

  mergeData() {
    // const marge={
    //   events:this.data
    // }
    this.events = this.getEventsByType('AllEvents');
    this.mergedData = { 
      ...this.defaultData, 
      ...this.data,
      events: [
        ...(this.defaultData.events || []), 
        ...(this.data?.events || []),
        
      ],
      
    };
    
  }

  ngOnInit(): void {
    this.mergeData()
    
    //this.mergedConfig = { ...this.config };
   // this.mergedData = { ...this.data };
    this.events = this.mergedData.events || [];
    this.days = getISOWeekDays(); // Initialize days with short names
    this.getAppointments();

    // Initialize event meta if not present
    this.selectedDateEvents = this.selectedDateEvents.map((event) => {
      if (!event.meta) {
        event.meta = {}; // Initialize meta if not defined
        
      }
      return event;
    });
    
  }

  getAppointments() { 
    console.log("getAppointments call");
    

    setTimeout(() => {
      console.log("getAppointments called");

      const customEvent = new CustomEvent('requestData', {
        bubbles: true,
        cancelable: true,
        detail: { 
          data: {
            dataModel: "appointments",
            dataParams: '{}',
          } 
        }
      });

      this.viewcontainer.element.nativeElement.dispatchEvent(customEvent);

      if (!this.listenerAdded) {
        const responseHandler = (event: any) => {
          // console.log('Received response:', event.detail.res);

          // Convert start and end properties to Date objects
          const formattedEvents = event.detail.res.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
            meta: { type: event.type },
            
            
          }));
          
          if (!this.data) {
            this.data = { events: [] };
          } else if (!this.data.events) {
            this.data.events = [];
          }

          this.data.events.push(...formattedEvents);
          this.events = [...this.data.events];
          this.refresh.next();
          console.log("Saved events", this.events);
        };

        this.viewcontainer.element.nativeElement.addEventListener('responseData', responseHandler);
        this.listenerAdded = true;
      }
    }, 1500);
}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      this.selectedDateEvents = events;
      if (events.length > 0) {
        this.modal.open(this.eventModal, { size: 'lg' });
      }
    }
  }

  openEventModal(): void {
    
    this.selectedDateEvents = this.events.filter((event) =>
      isSameMonth(event.start, this.viewDate) && isSameYear(event.start, this.viewDate)
    );

    this.modal.open(this.eventModal, { size: 'lg' });
  }

  // Method to set the selected event type
    setEventType(eventType: string): void {
      console.log('Before Filtering:', this.selectedDateEvents);
      
      this.selectedEventType = eventType;
      this.selectedDateEvents = this.events.filter(event => event.meta?.type === this.selectedEventType);
      
      console.log('After Filtering:', this.selectedDateEvents);
      
    }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.refresh.next();
  }

  setView(view: CalendarView, label: string): void {
    this.view = view;
    this.currentViewLabel = label;
    this.refresh.next();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}

// Helper function to get an array of dates for each day of the week
function getISOWeekDays(): WeekDay[] {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // Start on Sunday
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    return {
      date,
      day: shortDays[i], // 'Sun', 'Mon', etc.
      isPast: isPast(date),
      isToday: isToday(date),
      isFuture: isFuture(date),
      isWeekend: i === 0 || i === 6 // Sunday or Saturday
    } as unknown as WeekDay;
  });
  
  
}