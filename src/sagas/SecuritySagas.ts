import {all, call, put, takeEvery} from 'redux-saga/effects';
import Auth from "@aws-amplify/auth";
import {createLoggedOffEvent, REQUESTED_LOGOFF} from "../events/SecurityEvents";

function* logoffSaga() {
  yield put(createLoggedOffEvent())
  yield call(() => Auth.signOut());
}

function* userSagas() {
  yield takeEvery(REQUESTED_LOGOFF, logoffSaga)
}

export default function* (): Generator {
  yield all([userSagas()]);
}
