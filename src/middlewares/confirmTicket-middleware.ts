// import { Request, Response } from "express";
// import { notFoundError, unauthorizedError } from "@/errors";
// import enrollmentRepository from "@/repositories/enrollment-repository";
// import paymentsRepository from "@/repositories/payments-repository";
// import httpStatus from "http-status";

// export async function confirmTicket(ticketId: number, userId: number) {
//     return (req:Request, res:Response) => {
//         try{
//             const ticketConfirm = await paymentsRepository.getTicket(ticketId);
//         if (!ticketConfirm) throw notFoundError();
    
//         const enrollmentUser = await enrollmentRepository.findEnrollments(userId);
//         if (ticketConfirm.enrollmentId !== enrollmentUser.id) throw unauthorizedError();
//         }catch(err){
//             if (err.name === "NotFoundError") {
//                 return res.sendStatus(httpStatus.NOT_FOUND);
//               }
//               if (err.name === "UnauthorizedError") {
//                 return res.sendStatus(httpStatus.UNAUTHORIZED);
//               }
//         }
//     }
// }
