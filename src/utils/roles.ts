export type Role = "admin" | "editor" | "viewer";

export const canEditContent = (role: Role) => {
  return ["admin", "editor"].includes(role);
};

export const canDeleteContent = (role: Role) => {
  return ["admin", "editor"].includes(role);
};

export const canCreateContent = (role: Role) => {
  return ["admin", "editor", ].includes(role);
};

export const canManageMembers = (role: Role) => {
  return role === "admin";
};