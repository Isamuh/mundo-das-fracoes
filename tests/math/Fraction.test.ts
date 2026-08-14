import { describe, expect, it } from 'vitest';
import { Fraction } from '../../src/math/Fraction';
describe('Fraction', () => {
  it('completa o inteiro com duas metades', () => expect(new Fraction(1, 2).add(new Fraction(1, 2)).equals(new Fraction(1, 1))).toBe(true));
  it('simplifica equivalências', () => expect(new Fraction(2, 4).equals(new Fraction(1, 2))).toBe(true));
  it('soma denominadores diferentes', () => expect(new Fraction(1, 2).add(new Fraction(1, 3)).toString()).toBe('5/6'));
  it('subtrai frações', () => expect(new Fraction(3, 4).subtract(new Fraction(1, 4)).toString()).toBe('1/2'));
  it('multiplica frações', () => expect(new Fraction(1, 2).multiply(new Fraction(1, 2)).toString()).toBe('1/4'));
  it('divide frações', () => expect(new Fraction(1, 2).divide(new Fraction(1, 4)).toString()).toBe('2'));
  it('rejeita denominador zero', () => expect(() => new Fraction(1, 0)).toThrow());
});
