"use client";

import { sidebarLinks } from "@/constants";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LeftSidebar() {
    const pathname = usePathname();

    const { userId } = useAuth();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    // Handle profile route specially
                    if (link.route === "/profile" && !userId) {
                        return null; // Don't show profile link if user isn't loaded yet
                    }
                    const route = link.route === "/profile" ? `/profile/${userId}` : link.route;

                    return (
                        <Link href={route} key={link.label} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className="text-light-1 max-lg:hidden">{link.label}</p>
                        </Link>
                    )
                })}
            </div>
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutOptions={{
                        redirectUrl: '/sign-in',
                    }}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar;