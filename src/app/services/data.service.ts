import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BoardModel } from '../models/board.model';
import { IBoard } from '../models/interfaces/board.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getExampleBoards$(): Observable<BoardModel[]> {
    return this.http.get<IBoard[]>('assets/example-boards.json').pipe(
      map((list) => {
        return list.map((item) => new BoardModel().deserialize(item));
      }),
    );
  }
}
