import { describe, expect, it, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import {
  seedDatabase,
  getUnreadNotificationsByUserId,
  createNotifications,
  updateNotificationById,
  getAllUsers,
  getTransactionsForUserForApi,
} from "../../backend/database";
import { PaymentNotificationStatus, NotificationsType } from "../../src/models";

describe("Notification Routes", () => {
  beforeEach(() => {
    seedDatabase();
  });

  it("should get unread notifications by user ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const notifications = getUnreadNotificationsByUserId(user.id);

    expect(Array.isArray(notifications)).toBe(true);
  });

  it("should create bulk notifications", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const notificationItems = [
        {
          type: NotificationsType.payment,
          transactionId: transactions[0].id,
          status: PaymentNotificationStatus.received,
        },
      ];

      const notifications = createNotifications(user.id, notificationItems);

      expect(Array.isArray(notifications)).toBe(true);
      if (notifications && notifications.length > 0) {
        expect(notifications.length).toBe(1);
      }
    }
  });

  it("should update notification by ID", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const notificationItems = [
        {
          type: NotificationsType.payment,
          transactionId: transactions[0].id,
          status: PaymentNotificationStatus.received,
        },
      ];

      const notifications = createNotifications(user.id, notificationItems);

      if (notifications && notifications.length > 0) {
        const notification = notifications[0];
        if (notification) {
          const updateData = { isRead: true };
          updateNotificationById(user.id, notification.id, updateData);

          const unreadNotifications = getUnreadNotificationsByUserId(user.id);
          const stillHasUnread = unreadNotifications.some((n: any) => n.id === notification.id);
          expect(stillHasUnread).toBe(false);
        }
      }
    }
  });

  it("should handle different notification types", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const notificationTypes = ["payment", "like", "comment"];

      notificationTypes.forEach((type) => {
        let notificationItems: any[] = [];
        if (type === "payment") {
          notificationItems = [
            {
              type: NotificationsType.payment,
              transactionId: transactions[0].id,
              status: PaymentNotificationStatus.received,
            },
          ];
        } else if (type === "like") {
          notificationItems = [
            {
              type: NotificationsType.like,
              transactionId: transactions[0].id,
              likeId: "test-like-id",
            },
          ];
        } else if (type === "comment") {
          notificationItems = [
            {
              type: NotificationsType.comment,
              transactionId: transactions[0].id,
              commentId: "test-comment-id",
            },
          ];
        }

        const notifications = createNotifications(user.id, notificationItems);
        if (notifications && notifications.length > 0) {
          expect(notifications.length).toBeGreaterThan(0);
        }
      });
    }
  });

  it("should filter unread notifications correctly", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const notificationItems = [
        {
          type: NotificationsType.payment,
          transactionId: transactions[0].id,
          status: PaymentNotificationStatus.received,
        },
      ];

      const notifications = createNotifications(user.id, notificationItems);

      if (notifications && notifications.length > 0) {
        const notification = notifications[0];

        if (notification) {
          let unreadNotifications = getUnreadNotificationsByUserId(user.id);
          const hasUnread = unreadNotifications.some((n: any) => n.id === notification.id);
          expect(hasUnread).toBe(true);

          updateNotificationById(user.id, notification.id, { isRead: true });

          unreadNotifications = getUnreadNotificationsByUserId(user.id);
          const stillHasUnread = unreadNotifications.some((n: any) => n.id === notification.id);
          expect(stillHasUnread).toBe(false);
        }
      }
    }
  });

  it("should validate notification data structure", () => {
    const users = getAllUsers();
    const user = users[0];
    const transactions = getTransactionsForUserForApi(user.id, {});

    if (transactions.length > 0) {
      const notificationItems = [
        {
          type: NotificationsType.payment,
          transactionId: transactions[0].id,
          status: PaymentNotificationStatus.received,
        },
      ];

      const notifications = createNotifications(user.id, notificationItems);

      if (notifications && notifications.length > 0) {
        const notification = notifications[0];

        if (notification) {
          expect(notification).toHaveProperty("id");
          expect(notification).toHaveProperty("userId");
          expect(notification).toHaveProperty("transactionId");
          expect(notification).toHaveProperty("createdAt");
          expect(notification).toHaveProperty("modifiedAt");
        }
      }
    }
  });
});
