import {Action} from 'redux';

export interface BaseEvent extends Action<String> {}

export interface PayloadEvent<T> extends BaseEvent {
  payload: T;
}
