import {
  ActionCreatorWithOptionalPayload,
  ActionCreatorWithPayload,
  createAction
} from '@reduxjs/toolkit';

export type TWsStatus = 'offline' | 'connecting' | 'online';

export type TWsActions = {
  connect: ActionCreatorWithPayload<string, string>;
  disconnect: ActionCreatorWithOptionalPayload<undefined, string>;
  connecting: ActionCreatorWithOptionalPayload<undefined, string>;
  open: ActionCreatorWithOptionalPayload<undefined, string>;
  close: ActionCreatorWithOptionalPayload<undefined, string>;
  error: ActionCreatorWithPayload<string, string>;
  message: ActionCreatorWithPayload<string, string>;
};

export const feedWsActions: TWsActions = {
  connect: createAction<string>('feed/wsConnect'),
  disconnect: createAction('feed/wsDisconnect'),
  connecting: createAction('feed/wsConnecting'),
  open: createAction('feed/wsOpen'),
  close: createAction('feed/wsClose'),
  error: createAction<string>('feed/wsError'),
  message: createAction<string>('feed/wsMessage')
};

export const profileOrdersWsActions: TWsActions = {
  connect: createAction<string>('profileOrders/wsConnect'),
  disconnect: createAction('profileOrders/wsDisconnect'),
  connecting: createAction('profileOrders/wsConnecting'),
  open: createAction('profileOrders/wsOpen'),
  close: createAction('profileOrders/wsClose'),
  error: createAction<string>('profileOrders/wsError'),
  message: createAction<string>('profileOrders/wsMessage')
};
