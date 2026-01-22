import { describe, it, expect } from 'vitest';
import { ulidSchema, ulidOptionalSchema, isValidULID, getTimestampFromULID } from './validation';

describe('Validation Utilities', () => {
  describe('ulidSchema', () => {
    it('should validate a correct lowercase ULID', () => {
      const result = ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fav');
      expect(result.success).toBe(true);
    });

    it('should validate a correct uppercase ULID', () => {
      const result = ulidSchema.safeParse('01ARZ3NDEKTSV4RRFFQ69G5FAV');
      expect(result.success).toBe(true);
    });

    it('should validate a mixed case ULID', () => {
      const result = ulidSchema.safeParse('01ArZ3NDeKtSv4RrFfQ69G5FaV');
      expect(result.success).toBe(true);
    });

    it('should reject ULID with invalid characters (I, L, O, U)', () => {
      expect(ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fai').success).toBe(false); // contains I
      expect(ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fal').success).toBe(false); // contains L
      expect(ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fao').success).toBe(false); // contains O
      expect(ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fau').success).toBe(false); // contains U
    });

    it('should reject ULID with special characters', () => {
      expect(ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fa!').success).toBe(false);
      expect(ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fa-').success).toBe(false);
    });

    it('should reject ULID that is too short', () => {
      const result = ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fa');
      expect(result.success).toBe(false);
    });

    it('should reject ULID that is too long', () => {
      const result = ulidSchema.safeParse('01arz3ndektsv4rrffq69g5fava');
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = ulidSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(ulidSchema.safeParse(123).success).toBe(false);
      expect(ulidSchema.safeParse(null).success).toBe(false);
      expect(ulidSchema.safeParse(undefined).success).toBe(false);
      expect(ulidSchema.safeParse({}).success).toBe(false);
    });
  });

  describe('ulidOptionalSchema', () => {
    it('should validate a correct ULID', () => {
      const result = ulidOptionalSchema.safeParse('01arz3ndektsv4rrffq69g5fav');
      expect(result.success).toBe(true);
    });

    it('should accept null', () => {
      const result = ulidOptionalSchema.safeParse(null);
      expect(result.success).toBe(true);
    });

    it('should accept undefined', () => {
      const result = ulidOptionalSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ULID', () => {
      const result = ulidOptionalSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('isValidULID', () => {
    it('should return true for valid lowercase ULID', () => {
      expect(isValidULID('01arz3ndektsv4rrffq69g5fav')).toBe(true);
    });

    it('should return true for valid uppercase ULID', () => {
      expect(isValidULID('01ARZ3NDEKTSV4RRFFQ69G5FAV')).toBe(true);
    });

    it('should return true for valid mixed case ULID', () => {
      expect(isValidULID('01ArZ3NDeKtSv4RrFfQ69G5FaV')).toBe(true);
    });

    it('should return false for ULID with invalid characters', () => {
      expect(isValidULID('01arz3ndektsv4rrffq69g5fai')).toBe(false); // contains I
      expect(isValidULID('01arz3ndektsv4rrffq69g5fal')).toBe(false); // contains L
      expect(isValidULID('01arz3ndektsv4rrffq69g5fao')).toBe(false); // contains O
      expect(isValidULID('01arz3ndektsv4rrffq69g5fau')).toBe(false); // contains U
    });

    it('should return false for incorrect length', () => {
      expect(isValidULID('01arz3ndektsv4rrffq69g5fa')).toBe(false); // 25 chars
      expect(isValidULID('01arz3ndektsv4rrffq69g5fava')).toBe(false); // 27 chars
      expect(isValidULID('')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidULID('')).toBe(false);
    });

    it('should return false for special characters', () => {
      expect(isValidULID('01arz3ndektsv4rrffq69g5fa!')).toBe(false);
      expect(isValidULID('01arz3ndektsv4rrffq69g5fa-')).toBe(false);
    });
  });

  describe('getTimestampFromULID', () => {
    it('should extract timestamp from lowercase ULID', () => {
      const ulid = '01arz3ndektsv4rrffq69g5fav';
      const timestamp = getTimestampFromULID(ulid);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should extract timestamp from uppercase ULID', () => {
      const ulid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
      const timestamp = getTimestampFromULID(ulid);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should extract same timestamp for same ULID regardless of case', () => {
      const lowerTimestamp = getTimestampFromULID('01arz3ndektsv4rrffq69g5fav');
      const upperTimestamp = getTimestampFromULID('01ARZ3NDEKTSV4RRFFQ69G5FAV');

      expect(lowerTimestamp.getTime()).toBe(upperTimestamp.getTime());
    });

    it('should extract different timestamps for different ULIDs', () => {
      const timestamp1 = getTimestampFromULID('01arz3ndektsv4rrffq69g5fav');
      const timestamp2 = getTimestampFromULID('02arz3ndektsv4rrffq69g5fav');

      expect(timestamp1.getTime()).not.toBe(timestamp2.getTime());
    });

    it('should handle ULID starting with minimum timestamp (0)', () => {
      const ulid = '00000000000000000000000000';
      const timestamp = getTimestampFromULID(ulid);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBe(0);
    });

    it('should handle ULID with high timestamp value', () => {
      const ulid = '7ZZZZZZZZZ' + 'A'.repeat(16);
      const timestamp = getTimestampFromULID(ulid);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });
  });
});
