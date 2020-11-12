import {all} from 'redux-saga/effects';


function* syncObservationSagas() {
  console.tron("hmm time to do stuff")
}

export default function* (): Generator {
  yield all([syncObservationSagas()]);
}
