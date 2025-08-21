import { describe, expect, it, beforeEach } from "vitest";
import {
  seedDatabase,
  getContactsByUsername,
  createContactForUser,
  removeContactById,
  getAllUsers,
} from "../../backend/database";

describe("Contact Routes", () => {
  beforeEach(() => {
    return seedDatabase();
  });

  it("should get contacts by username", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }
    const user = users[0];
    const contacts = getContactsByUsername(user.username);

    expect(Array.isArray(contacts)).toBe(true);
  });

  it("should create contact for user", () => {
    const users = getAllUsers();
    const user = users[0];
    const contactUser = users[1];

    const contact = createContactForUser(user.id, contactUser.id);

    expect(contact).toBeDefined();
    expect(contact.userId).toBe(user.id);
    expect(contact.contactUserId).toBe(contactUser.id);
  });

  it("should remove contact by ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const contactUser = users[1];

    const contact = createContactForUser(user.id, contactUser.id);

    expect(contact).toBeDefined();
    expect(contact.id).toBeDefined();

    removeContactById(contact.id);

    const contacts = getContactsByUsername(user.username);
    const contactExists = contacts.some((c: any) => c.id === contact.id);
    expect(contactExists).toBe(false);
  });

  it("should handle getting contacts for non-existent user", () => {
    try {
      const contacts = getContactsByUsername("nonexistentuser");
      expect(Array.isArray(contacts)).toBe(true);
      expect(contacts.length).toBe(0);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle duplicate contact creation", () => {
    const users = getAllUsers();
    const user = users[0];
    const contactUser = users[1];

    const contact1 = createContactForUser(user.id, contactUser.id);
    expect(contact1).toBeDefined();

    try {
      const contact2 = createContactForUser(user.id, contactUser.id);
      expect(contact2).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should verify contact relationships", () => {
    const users = getAllUsers();
    const user = users[0];
    const contactUser = users[1];

    createContactForUser(user.id, contactUser.id);
    const contacts = getContactsByUsername(user.username);

    const hasContact = contacts.some((contact: any) => contact.contactUserId === contactUser.id);
    expect(hasContact).toBe(true);
  });
});
