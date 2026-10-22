import request from "supertest";
import type { Response } from "supertest";
import { beforeEach, describe, expect, it } from "@jest/globals";

import app from "../src/app";
import { tickets } from "../src/data/tickets";
import type { Ticket } from "../src/api/v1/models/ticket";

// Preserve the initial dataset for independent tests
const initialTickets: Ticket[] = tickets.map(
    (ticket: Ticket): Ticket => ({ ...ticket })
);

beforeEach((): void => {
    tickets.splice(
        0,
        tickets.length,
        ...initialTickets.map(
            (ticket: Ticket): Ticket => ({ ...ticket })
        )
    );
});

describe("Support Ticket API Routes", (): void => {

    // TEST 1: GET ALL TICKETS
    it("should retrieve all support tickets", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/tickets";

        // Act
        const response: Response = await request(app).get(endpoint);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Tickets retrieved successfully");
        expect(response.body.count).toBe(7);
        expect(response.body.data).toHaveLength(7);
    });

    // TEST 2: GET TICKET BY ID
    it("should retrieve a ticket by its ID", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/tickets/1";

        // Act
        const response: Response = await request(app).get(endpoint);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.priority).toBe("low");
        expect(response.body.data.status).toBe("open");
    });

    // TEST 3: TICKET NOT FOUND
    it("should return 404 for a nonexistent ticket", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/tickets/999";

        // Act
        const response: Response = await request(app).get(endpoint);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Ticket not found");
    });

    // TEST 4: CREATE TICKET
    it("should create a ticket with generated fields", async (): Promise<void> => {
        // Arrange
        const input: object = {
            title: "Test API failure",
            description: "API returns an unexpected error",
            priority: "high",
        };

        // Act
        const response: Response = await request(app)
            .post("/api/v1/tickets")
            .send(input);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Ticket created successfully");
        expect(response.body.data.id).toBe(8);
        expect(response.body.data.priority).toBe("high");
        expect(response.body.data.status).toBe("open");
        expect(response.body.data.createdAt).toBeDefined();
        expect(tickets).toHaveLength(8);
    });

    // TEST 5: CREATE VALIDATION
    it("should reject invalid ticket creation requests", async (): Promise<void> => {
        // Arrange
        const invalidCases: {
            body: Record<string, unknown>;
            message: string;
        }[] = [
            {
                body: {
                    description: "Missing title",
                    priority: "high",
                },
                message: "Missing required field: title",
            },
            {
                body: {
                    title: "Missing description",
                    priority: "high",
                },
                message: "Missing required field: description",
            },
            {
                body: {
                    title: "Invalid priority",
                    description: "Testing validation",
                    priority: "urgent",
                },
                message: "Invalid priority. Must be one of: critical, high, medium, low",
            },
        ];

        // Act & Assert
        for (const testCase of invalidCases) {
            const response: Response = await request(app)
                .post("/api/v1/tickets")
                .send(testCase.body);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(testCase.message);
        }

        expect(tickets).toHaveLength(7);
    });

    // TEST 6: UPDATE TICKET
    it("should update a ticket and validate its status", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/tickets/4";

        const updates: object = {
            priority: "critical",
            status: "in-progress",
        };

        // Act
        const response: Response = await request(app)
            .put(endpoint)
            .send(updates);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.data.priority).toBe("critical");
        expect(response.body.data.status).toBe("in-progress");

        // Verify invalid status is rejected
        const invalidResponse: Response = await request(app)
            .put(endpoint)
            .send({ status: "pending" });

        expect(invalidResponse.status).toBe(400);
        expect(invalidResponse.body.message).toBe(
            "Invalid status. Must be one of: open, in-progress, resolved"
        );
    });

    // TEST 7: DELETE TICKET
    it("should delete a ticket and prevent further retrieval", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/tickets/7";

        // Act
        const response: Response = await request(app).delete(endpoint);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Ticket deleted successfully");
        expect(response.body.data.id).toBe(7);

        const getResponse: Response = await request(app).get(endpoint);

        expect(getResponse.status).toBe(404);
        expect(getResponse.body.message).toBe("Ticket not found");
    });

    // TEST 8: CALCULATE URGENCY ENDPOINT
    it("should return calculated urgency for a ticket", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/tickets/6/urgency";

        // Act
        const response: Response = await request(app).get(endpoint);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Ticket urgency calculated");
        expect(response.body.data.id).toBe(6);
        expect(response.body.data.urgencyScore).toBe(80);
        expect(response.body.data.urgencyLevel).toBe(
            "Critical. Immediate attention required."
        );
    });
});