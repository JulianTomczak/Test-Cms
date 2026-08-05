"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-16 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Mi CMS
        </Link>

        <ul className="flex items-center gap-4">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
