import {Action} from 'redux';

export type BaseEvent = Action<string>

export interface PayloadEvent<T> extends BaseEvent {
  payload: T;
}
