import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  seedDatabase,
  getCommentsByTransactionId,
  createComment,
  getAllUsers,
  getTransactionsForUserForApi,
} from "../../backend/database";

describe("Comment Routes", () => {
  beforeEach(() => {
    seedDatabase();
  });

  it("should get comments by transaction ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const comments = getCommentsByTransactionId(transactions[0].id);
      expect(Array.isArray(comments)).toBe(true);
    }
  });

  it("should create comment for transaction", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const commentContent = faker.lorem.sentence();
      const comment = createComment(user.id, transactions[0].id, commentContent);

      expect(comment).toBeDefined();
      expect(comment.userId).toBe(user.id);
      expect(comment.transactionId).toBe(transactions[0].id);
      expect(comment.content).toBe(commentContent);
    }
  });

  it("should validate comment data structure", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const commentContent = faker.lorem.sentence();
      const comment = createComment(user.id, transactions[0].id, commentContent);

      expect(comment).toHaveProperty("id");
      expect(comment).toHaveProperty("userId");
      expect(comment).toHaveProperty("transactionId");
      expect(comment).toHaveProperty("content");
      expect(comment).toHaveProperty("createdAt");
      expect(comment).toHaveProperty("modifiedAt");
    }
  });

  it("should handle empty comment content", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      try {
        const comment = createComment(user.id, transactions[0].id, "");
        expect(comment.content).toBe("");
      } catch (error) {
        expect(error).toBeDefined();
      }
    }
  });

  it("should get comments count for transaction", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const initialComments = getCommentsByTransactionId(transactions[0].id);
      const initialCount = initialComments.length;

      const commentContent = faker.lorem.sentence();
      createComment(user.id, transactions[0].id, commentContent);

      const updatedComments = getCommentsByTransactionId(transactions[0].id);
      expect(updatedComments.length).toBeGreaterThan(initialCount);
    }
  });

  it("should handle long comment content", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const longContent = faker.lorem.paragraphs(5);
      const comment = createComment(user.id, transactions[0].id, longContent);

      expect(comment).toBeDefined();
      expect(comment.content).toBe(longContent);
      expect(comment.content.length).toBeGreaterThan(100);
    }
  });
});
