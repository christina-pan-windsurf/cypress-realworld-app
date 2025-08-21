import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  seedDatabase,
  getBankTransfersByUserId,
  createBankTransfer,
  getBankAccountsByUserId,
  getAllUsers,
} from "../../backend/database";
import { BankTransferType } from "../../src/models";

describe("Bank Transfer Routes", () => {
  beforeEach(() => {
    seedDatabase();
  });

  it("should get bank transfers by user ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const transfers = getBankTransfersByUserId(user.id);

    expect(Array.isArray(transfers)).toBe(true);
  });

  it("should create bank transfer", () => {
    const users = getAllUsers();
    const user = users[0];
    const bankAccounts = getBankAccountsByUserId(user.id);

    if (bankAccounts.length > 0) {
      const transferData = {
        userId: user.id,
        source: bankAccounts[0].id,
        amount: faker.datatype.number({ min: 100, max: 10000 }),
        type: BankTransferType.deposit,
        transactionId: "",
      };

      const transfer = createBankTransfer(transferData);

      expect(transfer).toBeDefined();
      expect(transfer.userId).toBe(user.id);
      expect(transfer.source).toBe(transferData.source);
      expect(transfer.amount).toBe(transferData.amount);
      expect(transfer.type).toBe(transferData.type);
    }
  });

  it("should handle deposit transfers", () => {
    const users = getAllUsers();
    const user = users[0];
    const bankAccounts = getBankAccountsByUserId(user.id);

    if (bankAccounts.length > 0) {
      const transferData = {
        userId: user.id,
        source: bankAccounts[0].id,
        amount: faker.datatype.number({ min: 100, max: 10000 }),
        type: BankTransferType.deposit,
        transactionId: "",
      };

      const transfer = createBankTransfer(transferData);

      expect(transfer.type).toBe(BankTransferType.deposit);
      expect(transfer.amount).toBeGreaterThan(0);
    }
  });

  it("should handle withdrawal transfers", () => {
    const users = getAllUsers();
    const user = users[0];
    const bankAccounts = getBankAccountsByUserId(user.id);

    if (bankAccounts.length > 0) {
      const transferData = {
        userId: user.id,
        source: bankAccounts[0].id,
        amount: faker.datatype.number({ min: 100, max: 10000 }),
        type: BankTransferType.withdrawal,
        transactionId: "",
      };

      const transfer = createBankTransfer(transferData);

      expect(transfer.type).toBe(BankTransferType.withdrawal);
      expect(transfer.amount).toBeGreaterThan(0);
    }
  });

  it("should validate bank transfer data structure", () => {
    const users = getAllUsers();
    const user = users[0];
    const bankAccounts = getBankAccountsByUserId(user.id);

    if (bankAccounts.length > 0) {
      const transferData = {
        userId: user.id,
        source: bankAccounts[0].id,
        amount: faker.datatype.number({ min: 100, max: 10000 }),
        type: BankTransferType.deposit,
        transactionId: "",
      };

      const transfer = createBankTransfer(transferData);

      expect(transfer).toHaveProperty("id");
      expect(transfer).toHaveProperty("userId");
      expect(transfer).toHaveProperty("source");
      expect(transfer).toHaveProperty("amount");
      expect(transfer).toHaveProperty("type");
      expect(transfer).toHaveProperty("transactionId");
      expect(transfer).toHaveProperty("createdAt");
      expect(transfer).toHaveProperty("modifiedAt");
    }
  });

  it("should handle transfer amount validation", () => {
    const users = getAllUsers();
    const user = users[0];
    const bankAccounts = getBankAccountsByUserId(user.id);

    if (bankAccounts.length > 0) {
      const validAmount = 1000;
      const transferData = {
        userId: user.id,
        source: bankAccounts[0].id,
        amount: validAmount,
        type: BankTransferType.deposit,
        transactionId: "",
      };

      const transfer = createBankTransfer(transferData);

      expect(transfer.amount).toBe(validAmount);
      expect(transfer.amount).toBeGreaterThan(0);
      expect(typeof transfer.amount).toBe("number");
    }
  });

  it("should link bank transfer to transaction", () => {
    const users = getAllUsers();
    const user = users[0];
    const bankAccounts = getBankAccountsByUserId(user.id);

    if (bankAccounts.length > 0) {
      const transferData = {
        userId: user.id,
        source: bankAccounts[0].id,
        amount: faker.datatype.number({ min: 100, max: 10000 }),
        type: BankTransferType.deposit,
        transactionId: "",
      };

      const transfer = createBankTransfer(transferData);

      expect(transfer.transactionId).toBeDefined();
      expect(typeof transfer.transactionId).toBe("string");
    }
  });
});
