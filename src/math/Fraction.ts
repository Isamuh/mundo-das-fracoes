export class Fraction {
  readonly numerator: number; readonly denominator: number;
  constructor(numerator: number, denominator: number) {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) throw new TypeError('A fração precisa de inteiros.');
    if (denominator === 0) throw new RangeError('O denominador não pode ser zero.');
    const sign = denominator < 0 ? -1 : 1; const gcd = Fraction.gcd(Math.abs(numerator), Math.abs(denominator));
    this.numerator = sign * numerator / gcd; this.denominator = Math.abs(denominator) / gcd;
  }
  add(other: Fraction): Fraction { return new Fraction(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator); }
  subtract(other: Fraction): Fraction { return new Fraction(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator); }
  multiply(other: Fraction): Fraction { return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator); }
  divide(other: Fraction): Fraction { return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator); }
  equals(other: Fraction): boolean { return this.numerator === other.numerator && this.denominator === other.denominator; }
  toString(): string { return this.denominator === 1 ? String(this.numerator) : `${this.numerator}/${this.denominator}`; }
  toNumber(): number { return this.numerator / this.denominator; }
  private static gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a || 1; }
}
