import { type Note, type InsertNote, type SearchParams, notes } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  searchNotes(params: SearchParams): Promise<Note[]>;
}

export class DatabaseStorage implements IStorage {
  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }

  async getNote(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id: number, update: Partial<InsertNote>): Promise<Note | undefined> {
    const [note] = await db
      .update(notes)
      .set(update)
      .where(eq(notes.id, id))
      .returning();
    return note;
  }

  async deleteNote(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();
    return !!deleted;
  }

  async searchNotes(params: SearchParams): Promise<Note[]> {
    const conditions = [];

    if (params.query) {
      conditions.push(
        or(
          like(notes.title, `%${params.query}%`),
          like(notes.content, `%${params.query}%`)
        )
      );
    }

    if (params.tags && params.tags.length > 0) {
      conditions.push(
        // Using overlap operator for array contains
        sql`${notes.tags} && ${sql.array(params.tags, 'text')}::text[]`
      );
    }

    if (params.startDate) {
      conditions.push(gte(notes.startTime, new Date(params.startDate)));
    }

    if (params.endDate) {
      conditions.push(lte(notes.endTime, new Date(params.endDate)));
    }

    return await db
      .select()
      .from(notes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(notes.createdAt);
  }
}

export const storage = new DatabaseStorage();