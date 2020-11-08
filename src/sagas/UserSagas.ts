import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import Auth from "@aws-amplify/auth";
import {createReceivedUserProfileEvent} from "../events/UserEvents";
import {selectRouterState, selectUserState} from "../reducers";
import {push} from "connected-react-router";

function* userProfileFetchSaga() {
  const {profile} = yield select(selectUserState)
  if (profile) return;

  try {
    const userProfile = yield call(() => Auth.currentUserInfo());
    yield put(createReceivedUserProfileEvent(userProfile))
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* navigateToDashboard() {
  const {location: {pathname}} = yield select(selectRouterState)
  if (pathname !== '/oauth/callback/') return;

  yield put(push('/'))

}

function* userSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, userProfileFetchSaga)
  yield takeEvery(INITIALIZED_APPLICATION, navigateToDashboard)
}

export default function* (): Generator {
  yield all([userSagas()]);
}
