---
title: "A SINGLE REASON"
phrase: "One reason to change"
category: "SRP"
color: "bg-indigo-500"
---

This is the essence of the Single Responsibility Principle (SRP). If a class needs to change for more than one reason (e.g., fixing a calculation and changing a database connection), it's likely doing too much. Splitting it allows you to make focused, safe changes.

When you need to modify a class, you should be able to clearly identify why the change is necessary and be confident that the change won't affect unrelated functionality. If you find yourself worried about breaking something seemingly unrelated, it's a sign the class has too many responsibilities.

The "reason to change" is often tied to different stakeholders or business requirements. A class that handles both user interface concerns and business logic will change when UI requirements change AND when business rules change—that's two reasons, which violates SRP.

To identify multiple reasons for change, ask yourself: "Who would request changes to this class?" If the answer includes multiple roles (UI designer, business analyst, database administrator), you likely have multiple responsibilities that should be separated.

Another technique is to examine your class's imports and dependencies. If a class imports both UI frameworks and database libraries, it's probably handling both presentation and persistence concerns. Similarly, if unit tests for a class require mocking many different types of dependencies, it's a strong indicator of multiple responsibilities.

When refactoring to achieve single responsibility, start by identifying the different "actors" or stakeholders who might request changes. Create separate classes for each actor's concerns, then use composition or dependency injection to coordinate between them when necessary.
