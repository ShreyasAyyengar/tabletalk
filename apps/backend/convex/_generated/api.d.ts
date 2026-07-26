/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as calendar_calendars from "../calendar/calendars.js";
import type * as calendar_connect from "../calendar/connect.js";
import type * as calendar_google_adapter from "../calendar/google/adapter.js";
import type * as calendar_google_calendars from "../calendar/google/calendars.js";
import type * as calendar_google_client from "../calendar/google/client.js";
import type * as calendar_google_credentials from "../calendar/google/credentials.js";
import type * as calendar_google_events from "../calendar/google/events.js";
import type * as calendar_google_normalisation from "../calendar/google/normalisation.js";
import type * as calendar_google_schemas from "../calendar/google/schemas.js";
import type * as calendar_google_webhooks from "../calendar/google/webhooks.js";
import type * as calendar_helpers from "../calendar/helpers.js";
import type * as calendar_icloud_adapter from "../calendar/icloud/adapter.js";
import type * as calendar_icloud_calendars from "../calendar/icloud/calendars.js";
import type * as calendar_icloud_client from "../calendar/icloud/client.js";
import type * as calendar_icloud_credentials from "../calendar/icloud/credentials.js";
import type * as calendar_icloud_events from "../calendar/icloud/events.js";
import type * as calendar_icloud_normalisation from "../calendar/icloud/normalisation.js";
import type * as calendar_internal from "../calendar/internal.js";
import type * as calendar_notifications_internal from "../calendar/notifications/internal.js";
import type * as calendar_notifications_public from "../calendar/notifications/public.js";
import type * as calendar_notifications_schemas from "../calendar/notifications/schemas.js";
import type * as calendar_oauth_google from "../calendar/oauth/google.js";
import type * as calendar_providers from "../calendar/providers.js";
import type * as calendar_registry from "../calendar/registry.js";
import type * as calendar_schemas from "../calendar/schemas.js";
import type * as calendar_sync_calendars from "../calendar/sync/calendars.js";
import type * as calendar_sync_events from "../calendar/sync/events.js";
import type * as calendar_sync_internal from "../calendar/sync/internal.js";
import type * as calendar_sync_reconciliation_calendars from "../calendar/sync/reconciliation/calendars.js";
import type * as calendar_sync_reconciliation_events from "../calendar/sync/reconciliation/events.js";
import type * as calendar_sync_reconciliation_recurrence from "../calendar/sync/reconciliation/recurrence.js";
import type * as calendar_types from "../calendar/types.js";
import type * as danger from "../danger.js";
import type * as events_helpers from "../events/helpers.js";
import type * as events_internal from "../events/internal.js";
import type * as events_schemas from "../events/schemas.js";
import type * as http from "../http.js";
import type * as lib_encryption from "../lib/encryption.js";
import type * as lib_procedures from "../lib/procedures.js";
import type * as lib_time from "../lib/time.js";
import type * as schemas_tasks from "../schemas/tasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "calendar/calendars": typeof calendar_calendars;
  "calendar/connect": typeof calendar_connect;
  "calendar/google/adapter": typeof calendar_google_adapter;
  "calendar/google/calendars": typeof calendar_google_calendars;
  "calendar/google/client": typeof calendar_google_client;
  "calendar/google/credentials": typeof calendar_google_credentials;
  "calendar/google/events": typeof calendar_google_events;
  "calendar/google/normalisation": typeof calendar_google_normalisation;
  "calendar/google/schemas": typeof calendar_google_schemas;
  "calendar/google/webhooks": typeof calendar_google_webhooks;
  "calendar/helpers": typeof calendar_helpers;
  "calendar/icloud/adapter": typeof calendar_icloud_adapter;
  "calendar/icloud/calendars": typeof calendar_icloud_calendars;
  "calendar/icloud/client": typeof calendar_icloud_client;
  "calendar/icloud/credentials": typeof calendar_icloud_credentials;
  "calendar/icloud/events": typeof calendar_icloud_events;
  "calendar/icloud/normalisation": typeof calendar_icloud_normalisation;
  "calendar/internal": typeof calendar_internal;
  "calendar/notifications/internal": typeof calendar_notifications_internal;
  "calendar/notifications/public": typeof calendar_notifications_public;
  "calendar/notifications/schemas": typeof calendar_notifications_schemas;
  "calendar/oauth/google": typeof calendar_oauth_google;
  "calendar/providers": typeof calendar_providers;
  "calendar/registry": typeof calendar_registry;
  "calendar/schemas": typeof calendar_schemas;
  "calendar/sync/calendars": typeof calendar_sync_calendars;
  "calendar/sync/events": typeof calendar_sync_events;
  "calendar/sync/internal": typeof calendar_sync_internal;
  "calendar/sync/reconciliation/calendars": typeof calendar_sync_reconciliation_calendars;
  "calendar/sync/reconciliation/events": typeof calendar_sync_reconciliation_events;
  "calendar/sync/reconciliation/recurrence": typeof calendar_sync_reconciliation_recurrence;
  "calendar/types": typeof calendar_types;
  danger: typeof danger;
  "events/helpers": typeof events_helpers;
  "events/internal": typeof events_internal;
  "events/schemas": typeof events_schemas;
  http: typeof http;
  "lib/encryption": typeof lib_encryption;
  "lib/procedures": typeof lib_procedures;
  "lib/time": typeof lib_time;
  "schemas/tasks": typeof schemas_tasks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
