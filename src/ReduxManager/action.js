export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const loginUser = (data) => {
  return {
    type: LOGIN,
    payload: data,
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT,
  };
};