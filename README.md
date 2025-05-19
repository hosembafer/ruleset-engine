# ⚙️ Ruleset Engine

[![npm version](https://img.shields.io/npm/v/ruleset-engine?logo=npm&logoColor=CB3837)](https://www.npmjs.com/package/ruleset-engine)
[![npm size](https://img.shields.io/bundlephobia/minzip/ruleset-engine?logo=javascript&logoColor=#F7DF1E)](https://www.npmjs.com/package/ruleset-engine)
![license](https://img.shields.io/github/license/hosembafer/ruleset-engine)

A tiny (≈ 1 KB gzipped), zero-dependency TypeScript library for evaluating rule trees expressed as JSON-serializable data.

```ts
import { RulesetEngine } from 'ruleset-engine';

const rules = [
  'all',
  { fact: 'age', op: 'gte', value: 18 },
  { fact: 'country', op: 'eq', value: 'AM' }
] as const;

const engine = new RulesetEngine(rules);

engine.evaluate({ age: 21, country: 'AM' }); // → true
````

---

## ✨ Features

| Feature                      | Notes                                                                                |
| ---------------------------- |--------------------------------------------------------------------------------------|
| **Declarative rules**        | Compose predicates with `all`, `any`, `not_all`, and `not_any`—no code in your data. |
| **Rich operator set**        | `eq`, `gt`, `gte`, `lt`, `lte`, `in`, `has`, and `regex` out of the box.             |
| **String-template look-ups** | Reference dynamic data with `{{ path.to.value }}` placeholders.                      |
| **TypeScript-first**         | Fully typed API—all rules are validated at compile time.                             |
| **Runtime-agnostic**         | Works in Node, Bun, Deno, or directly in the browser (IIFE/UMD/ESM).                 |

---

## 📦 Install

```bash
# ESM / Node ≥18
npm i ruleset-engine
# or
yarn add ruleset-engine
# or
pnpm add ruleset-engine
```

Via CDN (UMD):

```html
<script src="https://cdn.jsdelivr.net/npm/ruleset-engine/dist-cdn/index.umd.js"></script>
<script>
  const engine = new RulesetEngine(...);
  /* … */
</script>
```

---

## 🚀 Quick start

```ts
import { RulesetEngine, Ruleset } from 'ruleset-engine';

const discountRules: Ruleset = [
  'any',
  ['all',
    { fact: 'user.segment', op: 'eq', value: 'vip' },
    { fact: 'order.total', op: 'gte', value: 100 }
  ],
  { fact: 'coupon', op: 'eq', value: 'SUMMER25' }
];

const engine = new RulesetEngine(discountRules);

engine.evaluate({
  user: { segment: 'vip' },
  order: { total: 130 },
  coupon: null
}); // → true
```

---

## 📚 Rule syntax

```ts
type Conjunction = 'all' | 'any' | 'not_all' | 'not_any';

type Operator =
  | 'eq'    // strict equality
  | 'gt'    // >
  | 'gte'   // ≥
  | 'lt'    // <
  | 'lte'   // ≤
  | 'in'    // left ∈ right[]
  | 'has'   // right ⊂ left[]
  | 'regex' // RegExp test

type Predicate = { fact: string; op: Operator; value: unknown };

export type Ruleset = Predicate | [Conjunction, ...Ruleset[]];
```

### String-template values

If `value` is a string wrapped in `{{ }}`, it is resolved against the current fact set **at evaluation time**:

```ts
{ fact: 'order.total', op: 'gt', value: '{{ user.maxSpend }}' }
```

---

## 🔌 Extending operators

Need a custom operator? Just derive your own class:

```ts
class ExtEngine extends RulesetEngine {
  protected override test(p: Predicate, f: Record<string, unknown>) {
    if (p.op === 'startsWith') {
      const L = this.factValue(p.fact, f);
      const R = String(this.tpl(p.value, f));
      return String(L).startsWith(R);
    }
    return super.test(p, f);
  }
}
```

---

## 🛠 API

| Method                        | Description                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `new RulesetEngine(rules)`    | Create an engine instance. `rules` is any valid **Ruleset**.                             |
| `.evaluate(facts, [ruleset])` | Evaluate `ruleset` (defaults to the root) against a `facts` object. Returns **boolean**. |
