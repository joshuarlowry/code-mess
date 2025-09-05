---
title: "ENCAPSULATION"
phrase: "Hide the implementation details"
category: "OOP"
color: "bg-pink-500"
---

Encapsulation is the practice of hiding the internal state of an object from the outside world. This prevents direct modification of data and forces interaction through public methods, giving you more control and preventing bugs from accidental changes.

When internal state is exposed, any part of the system can modify it directly, making it impossible to guarantee the object remains in a valid state. Encapsulation allows objects to enforce their own invariants and business rules.

Good encapsulation means that the internal implementation can change without affecting code that uses the object. This flexibility is crucial for maintaining and evolving software systems over time. The public interface becomes a contract that remains stable while the implementation can be optimized or refactored.
