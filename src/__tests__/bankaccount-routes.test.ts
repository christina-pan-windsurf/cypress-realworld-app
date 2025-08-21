import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  seedDatabase,
  getBankAccountsByUserId,
  getBankAccountById,
  createBankAccountForUser,
  removeBankAccountById,
  getAllUsers,
} from "../../backend/database";

describe("Bank Account Routes", () => {
  beforeEach(() => {
    return seedDatabase();
  });

  it("should get bank accounts by user ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const accounts = getBankAccountsByUserId(user.id);

    expect(Array.isArray(accounts)).toBe(true);
  });

  it("should get bank account by ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const accounts = getBankAccountsByUserId(user.id);

    if (accounts.length > 0) {
      const account = getBankAccountById(accounts[0].id);
      expect(account).toBeDefined();
      expect(account?.id).toBe(accounts[0].id);
    }
  });

  it("should create bank account for user", () => {
    const users = getAllUsers();
    const user = users[0];

    const accountData = {
      bankName: faker.company.companyName(),
      accountNumber: faker.finance.account(),
      routingNumber: faker.finance.routingNumber(),
    };

    const account = createBankAccountForUser(user.id, accountData);

    expect(account).toBeDefined();
    expect(account.userId).toBe(user.id);
    expect(account.bankName).toBe(accountData.bankName);
    expect(account.accountNumber).toBe(accountData.accountNumber);
    expect(account.routingNumber).toBe(accountData.routingNumber);
  });

  it("should remove bank account by ID", () => {
    const users = getAllUsers();
    const user = users[0];

    const accountData = {
      bankName: faker.company.companyName(),
      accountNumber: faker.finance.account(),
      routingNumber: faker.finance.routingNumber(),
    };

    const account = createBankAccountForUser(user.id, accountData);
    removeBankAccountById(account.id);

    const removedAccount = getBankAccountById(account.id);
    expect(removedAccount).toBeDefined();
    expect(removedAccount?.isDeleted).toBe(true);
  });

  it("should handle getting accounts for user with no accounts", () => {
    const users = getAllUsers();
    const user = users.find((u) => {
      const accounts = getBankAccountsByUserId(u.id);
      return accounts.length === 0;
    });

    if (user) {
      const accounts = getBankAccountsByUserId(user.id);
      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBe(0);
    }
  });

  it("should validate bank account data structure", () => {
    const users = getAllUsers();
    const user = users[0];

    const accountData = {
      bankName: faker.company.companyName(),
      accountNumber: faker.finance.account(),
      routingNumber: faker.finance.routingNumber(),
    };

    const account = createBankAccountForUser(user.id, accountData);

    expect(account).toHaveProperty("id");
    expect(account).toHaveProperty("userId");
    expect(account).toHaveProperty("bankName");
    expect(account).toHaveProperty("accountNumber");
    expect(account).toHaveProperty("routingNumber");
    expect(account).toHaveProperty("isDeleted");
    expect(account).toHaveProperty("createdAt");
    expect(account).toHaveProperty("modifiedAt");
  });

  it("should handle non-existent bank account ID", () => {
    const account = getBankAccountById("nonexistentid");
    expect(account).toBeUndefined();
  });
});
