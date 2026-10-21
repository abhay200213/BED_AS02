import type { Ticket, CreateTicketInput } from "../models/ticket";
import { tickets } from "../../../data/tickets";

// Retrieve all support tickets
export function getAllTickets(): Ticket[] {
    return tickets;
}

// Retrieve a ticket by ID
export function getTicketById(id: number): Ticket | undefined {
    return tickets.find(
        (ticket: Ticket): boolean => ticket.id === id
    );
}

// Create a new support ticket
export function createTicket(input: CreateTicketInput): Ticket {
    const nextId: number = tickets.reduce(
        (maxId: number, ticket: Ticket): number =>
            Math.max(maxId, ticket.id),
        0
    ) + 1;

    const newTicket: Ticket = {
        id: nextId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: "open",
        createdAt: new Date().toISOString(),
    };

    tickets.push(newTicket);

    return newTicket;
}