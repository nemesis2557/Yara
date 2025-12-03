"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export function TopMenu() {
  const { user } = useAuth();

  if (!user) return null;

  const links = (
    [
      { href: "/inicio", label: "Inicio", roles: ["admin", "mesero", "ayudante", "chef"] },
      { href: "/pedidos", label: "Pedidos", roles: ["admin", "mesero", "ayudante"] },
      { href: "/listos", label: "Listos", roles: ["admin", "mesero", "cajero", "ayudante"] },
      { href: "/pagados", label: "Pagados", roles: ["admin", "mesero", "cajero"] },
    ] as const
  ).filter((link) => link.roles.includes(user.role));

  if (links.length === 0) return null;

  return (
    <nav className="w-full bg-white shadow px-4 py-3 mb-4 rounded-xl flex gap-3 text-sm">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="text-[#6B4423] font-semibold hover:text-[#a05c2a]">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
