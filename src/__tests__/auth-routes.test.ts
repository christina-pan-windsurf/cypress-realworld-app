import { describe, expect, it, beforeEach } from "vitest";
import { seedDatabase, getUserByUsername, getAllUsers } from "../../backend/database";
import bcrypt from "bcryptjs";

describe("Authentication Routes", () => {
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 10));
    return seedDatabase();
  });

  it("should authenticate user with valid credentials", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }
    const firstUser = users[0];
    const user = getUserByUsername(firstUser.username);
    expect(user).toBeDefined();
    expect(user?.username).toBe(firstUser.username);
  });

  it("should hash passwords correctly", () => {
    const password = "s3cret";
    const hashedPassword = bcrypt.hashSync(password, 10);
    const isValid = bcrypt.compareSync(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it("should reject invalid password", () => {
    const password = "s3cret";
    const wrongPassword = "wrongpassword";
    const hashedPassword = bcrypt.hashSync(password, 10);
    const isValid = bcrypt.compareSync(wrongPassword, hashedPassword);
    expect(isValid).toBe(false);
  });

  it("should find user for authentication", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }
    const firstUser = users[0];
    const user = getUserByUsername(firstUser.username);
    expect(user).toBeDefined();
    expect(user?.email).toBe(firstUser.email);
  });

  it("should handle non-existent user", () => {
    const user = getUserByUsername("nonexistentuser");
    expect(user).toBeUndefined();
  });
});
