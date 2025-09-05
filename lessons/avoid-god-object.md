---
title: "AVOID THE GOD OBJECT"
phrase: "Delegate, don't dominate"
category: "SRP"
color: "bg-violet-500"
---

A 'God Object' is a class that knows or does too much. It's an anti-pattern that violates the Single Responsibility Principle (SRP). Instead of creating a giant, all-knowing object, delegate responsibilities to smaller, more focused classes. This creates a team of cooperating objects, not a single monolithic one.

God Objects are tempting because they seem to simplify things—everything is in one place. But this apparent simplicity is deceptive. God Objects become bottlenecks for development, testing, and maintenance. Every change requires understanding the entire massive class.

The solution is to break down the God Object into smaller, focused classes that each handle a specific aspect of the system. These classes can then collaborate through well-defined interfaces, creating a more flexible and maintainable architecture.
