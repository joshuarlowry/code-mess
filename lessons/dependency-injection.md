---
title: "Dependency Injection"
phrase: "Don't call us, we'll call you"
category: "OOP"
color: "bg-orange-500"
---

Dependency Injection is a design pattern where objects receive their dependencies from external sources rather than creating them internally. This inverts the control of dependency creation, making code more flexible and testable.

Instead of a class creating its own dependencies, they are "injected" from the outside, typically through constructor parameters, method parameters, or property setters. This allows for easy substitution of dependencies, especially useful for testing with mock objects.

Consider a UserService that needs a database connection. Rather than creating the connection internally, it receives it as a constructor parameter. This allows you to inject a real database in production and a mock database in tests.

This pattern reduces coupling between classes, makes code more modular, and enables powerful techniques like inversion of control containers that can automatically wire up complex object graphs.
