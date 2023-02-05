import { notFoundError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-repository"
import ticketRepository from "@/repositories/ticket-repository";
import httpStatus from "http-status";

async function getHotels(userId: number) {
    const enrollmentValid = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollmentValid) throw notFoundError();
    
    const ticketValid = await ticketRepository.findTicketByEnrollmentId(enrollmentValid.id);
    if (!ticketValid) throw notFoundError();
    if(ticketValid.status !== "PAID" || !ticketValid.TicketType.includesHotel || ticketValid.TicketType.isRemote) throw (httpStatus.PAYMENT_REQUIRED);

    const allHotels = await hotelsRepository.findAllHotels();
    if(!allHotels.length) throw notFoundError();

    return allHotels;
}

async function getRomsByIdHotel(hotelId: number, userId: number) {
    const enrollmentValid = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollmentValid) throw notFoundError();


    const ticketValid = await ticketRepository.findTicketByEnrollmentId(enrollmentValid.id);
    if (!ticketValid) throw notFoundError();
    if(ticketValid.status !== "PAID" || !ticketValid.TicketType.includesHotel || ticketValid.TicketType.isRemote) throw (httpStatus.PAYMENT_REQUIRED);

    const romsHotel = await hotelsRepository.findRomsByHotelId(hotelId);
    if(!romsHotel) throw notFoundError();
    return romsHotel;
}

export const hotelsService = {
    getHotels,
    getRomsByIdHotel
}