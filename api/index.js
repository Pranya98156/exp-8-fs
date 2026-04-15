import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const jwtSecret = process.env.JWT_SECRET || "dev_secret";

// Demo user store (same as in server)
let users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    password: "$2a$10$t70CYsQfXqu85IC540cDdufc/D1iNOqGE1wnYwcfIuXFESAU3wjQW",
    role: "ADMIN",
  },
  {
    id: "2",
    name: "User",
    email: "user@example.com",
    password: "$2a$10$JZjEw0S2TUPivt2ohfE09uomge7E55ON5TODQ4yr6nwnbEUSotzg2",
    role: "USER",
  },
];

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(morgan("combined"));
app.use(express.json());

// Auth middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Routes
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password: hashedPassword,
      role: "USER",
    };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, jwtSecret, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ user: { id: newUser.id, name, email, role: "USER" }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users/me", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json(
    user
      ? { id: user.id, name: user.name, email: user.email, role: user.role }
      : null,
  );
});

// 404 & error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

export default app;
