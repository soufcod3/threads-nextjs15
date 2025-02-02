"use server";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { revalidatePath } from "next/cache";
interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        // Assuming `author` is a string (e.g., "user_2sMdF39bTER08tLg85BhxuzNP5o")
        const user = await User.findOne({ id: author });

        if (!user) {
            throw new Error("User not found");
        }

        const createdThread = await Thread.create({
            text,
            author: user._id, // Use user._id (ObjectId) for the author field
            community: null,
        });

        // Update user model
        await User.findByIdAndUpdate(user._id, { // Use user._id (ObjectId) here
            $push: { threads: createdThread._id },
        });

    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents (top level threads, not comments)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "descending" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path: "author",
            model: User
        })
        .populate({
            path: "children",
            populate: {
                path: "author",
                model: User,
                select: "_id name parentId image"
            }
        });

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length; // check if there are more posts than the skip amount
    return { posts, isNext };
}

export async function fetchThreadById(id: string) {
    connectToDB();

    try {
        const thread = await Thread.findById(id)
            .populate({
                path: "author",
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            });

        return thread;
    } catch (error: any) {
        throw new Error(`Failed to fetch thread: ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    connectToDB();

    try {
        const originalThread = await Thread.findById(threadId);

        if (!originalThread) {
            throw new Error("Thread not found");
        }

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        });

        const savedCommentThread = await commentThread.save();

        originalThread.children.push(savedCommentThread._id);

        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to add comment to thread: ${error.message}`);
    }
}