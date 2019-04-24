import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as messages from "../../../ActionsAndReducers/dbMessages/messages_ActionCreators";
import * as messagesApi from "../../../api/messages_api";
import machineryFailure from "../../../schemas/machinery_failure.json";
import ActionConstant from "../../../ActionsAndReducers/ActionConstants";
import {messagesReducer} from "../../../ActionsAndReducers/dbMessages/messages_Reducer";

const mockStore = configureStore([thunk]);


describe('message actions', () => {

  beforeEach(() => {
    messagesApi.addMessage = jest.fn(() => {
      return {
        ok: true,
        _id: 'id',
        _rev: 'revision1',
      }
    });
    messagesApi.getAllMessagesFromDb = jest.fn(() => {
      return [{message: 'message'}]
    });
    messagesApi.duplicateMessageInDb = jest.fn(() => {
      return true;
    });
    messagesApi.updateMessageInDb = jest.fn(() => {
      return {
        ok: true,
        _id: 'id',
        _rev: 'revision1',
      }
    });
    messagesApi.getMessage = jest.fn(() => {
      return {};
    });
    messagesApi.deleteMessageFromDb = jest.fn(() => {
      return {
        ok: true,
        _id: 'id',
        _rev: 'revision1',
      }
    });
  });

  var message = {
    Date: "2019-04-18T18:18",
    Description: "description",
    Status: "Minor",
    title: "Test"
  };

  it('fetches all messages ActionConstant.DB_MESSAGE_SAVED after successful save', async () => {

    const expectedActions = [
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: true },
      { type:  ActionConstant.DB_MESSAGE_STATUS,
        payload: {
          "_id": "id",
          "_rev": "revision1",
          "ok": true,
        },
      },
      { type: ActionConstant.DB_MESSAGE_SAVED, payload: [{message: 'message'}] },
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: false },
      { type: ActionConstant.SET_CURRENT_VIEW_FROM_URI, payload: "/umpireMenu/library"}
    ];

    const store = mockStore({});

    return store.dispatch(messages.createMessage(message, machineryFailure)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('duplicates a message ActionConstant.DB_MESSAGE_SAVED after successful duplication', async () => {

    const expectedActions = [
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: true },
      { type:  ActionConstant.DB_MESSAGE_STATUS,
        payload: true,
      },
      { type: ActionConstant.DB_MESSAGE_SAVED, payload: [{message: 'message'}] },
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(messages.duplicateMessage('fakeId')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('updates a message and ActionConstant.DB_MESSAGE_SAVED after successful save', async () => {

    const expectedActions = [
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: true },
      { type:  ActionConstant.DB_MESSAGE_STATUS,
        payload: {
          "_id": "id",
          "_rev": "revision1",
          "ok": true,
        },
      },
      { type: ActionConstant.DB_RETURNED_MESSAGE, payload: {} },
      { type: ActionConstant.DB_MESSAGE_SAVED, payload: [{message: 'message'}] },
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: false },
      { type: ActionConstant.SET_CURRENT_VIEW_FROM_URI, payload: "/umpireMenu/library"}
    ];

    const store = mockStore({});

    return store.dispatch(messages.updateMessage(message, 'fakeId')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('deletes a message and ActionConstant.RESET_MESSAGE_STATUS after successful save', async () => {

    const expectedActions = [
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: true },
      { type: ActionConstant.DB_MESSAGE_SAVED, payload: [{message: 'message'}] },
      { type: ActionConstant.RESET_MESSAGE_PREVIEW },
      { type: ActionConstant.DB_MESSAGE_CREATION_LOADING, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(messages.deleteMessage('fakeId')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  it('gets a message and ActionConstant.RESET_MESSAGE_STATUS after successful save', async () => {

    const expectedActions = [
      { type: ActionConstant.DB_MESSAGES_GET, isLoading: true },
      { type: ActionConstant.DB_RETURNED_MESSAGE, payload: {} },
      { type: ActionConstant.DB_MESSAGES_GET, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(messages.getSingleMessage('fakeId')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('gets all messages and ActionConstant.RESET_MESSAGE_STATUS after successful save', async () => {

    const expectedActions = [
      { type: ActionConstant.DB_MESSAGES_GET, isLoading: true },
      { type: ActionConstant.DB_MESSAGE_SAVED, payload: [{message: 'message'}] },
      { type: ActionConstant.DB_MESSAGES_GET, isLoading: false },
    ];

    const store = mockStore({});

    return store.dispatch(messages.getAllMessages()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('messages reducer', () => {

  it('should set isLoading to true', () => {

    const action = {
      type: ActionConstant.DB_MESSAGES_GET,
      isLoading: true
    };

    expect(messagesReducer({isLoading: false}, action)).toEqual({
      isLoading: true,
    });
  });

  it('should save messages to store', () => {

    const action = {
      type: ActionConstant.DB_MESSAGE_SAVED,
      payload: ["test"]
    };

    expect(messagesReducer({messages: []}, action)).toEqual({
      messages: ["test"],
    });
  });

  it('should save messages to store', () => {

    const action = {
      type: ActionConstant.DB_RETURNED_MESSAGE,
      payload: ["test"]
    };

    expect(messagesReducer({messages: []}, action)).toEqual({
      messages: ["test"],
    });
  });
});
