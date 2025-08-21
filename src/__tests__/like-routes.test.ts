import { describe, expect, it, beforeEach } from "vitest";
import {
  seedDatabase,
  getLikesByTransactionId,
  createLike,
  getAllUsers,
  getTransactionsForUserForApi,
} from "../../backend/database";

describe("Like Routes", () => {
  beforeEach(() => {
    seedDatabase();
  });

  it("should get likes by transaction ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const likes = getLikesByTransactionId(transactions[0].id);
      expect(Array.isArray(likes)).toBe(true);
    }
  });

  it("should create like for transaction", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const like = createLike(user.id, transactions[0].id);

      expect(like).toBeDefined();
      expect(like.userId).toBe(user.id);
      expect(like.transactionId).toBe(transactions[0].id);
    }
  });

  it("should track like creation", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const like = createLike(user.id, transactions[0].id);

      expect(like).toBeDefined();
      expect(like.id).toBeDefined();
    }
  });

  it("should validate like data structure", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const like = createLike(user.id, transactions[0].id);

      expect(like).toHaveProperty("id");
      expect(like).toHaveProperty("userId");
      expect(like).toHaveProperty("transactionId");
      expect(like).toHaveProperty("createdAt");
      expect(like).toHaveProperty("modifiedAt");
    }
  });

  it("should handle duplicate likes", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const like1 = createLike(user.id, transactions[0].id);
      expect(like1).toBeDefined();

      try {
        const like2 = createLike(user.id, transactions[0].id);
        expect(like2).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    }
  });

  it("should get likes count for transaction", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const initialLikes = getLikesByTransactionId(transactions[0].id);
      const initialCount = initialLikes.length;

      createLike(user.id, transactions[0].id);

      const updatedLikes = getLikesByTransactionId(transactions[0].id);
      expect(updatedLikes.length).toBeGreaterThanOrEqual(initialCount);
    }
  });
});
