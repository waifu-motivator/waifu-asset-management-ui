import {all} from 'redux-saga/effects';
import UserSagas from "./UserSagas";
import SecuritySagas from "./SecuritySagas";
import VisualAssetsSagas from "./VisualAssetsSagas";
import MotivationAssetSagas from "./MotivationAssetSagas";
import CharacterSourceSagas from "./CharacterSourceSagas";
import AudibleAssetsSagas from "./AudibleAssetsSagas";

export default function* rootSaga(): Generator {
  yield all([
    UserSagas(),
    SecuritySagas(),
    VisualAssetsSagas(),
    AudibleAssetsSagas(),
    MotivationAssetSagas(),
    CharacterSourceSagas(),
  ]);
}
