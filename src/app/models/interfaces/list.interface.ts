import {TaskModel} from '../TaskModel';
import {TaskInterface} from './task.interface';

export interface ListInterface {
  tasks: TaskInterface[];
  title: string;
  // id: string;
  // order: number;

}