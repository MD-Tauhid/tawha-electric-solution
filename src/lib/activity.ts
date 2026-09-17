import { prisma } from "@/lib/prisma";

type EntityType =
  | "CUSTOMER"
  | "SERVICE"
  | "PROJECT"
  | "PROPOSAL"
  | "BILL"
  | "PAYMENT"
  | "SETTINGS";

type ActionType = "CREATED" | "UPDATED" | "DELETED" | "STATUS_CHANGED";

interface LogActivityParams {
  action: ActionType;
  entity: EntityType;
  entityId?: string;
  details?: Record<string, unknown>;
}

/**
 * Log an activity to the activity log table.
 * This is a fire-and-forget function — errors are silently caught
 * so they never break the main operation.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: params.details ? JSON.parse(JSON.stringify(params.details)) : undefined,
      },
    });
  } catch {
    // Activity logging should never break the main operation
  }
}

/**
 * Log a customer activity.
 */
export async function logCustomerActivity(
  action: ActionType,
  customerId: string,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "CUSTOMER", entityId: customerId, details });
}

/**
 * Log a service activity.
 */
export async function logServiceActivity(
  action: ActionType,
  serviceId: string,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "SERVICE", entityId: serviceId, details });
}

/**
 * Log a project activity.
 */
export async function logProjectActivity(
  action: ActionType,
  projectId: string,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "PROJECT", entityId: projectId, details });
}

/**
 * Log a proposal activity.
 */
export async function logProposalActivity(
  action: ActionType,
  proposalId: string,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "PROPOSAL", entityId: proposalId, details });
}

/**
 * Log a bill activity.
 */
export async function logBillActivity(
  action: ActionType,
  billId: string,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "BILL", entityId: billId, details });
}

/**
 * Log a payment activity.
 */
export async function logPaymentActivity(
  action: ActionType,
  paymentId: string,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "PAYMENT", entityId: paymentId, details });
}

/**
 * Log a settings activity.
 */
export async function logSettingsActivity(
  action: ActionType,
  details?: Record<string, unknown>
) {
  return logActivity({ action, entity: "SETTINGS", details });
}
