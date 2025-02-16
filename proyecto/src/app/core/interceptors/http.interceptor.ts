import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap } from "rxjs/operators";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  requestQueue = 0;

  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.requestQueue++ === 0) {
      this.spinner.show();
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (--this.requestQueue === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}
