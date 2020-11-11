import {HasId, StringDictionary} from "../types/SupportTypes";


export const dictionaryReducer = <T extends HasId>(
  accum: StringDictionary<T>,
  toIndex: T,
): StringDictionary<T> => {
  accum[toIndex.id] = toIndex;
  return accum;
};
