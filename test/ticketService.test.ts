import { describe, it, expect } from "@jest/globals";
import type { Ticket } from "../src/api/v1/models/ticket";

import {
    calculateTicketUrgency,
    TicketUrgency,
} from "../src/api/v1/services/ticketUrgencyService";

// Fixed date ensures reproducible test results
const now: Date = new Date("2026-10-21T12:00:00.000Z");

function makeTicket(
    priority: Ticket["priority"],
    ageDays: number,
    status: Ticket["status"] = "open"
): Ticket {
    const millisecondsPerDay: number = 24 * 60 * 60 * 1000;

    return {
        id: 1,
        title: "Test ticket",
        description: "Testing urgency calculation",
        priority,
        status,
        createdAt: new Date(
            now.getTime() - ageDays * millisecondsPerDay
        ).toISOString(),
    };
}

describe("Ticket Urgency Calculation", (): void => {

    it("should calculate low urgency correctly", (): void => {
        // Arrange
        const ticket: Ticket = makeTicket("low", 3);

        // Act
        const result: TicketUrgency =
            calculateTicketUrgency(ticket, now);

        // Assert
        expect(result.ticketAge).toBe(3);
        expect(result.urgencyScore).toBe(25);
        expect(result.urgencyLevel).toBe(
            "Low urgency. Address when capacity allows."
        );
    });

    it("should classify moderate urgency at its boundaries", (): void => {
        // Arrange
        const ticketA: Ticket = makeTicket("medium", 2);
        const ticketB: Ticket = makeTicket("medium", 6);

        // Act
        const resultA: TicketUrgency =
            calculateTicketUrgency(ticketA, now);
        const resultB: TicketUrgency =
            calculateTicketUrgency(ticketB, now);

        // Assert
        expect(resultA.urgencyScore).toBe(30);
        expect(resultB.urgencyScore).toBe(50);
        expect(resultA.urgencyLevel).toBe(
            "Moderate. Schedule for attention."
        );
        expect(resultB.urgencyLevel).toBe(
            "Moderate. Schedule for attention."
        );
    });

    it("should classify high and critical urgency correctly", (): void => {
        // Arrange
        const highTicket: Ticket = makeTicket("high", 5);
        const criticalTicket: Ticket = makeTicket("critical", 6);

        // Act
        const highResult: TicketUrgency =
            calculateTicketUrgency(highTicket, now);
        const criticalResult: TicketUrgency =
            calculateTicketUrgency(criticalTicket, now);

        // Assert
        expect(highResult.urgencyScore).toBe(55);
        expect(highResult.urgencyLevel).toBe(
            "High urgency. Prioritize resolution."
        );

        expect(criticalResult.urgencyScore).toBe(80);
        expect(criticalResult.urgencyLevel).toBe(
            "Critical. Immediate attention required."
        );
    });

    it("should return minimal urgency for resolved tickets", (): void => {
        // Arrange
        const ticket: Ticket = makeTicket("critical", 10, "resolved");

        // Act
        const result: TicketUrgency =
            calculateTicketUrgency(ticket, now);

        // Assert
        expect(result.urgencyScore).toBe(0);
        expect(result.urgencyLevel).toBe(
            "Minimal. Ticket resolved."
        );
    });
});