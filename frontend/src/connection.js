import * as signalR from "@microsoft/signalr";
import config from "./config";

console.log("Config:", config);
console.log("Hub URL:", config.hubUrl);

const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.hubUrl)
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Debug) // Add debug logging
  .build();

// start once and keep the promise so callers can await it
const startPromise = connection.start()
  .then(() => console.log("SignalR connected"))
  .catch(err => {
    console.error("SignalR connection error:", err);
    throw err;
  });

// preserve original invoke
const originalInvoke = connection.invoke.bind(connection);

// override invoke to await startPromise (or try to start if it failed)
connection.invoke = async (...args) => {
  try {
    await startPromise;
  } catch (startErr) {
    // if initial start failed, try to start again before invoking
    try {
      await connection.start();
      console.log("SignalR re-started before invoke");
    } catch (err) {
      console.error("SignalR failed to start before invoke:", err);
      throw err;
    }
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