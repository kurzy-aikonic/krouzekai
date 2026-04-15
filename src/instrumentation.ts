import { logProductionEnvWarnings } from "@/lib/env-warnings";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logProductionEnvWarnings();
  }
}
