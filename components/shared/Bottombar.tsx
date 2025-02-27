"use client";

import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Bottombar() {
    const pathname = usePathname();

    const { userId } = useAuth();

    return (
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    // Handle profile route specially
                    if (link.route === "/profile" && !userId) {
                        return null; // Don't show profile link if user isn't loaded yet
                    }
                    const route = link.route === "/profile" ? `/profile/${userId}` : link.route;

                    
                    return (
                        <Link href={route} key={link.label} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className="text-sublte-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar;