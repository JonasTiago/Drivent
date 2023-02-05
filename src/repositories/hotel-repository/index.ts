import { prisma } from "@/config";

async function findAllHotels() {
    return await prisma.hotel.findMany({});
};

async function  findRomsByHotelId(id:number) {
    const data = await prisma.hotel.findUnique({
        where:{
            id,
        },
        include:{
            Rooms: true
        }
    });
    
    return data
};

const hotelsRepository = {
    findAllHotels,
    findRomsByHotelId
};

export default hotelsRepository;