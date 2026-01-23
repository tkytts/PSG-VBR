import client from "./client";

export async function getCurrentUser() {
  return client.get("/currentUser");
}