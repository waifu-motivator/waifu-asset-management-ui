import {all} from 'redux-saga/effects';
import UserSagas from "./UserSagas";
import SecuritySagas from "./SecuritySagas";

export default function* rootSaga(): Generator {
  yield all([
    UserSagas(),
    SecuritySagas(),
  ]);
}
