import type { Middleware } from '@reduxjs/toolkit';
import type { TWsActions } from '../ws/wsActions';

export const socketMiddleware =
  (wsActions: TWsActions): Middleware =>
  () => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      if (wsActions.connect.match(action)) {
        if (socket) socket.close();
        next(wsActions.connecting());
        socket = new WebSocket((action as { payload: string }).payload);

        socket.onopen = () => next(wsActions.open());
        socket.onclose = () => next(wsActions.close());
        socket.onerror = () => next(wsActions.error('WebSocket error'));
        socket.onmessage = (event) => next(wsActions.message(event.data));

        return;
      }

      if (wsActions.disconnect.match(action)) {
        if (socket) socket.close();
        socket = null;
        next(wsActions.close());
        return;
      }

      return next(action);
    };
  };
