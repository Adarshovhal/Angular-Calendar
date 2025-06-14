import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Injector, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './app/calendar/calendar.component';
import { createCustomElement } from '@angular/elements';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
  imports: [
    BrowserModule, // Add BrowserModule here
    HttpClientModule, // Explicitly import HttpClientModule for HTTP services
    BrowserAnimationsModule, // Explicitly import BrowserAnimationsModule for animations
  ],
  providers: [],
})
class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const componentsToRegister = [
      { tag: 'app-calendar', component: CalendarComponent },
    ];

     // Initialize the global customElementsList if not already present
     if (!(window as any).customElementsList) {
      (window as any).customElementsList = [];
    }

    componentsToRegister.forEach(({ tag, component }) => {
      if (!customElements.get(tag)) {
        const element = createCustomElement(component, { injector: this.injector });
        customElements.define(tag, element);  // Define the custom element
        
        // Push registered component details into the customElementsList
        (window as any).customElementsList.push({ component: tag, componentClass: component });
      }
    });
  }
}

// Bootstrapping the module without needing a root component
platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));