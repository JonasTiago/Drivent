import { AuthenticatedRequest } from "@/middlewares";
import { hotelsService } from "@/services/hotels-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const userId: number = req.userId;
    try {
        const hotels = await hotelsService.getHotels(userId);
        return res.send(hotels);
    } catch (err) {
        if (err.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
}

export async function getRomsHotel(req: AuthenticatedRequest, res: Response) {
    const userId: number = req.userId;
    const hotelId: number = Number(req.params.hotelId);

    try {
        const romsHotel = await hotelsService.getRomsByIdHotel(hotelId, userId);
        return res.send(romsHotel);
    } catch (err) {
        if (err.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}