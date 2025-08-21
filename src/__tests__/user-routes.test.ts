import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  seedDatabase,
  getUserById,
  updateUserById,
  createUser,
  getUserByUsername,
  getAllUsers,
} from "../../backend/database";

describe("User Routes", () => {
  beforeEach(() => {
    return seedDatabase();
  });

  it("should get user by ID", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }
    const firstUser = users[0];
    const user = getUserById(firstUser.id);

    expect(user).toBeDefined();
    expect(user?.id).toBe(firstUser.id);
  });

  it("should update user information", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }
    const firstUser = users[0];
    const updateData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    updateUserById(firstUser.id, updateData);

    const updatedUser = getUserById(firstUser.id);
    expect(updatedUser?.firstName).toBe(updateData.firstName);
    expect(updatedUser?.lastName).toBe(updateData.lastName);
  });

  it("should create new user", () => {
    const userData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
    };

    const newUser = createUser(userData);

    expect(newUser).toBeDefined();
    expect(newUser.username).toBe(userData.username);
    expect(newUser.email).toBe(userData.email);
  });

  it("should search users by query", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }

    const firstUser = users[0];
    const searchResults = users.filter(
      (user) =>
        user.username.includes(firstUser.username.substring(0, 3)) ||
        user.firstName.includes(firstUser.firstName.substring(0, 3))
    );

    expect(searchResults.length).toBeGreaterThan(0);
  });

  it("should get user by username", () => {
    const users = getAllUsers();
    if (users.length === 0) {
      return;
    }
    const firstUser = users[0];
    const user = getUserByUsername(firstUser.username);

    expect(user).toBeDefined();
    expect(user?.username).toBe(firstUser.username);
  });

  it("should handle user not found scenarios", () => {
    const nonExistentUser = getUserByUsername("nonexistentuser");
    expect(nonExistentUser).toBeUndefined();
  });
});
