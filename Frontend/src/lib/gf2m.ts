// src/lib/gf2m.ts
export type Step =
  | { kind: "mul"; i: number; bBit: number; aBefore: number; aAfter: number; pBefore: number; pAfter: number }
  | { kind: "reduce"; carry: number; before: number; after: number }
  | { kind: "mod"; before: number; after: number }
  | { kind: "exp"; bit: number; baseBefore: number; baseAfter: number; accBefore: number; accAfter: number }
  | { kind: "egcd"; a: number; b: number; q: number; r: number; t0: number; t1: number };

export type GFConfig = {
  m: number;                 // 2..8
  modPoly: number;           // irreducible poly as hex (e.g., 0x11B for AES)
};

const MASK = (m: number) => ((1 << m) - 1) & 0xff;

/** Add/Sub in GF(2^m) = XOR */
export function gfAdd(a: number, b: number): number {
  return (a ^ b) & 0xff;
}

/** xtime under given modulus (carry-aware left shift with reduction) */
export function xtime(a: number, cfg: GFConfig, steps?: Step[]): number {
  const carry = a & 0x80 ? 1 : 0;
  let out = ((a << 1) & 0xff);
  if (carry) {
    const before = out;
    out ^= cfg.modPoly & 0xff;
    steps?.push({ kind: "reduce", carry, before, after: out });
  }
  return out & 0xff;
}

/** Russian-peasant multiply with reduction */
export function gfMul(a: number, b: number, cfg: GFConfig, steps: Step[] = []): { value: number; steps: Step[] } {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    const bBit = b & 1;
    const pBefore = p;
    const aBefore = a;
    if (bBit) p ^= a;
    steps.push({
      kind: "mul",
      i,
      bBit,
      aBefore,
      aAfter: 0,       // filled after xtime
      pBefore,
      pAfter: p,
    });
    const a2 = xtime(a, cfg, steps);
    steps[steps.length - 1] = { ...(steps[steps.length - 1] as any), aAfter: a2 };
    a = a2;
    b >>= 1;
  }
  return { value: p & MASK(cfg.m), steps };
}

/** Modular reduction (for future custom polys from polys > m) */
export function gfMod(x: number, cfg: GFConfig, steps: Step[] = []): { value: number; steps: Step[] } {
  const m = cfg.m;
  // For bytes we rarely need explicit mod, but keep for completeness:
  const before = x;
  const after = x & MASK(m);
  if (before !== after) steps.push({ kind: "mod", before, after });
  return { value: after, steps };
}

/** Binary exponentiation */
export function gfPow(base: number, exp: number, cfg: GFConfig): { value: number; steps: Step[] } {
  let a = base & MASK(cfg.m);
  let acc = 1;
  const steps: Step[] = [];
  let e = exp >>> 0;

  while (e > 0) {
    const bit = e & 1;
    const accBefore = acc, baseBefore = a;
    if (bit) acc = gfMul(acc, a, cfg).value;
    a = gfMul(a, a, cfg).value;
    steps.push({
      kind: "exp",
      bit,
      baseBefore,
      baseAfter: a,
      accBefore,
      accAfter: acc,
    });
    e >>= 1;
  }
  return { value: acc & MASK(cfg.m), steps };
}

/** Extended Euclid in GF(2)[x] to compute multiplicative inverse in GF(2^m) */
export function gfInv(a: number, cfg: GFConfig): { value: number; steps: Step[] } {
  if ((a & MASK(cfg.m)) === 0) return { value: 0, steps: [] };

  // Polynomials represented by integers
  let u = a;
  let v = cfg.modPoly;       // modulus polynomial
  let g1 = 1;
  let g2 = 0;
  const steps: Step[] = [];

  const degree = (x: number) => 31 - Math.clz32(x);
  const polyDivStep = (num: number, den: number) => 1 << (degree(num) - degree(den));

  while (u !== 1) {
    if (u === 0) return { value: 0, steps }; // no inverse
    if (degree(u) < degree(v)) {
      [u, v] = [v, u];
      [g1, g2] = [g2, g1];
    }
    const q = polyDivStep(u, v);
    const r = u ^ (v << (degree(u) - degree(v)));
    steps.push({ kind: "egcd", a: u, b: v, q, r, t0: g1, t1: g2 });
    u = r;
    g1 = g1 ^ (g2 << (degree(u ^ r) - degree(v))); // align with same shift as r op
  }

  return { value: g1 & MASK(cfg.m), steps };
}
