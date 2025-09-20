import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
  themes: { colors: { key: string; value: string }[]; title: string }[] = [];

  constructor() {}

  ngOnInit(): void {
    this.themes = [
      {
        colors: [
          {
            key: '--main',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--main',
            ),
          },
          {
            key: '--button',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--button',
            ),
          },
          {
            key: '--background',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--background',
            ),
          },
          {
            key: '--highlighted',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--highlighted',
            ),
          },
          {
            key: '--text',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--text',
            ),
          },
          {
            key: '--modalBackground',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--modalBackground',
            ),
          },
          {
            key: '--grayed',
            value: getComputedStyle(document.documentElement).getPropertyValue(
              '--grayed',
            ),
          },
        ],
        title: 'Default',
      },
      {
        colors: [
          { key: '--main', value: 'rgba(217, 201, 195, 0.53)' },
          { key: '--button', value: '#E8E2DB' },
          { key: '--background', value: '#d48a2a' },
          { key: '--highlighted', value: 'rgb(212, 138, 42)' },
          { key: '--text', value: '#272727' },
          { key: '--modalBackground', value: '#fff' },
          { key: '--grayed', value: 'rgba(68, 70, 71, 0.74)' },
        ],
        title: 'Funky',
      },
      {
        colors: [
          { key: '--main', value: 'rgba(223, 231, 234, 0.11)' },
          { key: '--button', value: '#191919' },
          { key: '--background', value: '#2b3135' },
          { key: '--highlighted', value: 'rgb(53, 55, 56)' },
          { key: '--text', value: '#cccbca' },
          { key: '--modalBackground', value: '#2b3135' },
          { key: '--grayed', value: 'rgba(230, 238, 241, 0.55)' },
        ],
        title: 'Dark',
      },
    ];
  }

  getBackgroundColor(colors: { key: string; value: string }[]): string {
    return colors.find((color) => color.key === '--background').value;
  }

  changeColors(i): void {
    this.themes[i].colors.forEach((_) =>
      document.documentElement.style.setProperty(_.key, _.value),
    );
  }
}
