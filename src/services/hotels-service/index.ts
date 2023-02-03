import { notFoundError } from "@/errors"
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-repository"
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
    const enrollmentValid = await enrollmentRepository.findById(userId);
    if (!enrollmentValid) throw notFoundError();

    const ticketValid = await ticketRepository.findTicketByEnrollmentId(enrollmentValid.id);
    if (!ticketValid) throw notFoundError();

    const allHotels = await hotelsRepository.findAllHotels();
    if (!allHotels) throw notFoundError();

    return allHotels;
}

// async function getRomsByIdHotel(hotelId: number) {

// }

export const hotelsService = {
    getHotels,
    // getRomsByIdHotel
}