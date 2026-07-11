import { json } from "zod";
import { messageSchema, type MessageParsed } from "../schemas/websocket-message.schema";
import { partyService } from "../services/party.service";
import type { WebSocketMessage, WebSocketResponse } from "../types";

export const createErrorResponse = (error: string): WebSocketResponse => {
  return {
    type: "ERROR",
    payload: { error: error },
  };
};

// Specific handlers

const handleGetParties = (): WebSocketResponse => {
  return {
    type: "PARTIES_LIST",
    payload: partyService.getAll(),
  };
};

const handleAddParty = (payload: MessageParsed['payload']): WebSocketResponse => {
  if (!payload?.name || !payload?.color || !payload.borderColor) {
    return createErrorResponse("Name,color and borderColor are required");
  }

  const newParty = partyService.add(
    payload.name,
    payload.color,
    payload.borderColor,
  );
  return {
    type: "PARTY_ADDED",
    payload: newParty,
  };
};

const handleUpdateParty = (payload: MessageParsed['payload']): WebSocketResponse => {
  if (!payload?.id) {
    return createErrorResponse("Party ID is required");
  }
  const updateParty = partyService.update(payload.id, {
    name: payload.name,
    color: payload.color,
    borderColor: payload.borderColor,
    votes: payload.votes,
  });

  if (!updateParty) {
    return createErrorResponse(`Party with id: ${payload.id} not found`);
  }

  return {
    type: "PARTY_UPDATED",
    payload: updateParty,
  };
};

const handleDeleteParty = (payload: MessageParsed['payload']): WebSocketResponse => {
  if (!payload.id) {
    return createErrorResponse("Party ID is required");
  }

  const deletedParty = partyService.delete(payload.id);

  if (!deletedParty) {
    return createErrorResponse(`Party whit ${payload.id} not found or can't be deleted`);
  }
  return {
    type: "PARTY_DELETED",
    payload: deletedParty,
  };
};

const handleIncrementVotes = (payload: MessageParsed['payload']): WebSocketResponse => {
  if (!payload.id) {
    return createErrorResponse("Party ID is required");
  }

  const incrementedVotes = partyService.incrementVotes(payload.id);

  if(!incrementedVotes) return createErrorResponse(`Party with ${payload.id} not found`)
  return {
    type: "VOTES_UPDATED",
    payload: incrementedVotes,
  };
};
const handleDecrementVotes = ( { id }  : MessageParsed['payload']): WebSocketResponse => {

  if( !id) return createErrorResponse('Party ID is required');

  const decrementedVotes = partyService.decrementVotes(id);

  if (!decrementedVotes) return createErrorResponse(`Party with ${id} not found`)
  return {
    type: "VOTES_UPDATED",
    payload: decrementedVotes,
  };
};



export const handleMessage = (message: string): WebSocketResponse => {
  try {
    const jsonData = JSON.parse(message) as WebSocketMessage;
    const parsedResult = messageSchema.safeParse(jsonData);


    if( !parsedResult.success) {
      const errorMesage = parsedResult.error.issues.
      map(issue => issue.message).join(', ')

      return createErrorResponse(`Validation error ${errorMesage}`)
    }
 
    // Todo: Validate the json object

    const { type, payload } = parsedResult.data;

    switch (type) {
      case "GET_PARTIES":
        return handleGetParties();
      case "ADD_PARTY":
        return handleAddParty(payload);
      case "UPDATE_PARTY":
        return handleUpdateParty(payload);
      case "DELETE_PARTY":
        return handleDeleteParty(payload);
      case "INCREMENT_VOTES":
        return handleIncrementVotes(payload);
      case "DECREMENT_VOTES":
        return handleDecrementVotes(payload);

      default:
        return createErrorResponse(`Unknown message type: ${type}`);
    }
  } catch (error) {
    // Todo: Error
    return createErrorResponse(`Validation error`);
  }
};
