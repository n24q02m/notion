/**
 * JSON value helpers.
 *
 * Tool results and tool arguments are decoded JSON: both the MCP handler and the
 * CLI need "is this a JSON object" without narrowing the fields inside it.
 */

/** True for a JSON object (never null, never an array). */
export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
