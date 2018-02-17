import { hasRefreshToken } from '../Storage/UserToken';

const initialState = {
  firstVisit: !hasRefreshToken(),
};

export default (state = initialState) => state;
