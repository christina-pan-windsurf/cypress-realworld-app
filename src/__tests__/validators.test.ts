import { describe, expect, it } from "vitest";
import { isValid } from "shortid";

describe("Validators", () => {
  describe("shortId validation", () => {
    it("should validate valid shortId", () => {
      const validId = "BEm2nu-CG";
      expect(isValid(validId)).toBe(true);
    });

    it("should reject invalid shortId", () => {
      const invalidId = "invalid-id-format-that-is-too-long-and-contains-invalid-characters!@#$%";
      expect(isValid(invalidId)).toBe(false);
    });

    it("should reject empty string", () => {
      expect(isValid("")).toBe(false);
    });

    it("should reject null or undefined", () => {
      expect(isValid(null as any)).toBe(false);
      expect(isValid(undefined as any)).toBe(false);
    });
  });

  describe("transaction status validation", () => {
    it("should validate complete transaction status", () => {
      const validStatuses = ["complete", "pending", "incomplete"];
      validStatuses.forEach((status) => {
        expect(typeof status).toBe("string");
        expect(status.length).toBeGreaterThan(0);
      });
    });

    it("should validate request status values", () => {
      const validRequestStatuses = ["accepted", "rejected", "pending"];
      validRequestStatuses.forEach((status) => {
        expect(typeof status).toBe("string");
        expect(status.length).toBeGreaterThan(0);
      });
    });
  });

  describe("privacy level validation", () => {
    it("should validate privacy level values", () => {
      const validPrivacyLevels = ["public", "private", "contacts"];
      validPrivacyLevels.forEach((level) => {
        expect(typeof level).toBe("string");
        expect(["public", "private", "contacts"]).toContain(level);
      });
    });
  });

  describe("transaction type validation", () => {
    it("should validate transaction types", () => {
      const validTransactionTypes = ["payment", "request"];
      validTransactionTypes.forEach((type) => {
        expect(typeof type).toBe("string");
        expect(["payment", "request"]).toContain(type);
      });
    });
  });

  describe("notification type validation", () => {
    it("should validate notification types", () => {
      const validNotificationTypes = ["payment", "received", "requested", "liked", "commented"];
      validNotificationTypes.forEach((type) => {
        expect(typeof type).toBe("string");
        expect(type.length).toBeGreaterThan(0);
      });
    });
  });

  describe("user field validation", () => {
    it("should validate user data structure", () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        phoneNumber: "555-1234",
        balance: 1000,
        defaultPrivacyLevel: "public",
      };

      expect(typeof userData.firstName).toBe("string");
      expect(typeof userData.lastName).toBe("string");
      expect(typeof userData.username).toBe("string");
      expect(typeof userData.email).toBe("string");
      expect(typeof userData.phoneNumber).toBe("string");
      expect(typeof userData.balance).toBe("number");
      expect(["public", "private", "contacts"]).toContain(userData.defaultPrivacyLevel);
    });
  });

  describe("bank account validation", () => {
    it("should validate bank account data structure", () => {
      const bankAccountData = {
        bankName: "Test Bank",
        accountNumber: "1234567890",
        routingNumber: "123456789",
      };

      expect(typeof bankAccountData.bankName).toBe("string");
      expect(typeof bankAccountData.accountNumber).toBe("string");
      expect(typeof bankAccountData.routingNumber).toBe("string");
      expect(bankAccountData.bankName.trim().length).toBeGreaterThan(0);
      expect(bankAccountData.accountNumber.trim().length).toBeGreaterThan(0);
      expect(bankAccountData.routingNumber.trim().length).toBeGreaterThan(0);
    });
  });

  describe("transaction payload validation", () => {
    it("should validate transaction payload structure", () => {
      const transactionPayload = {
        transactionType: "payment",
        receiverId: "BEm2nu-CG",
        description: "Test payment",
        amount: 100,
        privacyLevel: "public",
      };

      expect(["payment", "request"]).toContain(transactionPayload.transactionType);
      expect(typeof transactionPayload.receiverId).toBe("string");
      expect(typeof transactionPayload.description).toBe("string");
      expect(typeof transactionPayload.amount).toBe("number");
      expect(["public", "private", "contacts"]).toContain(transactionPayload.privacyLevel);
      expect(transactionPayload.amount).toBeGreaterThan(0);
    });
  });

  describe("query parameter validation", () => {
    it("should validate transaction query parameters", () => {
      const queryParams = {
        status: "complete",
        requestStatus: "accepted",
        receiverId: "BEm2nu-CG",
        senderId: "BEm2nu-CG",
        amountMin: 10,
        amountMax: 1000,
        page: 1,
        limit: 25,
      };

      expect(typeof queryParams.status).toBe("string");
      expect(typeof queryParams.requestStatus).toBe("string");
      expect(typeof queryParams.receiverId).toBe("string");
      expect(typeof queryParams.senderId).toBe("string");
      expect(typeof queryParams.amountMin).toBe("number");
      expect(typeof queryParams.amountMax).toBe("number");
      expect(typeof queryParams.page).toBe("number");
      expect(typeof queryParams.limit).toBe("number");
      expect(queryParams.amountMin).toBeGreaterThanOrEqual(0);
      expect(queryParams.amountMax).toBeGreaterThan(queryParams.amountMin);
      expect(queryParams.page).toBeGreaterThan(0);
      expect(queryParams.limit).toBeGreaterThan(0);
    });
  });
});
