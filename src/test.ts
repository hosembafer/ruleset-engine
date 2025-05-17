import { Ruleset, RulesetEngine } from './index.ts';

const engine = new RulesetEngine([
  "and",
  { "fact": "country", "op": "eq", "value": "US" },
  [
    "or",
    [
      "and",
      { "fact": "device",  "op": "eq", "value": "mobile" },
      { "fact": "browser", "op": "regex", "value": "Chrome" }
    ],
    { "fact": "betaUser", "op": "eq", "value": true }
  ]
]);
const eligible = engine.evaluate({
  country: "US",
  device: "mobile",
  browser: "Chrome",
  betaUser: true
});
console.log({ eligible });

const activationEngine = new RulesetEngine([
  "and",
  ["not", {fact: "path", op: 'eq', value: "/app"}],
  [
    "or",
    {fact: "path", op: 'eq', value: "/app/login"},
    {fact: "path", op: 'eq', value: "/signup"}
  ],
  {fact: 'url', op: 'has', value: 'https'}
]);
const activationEligible = activationEngine.evaluate({
  path: "/app/login",
  url: "https://example.com/app/login",
});
console.log({ activationEligible });
