import * as signalR from "@microsoft/signalr";

import config from "./config";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.hubUrl)
  .withAutomaticReconnect()
  .build();

// start once and keep the promise so callers can await it
const startPromise = connection.start();

// preserve original invoke
const originalInvoke = connection.invoke.bind(connection);

// override invoke to await startPromise (or try to start if it failed)
connection.invoke = async (...args) => {
  try {
    await startPromise;
  } catch (startErr) {
    // if initial start failed, try to start again before invoking
    await connection.start();
  }
  return originalInvoke(...args);
};

// add emit alias used in some components
if (!connection.emit) {
  connection.emit = connection.invoke.bind(connection);
}

// Export the start promise so consumers can await connection readiness
export const connectionReady = startPromise;

export default connection;