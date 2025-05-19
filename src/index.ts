type Conjunction = 'all' | 'any' | 'not_all' | 'not_any';

type Operator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'has' | 'regex';

export type Predicate = {
  fact: string;
  op: Operator;
  value: unknown;
};

export type Ruleset = Predicate | [Conjunction, ...Ruleset[]];

type Facts = Record<string, unknown>;

class RulesetEngine {
  constructor(private rules: Ruleset) {}

  public evaluate(facts: Facts, ruleset?: Ruleset): boolean {
    const n = ruleset ?? this.rules;
    if (Array.isArray(n)) {
      const [op, ...kids] = n;
      const res = kids.map(k => this.evaluate(facts, k));
      switch (op) {
        case "all":
          return res.every(Boolean);
        case "any":
          return res.some(Boolean);
        case "not_all":
          return !res.every(Boolean);
        case "not_any":
          return !res.some(Boolean);
      }
    }
    return this.test(n, facts);
  }

  private tpl(v: unknown, ctx: Facts) {
    return typeof v === 'string' && v.startsWith('{{') && v.endsWith('}}')
      ? v.slice(2, -2).trim().split('.').reduce<any>((o, k) => o?.[k], ctx)
      : v;
  };

  private test(p: Predicate, f: Facts): boolean {
    const L = p.fact.split('.').reduce<any>((o, k) => o?.[k], f);
    const R = this.tpl(p.value, f);
    switch (p.op) {
      case 'eq':
        return L === R;
      case 'gt':
        return +L >  +R;
      case 'gte':
        return +L >= +R;
      case 'lt':
        return +L <  +R;
      case 'lte':
        return +L <= +R;
      case 'in':
        return R.includes(L);
      case 'has':
        return L.includes(String(R));
      case 'regex':
        return new RegExp(String(R)).test(String(L));
    }
  }
}

export { RulesetEngine };
