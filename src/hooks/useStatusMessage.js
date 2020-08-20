import { useDispatch } from 'react-redux';
import { removeStatusMessage, setStatusMessage } from 'src/actions/messageActions';
import * as CONST from 'src/utils/const';

// eslint-disable-next-line import/prefer-default-export
export const useStatusMessage = () => {
  const dispatch = useDispatch();

  const handlerStatusMessage = (
    response = {},
    successAction = () => {},
    successMessage = 'Success',
    errorMessage = 'Something went wrong...',
  ) => {
    if (!response) {
      return;
    }

    if (response.ok) {
      dispatch(setStatusMessage(CONST.SUCCESS, successMessage));
      if (successAction) {
        successAction();
      }
    } else {
      dispatch(setStatusMessage(CONST.ERROR, errorMessage));
    }

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  return [handlerStatusMessage];
};
