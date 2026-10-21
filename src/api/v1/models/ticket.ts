export type TicketPriority =
    | "critical"
    | "high"
    | "medium"
    | "low";

export type TicketStatus =
    | "open"
    | "in-progress"
    | "resolved";

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
}