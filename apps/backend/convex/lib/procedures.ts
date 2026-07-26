import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomAction, zCustomMutation, zCustomQuery } from "convex-helpers/server/zod4";

import {
  type ActionCtx,
  action,
  internalAction as baseInternalAction,
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "../_generated/server";

type AuthCtx = QueryCtx | MutationCtx | ActionCtx;

export const internalQuery = zCustomQuery(baseInternalQuery, NoOp);
export const internalMutation = zCustomMutation(baseInternalMutation, NoOp);
export const internalAction = zCustomAction(baseInternalAction, NoOp);

export const publicQuery = zCustomQuery(query, NoOp);
export const publicMutation = zCustomMutation(mutation, NoOp);
export const publicAction = zCustomAction(action, NoOp);
