---
title: "ONE CLASS"
phrase: "One responsibility, one reason to change"
category: "SRP"
color: "bg-blue-500"
---

The Single Responsibility Principle (SRP) states that a class or module should have one, and only one, reason to change. This means it should have a single, well-defined purpose. Following this makes your code easier to understand, test, and maintain.

When a class has multiple responsibilities, changes to one responsibility can inadvertently break functionality related to another responsibility. This coupling makes the code fragile and unpredictable.

A classic violation is a User class that handles both user data management and email sending. When the email system changes (new provider, different templates), the User class must change too, even though user data logic is unaffected. The solution is to separate these into User and EmailService classes.

Another common violation is a ReportGenerator that both calculates report data and formats it for display. Changes to calculation logic shouldn't affect formatting, and vice versa. Split this into ReportCalculator and ReportFormatter classes for better maintainability.

SRP isn't just about the number of methods in a class—it's about cohesion. All the methods and properties should work together toward a single, clear purpose. If you find yourself using "and" when describing what a class does, it might be doing too much.

Classes that follow SRP are dramatically easier to test because you can focus on one behavior at a time. They're also easier to reuse because they don't carry unnecessary dependencies, and easier to modify because changes have a clear, limited scope.
