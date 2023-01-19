import toast from 'react-hot-toast';
import { handleError } from '../helpers/loggingHandlers';

export const errorHandler = (e: Error) => {
  handleError(e);

  let message = e.message;

  if (e.message.length > 100) {
    message = e.message.substring(0, 100) + '...';
  }

  toast.error(message);
};
