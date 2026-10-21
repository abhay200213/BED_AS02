import { Request, Response } from "express";
import { HttpStatus } from "../../../constants/httpStatus";
import type {
    Ticket,
    TicketPriority,
    CreateTicketInput,
} from "../models/ticket";

import {
    getAllTickets,
    getTicketById,
    createTicket,
} from "../services/ticketService";

// GET /api/v1/tickets
export function getTicketsController(
    _req: Request,
    res: Response
): void {
    const tickets: Ticket[] = getAllTickets();

    res.status(HttpStatus.OK).json({
        message: "Tickets retrieved successfully",
        count: tickets.length,
        data: tickets,
    });
}

// GET /api/v1/tickets/:id
export function getTicketByIdController(
    req: Request,
    res: Response
): void {
    const id: number = Number(req.params.id);
    const ticket: Ticket | undefined = getTicketById(id);

    if (!ticket) {
        res.status(HttpStatus.NOT_FOUND).json({
            message: "Ticket not found",
        });
        return;
    }

    res.status(HttpStatus.OK).json({
        message: "Ticket retrieved successfully",
        data: ticket,
    });
}

// POST /api/v1/tickets
export function createTicketController(
    req: Request,
    res: Response
): void {
    const rawBody: unknown = req.body;

    const body: Record<string, unknown> =
        rawBody !== null &&
        typeof rawBody === "object" &&
        !Array.isArray(rawBody)
            ? rawBody as Record<string, unknown>
            : {};

    const title: unknown = body.title;
    const description: unknown = body.description;
    const priority: unknown = body.priority;

    // Validate title
    if (typeof title !== "string" || title.trim() === "") {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Missing required field: title",
        });
        return;
    }

    // Validate description
    if (typeof description !== "string" || description.trim() === "") {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Missing required field: description",
        });
        return;
    }

    // Validate priority
    const validPriorities: TicketPriority[] = [
        "critical",
        "high",
        "medium",
        "low",
    ];

    if (
        typeof priority !== "string" ||
        !validPriorities.includes(priority as TicketPriority)
    ) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Invalid priority. Must be one of: critical, high, medium, low",
        });
        return;
    }

    const input: CreateTicketInput = {
        title: title.trim(),
        description: description.trim(),
        priority: priority as TicketPriority,
    };

    const newTicket: Ticket = createTicket(input);

    res.status(HttpStatus.CREATED).json({
        message: "Ticket created successfully",
        data: newTicket,
    });
}