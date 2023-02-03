import { Hotel, Room } from "@prisma/client";
import { type } from "os";

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,

};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string

}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type Hotels = Hotel;

// {
//   id: number,
//   name: string,
//   image: string,
//   createdAt: string,
//   updatedAt: string,
//   Rooms: [
//     {
//       id: number,
//       name: string,
//       capacity: number,
//       hotelId: hotelWithRooms.Rooms[0].hotelId,
//       createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
//       updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
//     }
//   ]
// }

export type Rooms = Room;