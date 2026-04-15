import { ROLES } from "../constants/roles.js";

// Demo in-memory store. Swap this with a real database repository in production.
export const users = [
  {
    id: "admin-demo-1",
    name: "Admin User",
    email: "admin@example.com",
    passwordHash:
      "$2a$10$t70CYsQfXqu85IC540cDdufc/D1iNOqGE1wnYwcfIuXFESAU3wjQW", // password: "admin123"
    role: ROLES.ADMIN,
    createdAt: new Date(),
  },
  {
    id: "user-demo-1",
    name: "Demo User",
    email: "user@example.com",
    passwordHash:
      "$2a$10$JZjEw0S2TUPivt2ohfE09uomge7E55ON5TODQ4yr6nwnbEUSotzg2", // password: "password123"
    role: ROLES.USER,
    createdAt: new Date(),
  },
];
