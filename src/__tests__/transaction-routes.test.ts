import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  seedDatabase,
  getTransactionsForUserForApi,
  getTransactionsForUserContacts,
  createTransaction,
  updateTransactionById,
  getPublicTransactionsDefaultSort,
  getTransactionByIdForApi,
  getPublicTransactionsByQuery,
  getUserById,
  getAllUsers,
} from "../../backend/database";
import { TransactionStatus, TransactionRequestStatus } from "../../src/models";
import { DefaultPrivacyLevel } from "../../src/models/user";

describe("Transaction Routes", () => {
  beforeEach(() => {
    return seedDatabase();
  });

  it("should get transactions for user", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    expect(Array.isArray(transactions)).toBe(true);
  });

  it("should get transactions for user contacts", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserContacts(user.id, {});

    expect(Array.isArray(transactions)).toBe(true);
  });

  it("should create new transaction", () => {
    const users = getAllUsers();
    if (users.length < 2) {
      return;
    }
    const sender = users[0];
    const receiver = users[1];

    const transactionData = {
      source: "",
      receiverId: receiver.id,
      senderId: sender.id,
      description: faker.lorem.sentence(),
      amount: faker.datatype.number({ min: 100, max: 10000 }),
      privacyLevel: DefaultPrivacyLevel.public,
      status: TransactionStatus.pending,
    };

    const transaction = createTransaction(sender.id, "payment", transactionData);

    expect(transaction).toBeDefined();
    expect(transaction.senderId).toBe(sender.id);
    expect(transaction.receiverId).toBe(receiver.id);
    expect(transaction.description).toBe(transactionData.description);
    expect(transaction.amount).toBe(transactionData.amount * 100);
  });

  it("should get transaction by ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const transaction = getTransactionByIdForApi(transactions[0].id);
      expect(transaction).toBeDefined();
      expect(transaction?.id).toBe(transactions[0].id);
    }
  });

  it("should update transaction status", () => {
    const users = getAllUsers();
    if (users.length < 2) {
      return;
    }
    const sender = users[0];
    const receiver = users[1];

    const transactionData = {
      source: "",
      receiverId: receiver.id,
      senderId: sender.id,
      description: faker.lorem.sentence(),
      amount: faker.datatype.number({ min: 100, max: 10000 }),
      privacyLevel: DefaultPrivacyLevel.public,
      status: TransactionStatus.pending,
    };

    const transaction = createTransaction(sender.id, "request", transactionData);

    const updateData = {
      requestStatus: TransactionRequestStatus.accepted,
    };

    updateTransactionById(transaction.id, updateData);
    const updatedTransaction = getTransactionByIdForApi(transaction.id);
    expect(updatedTransaction?.requestStatus).toBe(TransactionRequestStatus.accepted);
  });

  it("should get public transactions with default sort", () => {
    const users = getAllUsers();
    const user = users[0];
    const result = getPublicTransactionsDefaultSort(user.id);

    expect(result).toBeDefined();
    expect(result.publicTransactions).toBeDefined();
    expect(result.contactsTransactions).toBeDefined();
    expect(Array.isArray(result.publicTransactions)).toBe(true);
    expect(Array.isArray(result.contactsTransactions)).toBe(true);
  });

  it("should get public transactions by query", () => {
    const users = getAllUsers();
    const user = users[0];
    const query = { page: 1, limit: 10 };
    const result = getPublicTransactionsByQuery(user.id, query);

    expect(result).toBeDefined();
    expect(result.publicTransactions).toBeDefined();
    expect(result.contactsTransactions).toBeDefined();
  });

  it("should handle transaction filtering by status", () => {
    const users = getAllUsers();
    const user = users[0];
    const query = { status: TransactionStatus.complete };
    const transactions = getTransactionsForUserForApi(user.id, query);

    expect(Array.isArray(transactions)).toBe(true);
  });

  it("should handle transaction filtering by amount range", () => {
    const users = getAllUsers();
    const user = users[0];
    const query = { amountMin: 100, amountMax: 1000 };
    const transactions = getTransactionsForUserForApi(user.id, query);

    expect(Array.isArray(transactions)).toBe(true);
  });
});
