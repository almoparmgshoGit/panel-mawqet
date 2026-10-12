import { createClient as createBrowserClient } from "./client";

export async function createClient() {
  return createBrowserClient();
}
