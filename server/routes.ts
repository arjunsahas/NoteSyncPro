import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, searchSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  app.get("/api/notes", async (_req, res) => {
    const notes = await storage.getNotes();
    res.json(notes);
  });

  app.get("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const note = await storage.getNote(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.json(note);
  });

  app.post("/api/notes", async (req, res) => {
    const result = insertNoteSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid note data" });
      return;
    }
    const note = await storage.createNote(result.data);
    res.status(201).json(note);
  });

  app.patch("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertNoteSchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid note data" });
      return;
    }
    const note = await storage.updateNote(id, result.data);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.json(note);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteNote(id);
    if (!success) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(204).send();
  });

  app.post("/api/notes/search", async (req, res) => {
    const result = searchSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid search parameters" });
      return;
    }
    const notes = await storage.searchNotes(result.data);
    res.json(notes);
  });

  const httpServer = createServer(app);
  return httpServer;
}
