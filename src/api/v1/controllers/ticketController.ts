import { Request, Response } from "express";
import { HttpStatus } from "../../../constants/httpStatus";
import type {
    Ticket,
    TicketPriority,
    CreateTicketInput,
    TicketStatus,
    UpdateTicketInput,
} from "../models/ticket";

import {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
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

// PUT /api/v1/tickets/:id
export function updateTicketController(
    req: Request,
    res: Response
): void {
    const id: number = Number(req.params.id);

    // Check if ticket exists
    const existingTicket: Ticket | undefined = getTicketById(id);

    if (!existingTicket) {
        res.status(HttpStatus.NOT_FOUND).json({
            message: "Ticket not found",
        });
        return;
    }

    const rawBody: unknown = req.body;

    const body: Record<string, unknown> =
        rawBody !== null &&
        typeof rawBody === "object" &&
        !Array.isArray(rawBody)
            ? rawBody as Record<string, unknown>
            : {};

    const validPriorities: TicketPriority[] = [
        "critical",
        "high",
        "medium",
        "low",
    ];

    const validStatuses: TicketStatus[] = [
        "open",
        "in-progress",
        "resolved",
    ];

    // Validate priority if provided
    if (
        body.priority !== undefined &&
        (
            typeof body.priority !== "string" ||
            !validPriorities.includes(body.priority as TicketPriority)
        )
    ) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Invalid priority. Must be one of: critical, high, medium, low",
        });
        return;
    }

    // Validate status if provided
    if (
        body.status !== undefined &&
        (
            typeof body.status !== "string" ||
            !validStatuses.includes(body.status as TicketStatus)
        )
    ) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Invalid status. Must be one of: open, in-progress, resolved",
        });
        return;
    }

    // Validate title and description if provided
    if (
        body.title !== undefined &&
        (typeof body.title !== "string" || body.title.trim() === "")
    ) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Invalid title. Must be a non-empty string",
        });
        return;
    }

    if (
        body.description !== undefined &&
        (typeof body.description !== "string" || body.description.trim() === "")
    ) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Invalid description. Must be a non-empty string",
        });
        return;
    }

    const updates: UpdateTicketInput = {};

    if (typeof body.title === "string") {
        updates.title = body.title.trim();
    }

    if (typeof body.description === "string") {
        updates.description = body.description.trim();
    }

    if (typeof body.priority === "string") {
        updates.priority = body.priority as TicketPriority;
    }

    if (typeof body.status === "string") {
        updates.status = body.status as TicketStatus;
    }

    const updatedTicket: Ticket | undefined = updateTicket(id, updates);

    res.status(HttpStatus.OK).json({
        message: "Ticket updated successfully",
        data: updatedTicket,
    });
}

// DELETE /api/v1/tickets/:id
export function deleteTicketController(
    req: Request,
    res: Response
): void {
    const id: number = Number(req.params.id);

    const deletedTicket: Ticket | undefined = deleteTicket(id);

    if (!deletedTicket) {
        res.status(HttpStatus.NOT_FOUND).json({
            message: "Ticket not found",
        });
        return;
    }

    res.status(HttpStatus.OK).json({
        message: "Ticket deleted successfully",
        data: deletedTicket,
    });
}