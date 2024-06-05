import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-guide',
  template: `
    <span (click)="modal.style.display = 'block'">
      About
    </span>

    <div id="modal" class="modal">
      <div class="modal-content-container">
        <div class="modal-content">
          <button class="close" (click)="modal.style.display = 'none'">&times;</button>
          <div class="label">
            <h3>Description</h3>
          </div>

          <p class="description">
            <span>This website is a todo manager inspired by Trello</span>
            It resembles a frontend prototype of a board styled todo list, thus no database or backend server.
            Created with Angular 11. Feel free to browse provided examples of boards or create your own.
          </p>

          <div class="instructions">
            <div class="label">
              <h3>How to use</h3>
            </div>
            <ul>
              <li>Left click to drag tasks, lists or the board</li>
              <li>Right click to edit list/board titles or tasks</li>
            </ul>
          </div>

          <div class="footer">
            <div class="author">
              <div>Made by Andrii Bilych</div>
              <a href="https://www.linkedin.com/in/andrii-bilych-9b3232169/">LinkedIn</a>
              <a href="https://github.com/AndriiBilych">Github</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  modal: HTMLElement;

  @HostListener('document:mousedown', ['$event.target'])
  onClick(target): void {
    if (target.classList.contains('modal')) {
      this.modal.style.display = 'none';
    }
  }

  constructor() {
    this.modal = null;
  }

  ngOnInit(): void {
    this.modal = document.getElementById('modal');
  }
}
