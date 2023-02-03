import { prisma } from "@/config";

async function findAllHotels() {
    const data = await prisma.hotel.findMany();
    return data;
};

const hotelsRepository = {
    findAllHotels
};

export default hotelsRepository;