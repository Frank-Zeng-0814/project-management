import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

//Inngest Function to save user data to database
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { evnet: 'clerk/user.created' },
    async (event) => {
        const { data } = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_adresses[0]?.email_adresses,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        })
    }
)

// Inngest Function to delete user data from database
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { evnet: 'clerk/user.deleted' },
    async (event) => {
        const { data } = event
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })
    }
)

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { evnet: 'clerk/user.update' },
    async (event) => {
        const { data } = event
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email: data?.email_adresses[0]?.email_adresses,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
];