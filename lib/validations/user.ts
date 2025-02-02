import * as z from "zod";

export const UserValidation = z.object({
    profile_photo: z.string().url().min(1, {
        message: "Profile photo is required",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }).max(30, {
        message: "Name is too long.",
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).max(30, {
    }),
    bio: z.string().min(3, {
        message: "Bio must be at least 3 characters.",
    }).max(1000, {
        message: "Bio is too long.",
    })
})