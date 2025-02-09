import { type Note, type InsertNote, type SearchParams } from "@shared/schema";

export interface IStorage {
  getNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  searchNotes(params: SearchParams): Promise<Note[]>;
}

export class MemStorage implements IStorage {
  private notes: Map<number, Note>;
  private currentId: number;

  constructor() {
    this.notes = new Map();
    this.currentId = 1;
  }

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentId++;
    const note: Note = {
      ...insertNote,
      id,
      createdAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, update: Partial<InsertNote>): Promise<Note | undefined> {
    const existing = this.notes.get(id);
    if (!existing) return undefined;
    
    const updated: Note = {
      ...existing,
      ...update,
    };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  async searchNotes(params: SearchParams): Promise<Note[]> {
    let results = Array.from(this.notes.values());

    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      );
    }

    if (params.tags && params.tags.length > 0) {
      results = results.filter(note =>
        params.tags!.some(tag => note.tags.includes(tag))
      );
    }

    if (params.startDate) {
      const start = new Date(params.startDate);
      results = results.filter(note => 
        note.startTime && new Date(note.startTime) >= start
      );
    }

    if (params.endDate) {
      const end = new Date(params.endDate);
      results = results.filter(note => 
        note.endTime && new Date(note.endTime) <= end
      );
    }

    return results;
  }
}

export const storage = new MemStorage();
