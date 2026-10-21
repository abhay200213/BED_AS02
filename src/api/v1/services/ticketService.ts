import { Ticket } from "../models/ticket";
import { tickets } from "../../../data/tickets";

// Retrieve all support tickets
export function getAllTickets(): Ticket[] {
    return tickets;
}

// Retrieve a ticket by ID
export function getTicketById(id: number): Ticket | undefined {
    return tickets.find((ticket: Ticket): boolean => ticket.id === id);
}