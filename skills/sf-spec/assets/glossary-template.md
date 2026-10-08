# <Context name>

<!--
Save as GLOSSARY.md at the repo root (one context), or in each context's folder
when GLOSSARY-MAP.md exists. Create it when the first term is settled, not before.
Rules, from sf-spec references/domain-modeling.md:
- One preferred term per concept, in bold. Other words for it go under Avoid.
- One or two sentences per definition: what it is, not what it does or how it's stored.
- Only this project's own terms. General programming words stay out.
- No implementation details: no file, class, table, endpoint or library names.
- Group under subheadings once clusters appear; a flat list is fine until then.
Delete these comments and the example terms.
-->

<One or two sentences: what this context covers and why it exists.>

## Language

### <Cluster, e.g. Ordering>

**Order**:
A customer's request for one or more products, placed in a single checkout.
_Avoid_: purchase, transaction

**Order line**:
One product and quantity within an order.
_Avoid_: item, row

### <Cluster, e.g. Billing>

**Invoice**:
The document that tells a customer what they owe once their goods have been delivered.
_Avoid_: bill, payment request

---

# Glossary map

<!--
Only when the same word means different things in different parts of the repo
and the user agreed to split. Save as GLOSSARY-MAP.md at the repo root; each
context then keeps its own GLOSSARY.md in the format above.
-->

## Contexts

- [Ordering](./src/ordering/GLOSSARY.md): records what customers order and follows each order to delivery
- [Billing](./src/billing/GLOSSARY.md): raises invoices and collects what is owed

## Relationships

- **Ordering → Billing**: <how they relate, in domain terms, e.g. "Billing invoices an order once it is delivered">
- **Ordering ↔ Billing**: <shared concepts, e.g. "both refer to a Customer by its ID">
