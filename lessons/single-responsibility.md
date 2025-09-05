---
title: "Single Responsibility Principle"
phrase: "One job, done well"
category: "SRP"
color: "bg-blue-500"
---

The Single Responsibility Principle states that a class should have only one reason to change. This means each class should have a single, well-defined purpose and should not be responsible for multiple unrelated tasks.

When a class has multiple responsibilities, changes to one responsibility can affect the others, making the code fragile and harder to maintain. By keeping classes focused on a single responsibility, we create more modular, testable, and maintainable code.

Consider a User class that handles both user data and email notifications. If the email system changes, the User class must change too, even though user data management hasn't changed. Instead, separate these concerns into User and EmailNotifier classes.

This principle leads to better code organization, easier testing, and more flexible designs that can adapt to changing requirements without breaking existing functionality.
