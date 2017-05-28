import Ember from 'ember';
import truthConvert from '../utils/truth-convert';

export function not(params) {
  for (var i=0, len=params.length; i<len; i++) {
    if (truthConvert(params[i]) === true) {
      return false;
    }
  }
  return true;
}

export default Ember.Helper.helper(not);
