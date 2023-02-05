import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicket } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeEach(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {

        it("should respond with status 404 when the user no enrollments", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when the user no ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when there are no hotel created", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 402 whe the ticket no payment", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 whe the ticketType is remote", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 whe the hotel not included", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: false,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 200 and with existing hotels data", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.body).toEqual([
                {
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                },
            ]);
        });
    });
});

describe("GET /hotels/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 404 when the user no enrollments", async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when the user no ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when there are no hotel created", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 402 whe the ticket no payment", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const hotel = await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 whe the ticketType is remote", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 402 whe the hotel not included", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: false,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 200 and with existing hotels data", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                }
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const hotel = await prisma.hotel.create({
                data: {
                    name: "hotel_fake",
                    image: "http:/",
                }
            });

            await prisma.room.createMany({
                data: [
                    {
                        capacity: 2,
                        name: "101",
                        hotelId: hotel.id
                    },
                    {
                        capacity: 2,
                        name: "102",
                        hotelId: hotel.id
                    },
                    {
                        capacity: 2,
                        name: "103",
                        hotelId: hotel.id
                    },
                    {
                        capacity: 2,
                        name: "104",
                        hotelId: hotel.id
                    }
                ]
            })

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.body).toEqual(expect.objectContaining({
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                Rooms: expect.arrayContaining([expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
                ])
            }));
        });
    })
});

