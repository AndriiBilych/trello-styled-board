import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  template: `
    <div
      class="flex items-center justify-center min-h-screen bg-fixed bg-cover bg-bottom error-bg"
    >
      <div class="container">
        <div class="row">
          <div class="col-sm-8 offset-sm-2 text-center -mt-52">
            <div class="relative">
              <h1
                class="relative text-blue-100 text-9xl tracking-tighter-less text-shadow font-sans font-bold"
              >
                <span>4</span><span>0</span><span>4</span>
              </h1>
            </div>
            <h5 class="font-medium mt-3">Page not found</h5>
            <h5 class="mt-5">
              <a
                routerLink="/home"
                class="transition hover:bg-blue-100 hover:text-gray-500 px-5 py-3 text-sm font-semibold tracking-wider rounded"
              >
                Go to Home
              </a>
            </h5>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .tracking-tighter-less {
        letter-spacing: -0.75rem;
      }

      .text-shadow {
        text-shadow: -8px 0 0 rgba(243, 244, 246, 1);
      }
    `,
  ],
})
export class NotFoundPageComponent {}
