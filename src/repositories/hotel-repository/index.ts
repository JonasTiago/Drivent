import { prisma } from "@/config";

async function findAllHotels() {
    const data = await prisma.hotel.findMany();
    return data;
};

async function  findRomsByHotelId(id:number) {
    const data = await prisma.hotel.findFirst({
        where:{
            id,
        },
        include:{
            Rooms: true
        }
    });
    return data
}

const hotelsRepository = {
    findAllHotels,
    findRomsByHotelId
};

export default hotelsRepository;