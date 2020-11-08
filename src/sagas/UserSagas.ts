import {all} from 'redux-saga/effects';

function* startTimeSagas() {
  console.log("Hello I have been born!")
}

export default function*() {
  yield all([startTimeSagas()]);
}
