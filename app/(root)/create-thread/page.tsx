import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread
                userId={userInfo.id}
                // userName={userInfo.name}
                // userImage={userInfo.image}
                // userBio={userInfo.bio}
            />
        </>
    )
}

export default Page;