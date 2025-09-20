import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-add-task',
  template: `
    <div class="h-full flex items-center">
      <input
        #input
        name="input"
        class="rounded text-sm w-140"
        type="text"
        [(ngModel)]="textToShow"
        (keyup.enter)="submit()"
      />
      <button
        #button
        (click)="submit()"
        class="flex items-center text-sm font-semibold leading-6 hover:bg-blue-100 hover:text-gray-500
              transition py-3.5 px-4 rounded cursor-pointer"
      >
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="h-3"
        >
          <path
            fill="currentColor"
            d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          ></path>
        </svg>
      </button>
    </div>
  `,
})
export class AddTaskComponent implements AfterViewInit {
  @Output() textSubmissionAction = new EventEmitter();
  @Input() textToShow: string;

  @ViewChild('input') inputRef: ElementRef;

  @HostListener('document:keydown.escape')
  onKeyUpEscape() {
    this.submit();
  }

  ngAfterViewInit(): void {
    this.inputRef.nativeElement.focus();
  }

  submit(): void {
    this.textSubmissionAction.emit({ text: this.textToShow ?? '', keep: true });
    this.textToShow = '';
  }
}
