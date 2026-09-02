// Re-export Prisma types for convenience
export type {
  User,
  Customer,
  Service,
  Project,
  ProjectItem,
  Proposal,
  ProposalItem,
  Bill,
  Payment,
  CompanySettings,
  ActivityLog,
} from "@prisma/client";

// Enums
export type {
  UserRole,
  CustomerType,
  ProjectStatus,
  BillStatus,
  PaymentMethod,
} from "@prisma/client";
