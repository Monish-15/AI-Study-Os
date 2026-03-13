import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("studyos.db");
const JWT_SECRET = process.env.JWT_SECRET || "studyos-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    education_level TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    deadline DATETIME,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    streak INTEGER DEFAULT 0,
    last_completed DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT,
    duration_minutes INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS study_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password, educationLevel } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (name, email, password, education_level) VALUES (?, ?, ?, ?)");
      const info = stmt.run(name, email, hashedPassword, educationLevel);
      const token = jwt.sign({ id: info.lastInsertRowid, email }, JWT_SECRET);
      res.json({ token, user: { id: info.lastInsertRowid, name, email, educationLevel } });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, educationLevel: user.education_level, xp: user.xp, level: user.level } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/user/me", authenticateToken, (req: any, res) => {
    const user: any = db.prepare("SELECT id, name, email, education_level, xp, level FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // Task Routes
  app.get("/api/tasks", authenticateToken, (req: any, res) => {
    const tasks = db.prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline ASC").all(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", authenticateToken, (req: any, res) => {
    const { title, subject, deadline } = req.body;
    const stmt = db.prepare("INSERT INTO tasks (user_id, title, subject, deadline) VALUES (?, ?, ?, ?)");
    const info = stmt.run(req.user.id, title, subject, deadline);
    res.json({ id: info.lastInsertRowid, title, subject, deadline, completed: 0 });
  });

  app.patch("/api/tasks/:id", authenticateToken, (req: any, res) => {
    const { completed } = req.body;
    db.prepare("UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?").run(completed ? 1 : 0, req.params.id, req.user.id);
    if (completed) {
      db.prepare("UPDATE users SET xp = xp + 10 WHERE id = ?").run(req.user.id);
    }
    res.json({ success: true });
  });

  // Habit Routes
  app.get("/api/habits", authenticateToken, (req: any, res) => {
    const habits = db.prepare("SELECT * FROM habits WHERE user_id = ?").all(req.user.id);
    res.json(habits);
  });

  app.post("/api/habits", authenticateToken, (req: any, res) => {
    const { name } = req.body;
    const stmt = db.prepare("INSERT INTO habits (user_id, name) VALUES (?, ?)");
    const info = stmt.run(req.user.id, name);
    res.json({ id: info.lastInsertRowid, name, streak: 0 });
  });

  // Study Session Routes
  app.post("/api/study-sessions", authenticateToken, (req: any, res) => {
    const { subject, durationMinutes } = req.body;
    db.prepare("INSERT INTO study_sessions (user_id, subject, duration_minutes) VALUES (?, ?, ?)")
      .run(req.user.id, subject, durationMinutes);
    db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(Math.floor(durationMinutes / 2), req.user.id);
    res.json({ success: true });
  });

  // Study Plan Routes
  app.get("/api/study-plan", authenticateToken, (req: any, res) => {
    const plan: any = db.prepare("SELECT * FROM study_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(req.user.id);
    res.json(plan ? JSON.parse(plan.plan_json) : null);
  });

  app.post("/api/study-plan", authenticateToken, (req: any, res) => {
    const { plan } = req.body;
    db.prepare("INSERT INTO study_plans (user_id, plan_json) VALUES (?, ?)").run(req.user.id, JSON.stringify(plan));
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();
