import { LOGIN, LOGOUT } from "./action";

const initialState = {
  isLogin: false,
  token: "",
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLogin: true,
        token: action.payload.token,
        user: action.payload.user,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default reducer;