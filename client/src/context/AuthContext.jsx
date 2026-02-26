import React, { createContext, useEffect, useReducer } from "react";

// Initial state — safely read user from localStorage
const INITIAL_STATE = {
  user: (() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  })(),
  loading: false,
  error: null,
};

// Create context with proper default values
export const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  dispatch: () => {},
});

// Reducer
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

// Provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Store user in localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};