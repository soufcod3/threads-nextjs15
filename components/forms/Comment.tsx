"use client";

import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,

} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { z } from "zod";
import { CommentValidation } from "@/lib/validations/thread";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
    userId: string;
}

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        console.log('values', values);

        await addCommentToThread(threadId, values.thread, currentUserId, pathname);

        form.reset();

        // await createComment({
        //     text: values.thread,
        //     author: userId,
        //     communityId: null,
        //     path: pathname,
        // });
    }

    return (
        <div>
            <h1>Comment Form {threadId}</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="comment-form"
                >
                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3 w-full">
                                <FormLabel>
                                    <Image className="rounded-full object-cover" src={currentUserImg} alt="Profile image" width={24} height={24} />
                                </FormLabel>
                                <FormControl className="border-none bg-transparent">
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Comment..."
                                        className="no-focus text-light-1 outline-none"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="comment-form_btn">
                        Reply
                    </Button>
                </form>
            </Form>
        </div>
    )
}
export default Comment;