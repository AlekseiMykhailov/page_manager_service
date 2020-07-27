export const SET_STATUS_MESSAGE = 'SET_STATUS_MESSAGE';
export const REMOVE_STATUS_MESSAGE = 'REMOVE_STATUS_MESSAGE';

export const setStatusMessage = (status, text) => ({
  type: SET_STATUS_MESSAGE,
  status,
  text,
});

export const removeStatusMessage = () => ({
  type: REMOVE_STATUS_MESSAGE,
});
