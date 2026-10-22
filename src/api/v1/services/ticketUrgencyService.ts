import type {
    Ticket,
    TicketPriority,
} from "../models/ticket";

// Base urgency score for each priority
const BASE_SCORES: Record<TicketPriority, number> = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10,
};

// Number of milliseconds in a day
const MILLISECONDS_PER_DAY: number = 24 * 60 * 60 * 1000;

// Each day increases urgency by 5 points
const URGENCY_PER_DAY: number = 5;

// Expected urgency response structure
export interface TicketUrgency {
    id: number;
    title: string;
    priority: TicketPriority;
    status: Ticket["status"];
    createdAt: string;
    ticketAge: number;
    urgencyScore: number;
    urgencyLevel: string;
}

// Calculate urgency based on priority and ticket age
export function calculateTicketUrgency(
    ticket: Ticket,
    now: Date = new Date()
): TicketUrgency {

    const createdDate: Date = new Date(ticket.createdAt);

    const ticketAge: number = Math.max(
        0,
        Math.floor(
           (now.getTime() - createdDate.getTime()) /
           MILLISECONDS_PER_DAY 
        )
    );

    let urgencyScore: number;
    let urgencyLevel: string;

    // Resolved tickets have minimal urgency
    if (ticket.status === "resolved") {
        urgencyScore = 0;
        urgencyLevel = "Minimal. Ticket resolved.";
    } else {
        const baseScore: number = BASE_SCORES[ticket.priority];

        urgencyScore = baseScore + (ticketAge * URGENCY_PER_DAY);

        // Determine urgency classification
        if (urgencyScore >= 80) {
            urgencyLevel = "Critical. Immediate attention required.";
        } else if (urgencyScore >= 55) {
            urgencyLevel = "High urgency. Prioritize resolution.";
        } else if (urgencyScore >= 30) {
            urgencyLevel = "Moderate. Schedule for attention.";
        } else {
            urgencyLevel = "Low urgency. Address when capacity allows."
        }
    }

    return {
        id: ticket.id,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
        ticketAge,
        urgencyScore,
        urgencyLevel,
    };
}