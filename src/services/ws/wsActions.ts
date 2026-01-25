import { createAction } from '@reduxjs/toolkit';

export type TWsStatus = 'offline' | 'connecting' | 'online';

type TNoPayload = (() => { type: string }) & {
  type: string;
  match: (action: unknown) => boolean;
};

type TWithPayload = ((payload: string) => { type: string; payload: string }) & {
  type: string;
  match: (action: unknown) => boolean;
};

export type TWsActions = {
  connect: TWithPayload;
  disconnect: TNoPayload;
  connecting: TNoPayload;
  open: TNoPayload;
  close: TNoPayload;
  error: TWithPayload;
  message: TWithPayload;
};

export const feedWsActions: TWsActions = {
  connect: createAction<string>('feed/wsConnect') as unknown as TWithPayload,
  disconnect: createAction('feed/wsDisconnect') as unknown as TNoPayload,
  connecting: createAction('feed/wsConnecting') as unknown as TNoPayload,
  open: createAction('feed/wsOpen') as unknown as TNoPayload,
  close: createAction('feed/wsClose') as unknown as TNoPayload,
  error: createAction<string>('feed/wsError') as unknown as TWithPayload,
  message: createAction<string>('feed/wsMessage') as unknown as TWithPayload
};

export const profileOrdersWsActions: TWsActions = {
  connect: createAction<string>(
    'profileOrders/wsConnect'
  ) as unknown as TWithPayload,
  disconnect: createAction(
    'profileOrders/wsDisconnect'
  ) as unknown as TNoPayload,
  connecting: createAction(
    'profileOrders/wsConnecting'
  ) as unknown as TNoPayload,
  open: createAction('profileOrders/wsOpen') as unknown as TNoPayload,
  close: createAction('profileOrders/wsClose') as unknown as TNoPayload,
  error: createAction<string>(
    'profileOrders/wsError'
  ) as unknown as TWithPayload,
  message: createAction<string>(
    'profileOrders/wsMessage'
  ) as unknown as TWithPayload
};
