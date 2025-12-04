import React from "react";

export type UserRole = "admin" | "mesero" | "cajero";

interface User {
  role: UserRole;
}

interface MenuLink {
  href: string;
  label: string;
  roles: UserRole[];
}

export default function TopMenu({ user }: { user: User }) {
  const links: MenuLink[] = [
    { href: "/", label: "Inicio", roles: ["admin", "mesero", "cajero"] },
    { href: "/pedidos", label: "Pedidos", roles: ["admin", "mesero"] },
    { href: "/caja", label: "Caja", roles: ["admin", "cajero"] },
    { href: "/pagados", label: "Pagados", roles: ["admin", "mesero", "cajero"] }
  ];

  const visibleLinks = links.filter((link) =>
    link.roles.includes(user.role)
  );

  if (visibleLinks.length === 0) return null;

  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      {visibleLinks.map((link) => (
        <a key={link.href} href={link.href} className="text-blue-600 font-semibold">
          {link.label}
        </a>
      ))}
    </nav>
  );
}
