import {all, call, put, takeEvery, select} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import Auth from "@aws-amplify/auth";
import {createReceivedUserProfileEvent} from "../events/UserEvents";
import {selectUserState} from "../reducers";

function* userProfileFetchSaga() {
  const {profile} = yield select(selectUserState)
  if(profile) return;

  try {
    const userProfile = yield call(() => Auth.currentUserInfo());
    yield put(createReceivedUserProfileEvent(userProfile))
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* userSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, userProfileFetchSaga)
}

export default function* (): Generator {
  yield all([userSagas()]);
}
