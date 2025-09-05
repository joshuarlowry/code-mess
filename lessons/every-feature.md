---
title: "EVERY FEATURE"
phrase: "Know where everything belongs"
category: "SRP"
color: "bg-sky-500"
---

Good design means you know exactly where a piece of logic belongs. With the Single Responsibility Principle (SRP), a new feature or change will naturally fit into a specific class or module that handles that type of responsibility. No more guessing where to put code.

When your codebase follows SRP, adding new functionality becomes straightforward. You don't spend time hunting through multiple files trying to figure out where to add a feature—the architecture itself guides you to the right place.

Consider an e-commerce system: when you need to add a new payment method, you know it belongs in the PaymentProcessor class, not mixed into the OrderManager or UserAccount classes. When you need to add email notifications, they go in the NotificationService, not scattered across business logic classes.

This architectural clarity prevents the common anti-pattern of "convenience coupling" where developers add functionality to whatever class they happen to be working in, simply because it's easier than finding or creating the proper home for the code.

This clarity also helps with code reviews and team collaboration. When responsibilities are clearly separated, team members can quickly understand where to look for specific functionality and where to make changes without stepping on each other's toes.

The result is a codebase that grows predictably rather than chaotically. New team members can quickly understand the system's organization, bugs are easier to isolate and fix, and refactoring becomes less risky because changes are contained within well-defined boundaries.
