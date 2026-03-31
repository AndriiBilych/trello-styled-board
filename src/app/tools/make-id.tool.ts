import { IBoard } from '../models/interfaces/board.interface';

export function makeId(length: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(
      Math.floor(Math.random() * (charactersLength - 1)),
    );
    counter += 1;
  }
  return result;
}

export function newBoardId(boards: IBoard[]): number {
  if (!boards?.length) {
    return 0;
  }

  return (
    Number(
      boards?.reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id,
    ) + 1
  );
}
