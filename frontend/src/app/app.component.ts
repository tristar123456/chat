import {Component, EventEmitter} from "@angular/core";

@Component({
  selector: `app-root`,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  toggleMenuEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.toggleMenuEvent.emit(true);
  }
}
