import { describe, expect, it } from 'vitest';
import { parseCountriesCsv } from './countries-csv';

describe('parseCountriesCsv', () => {
  it('parses headers in any order, regardless of case, and trims values', () => {
    expect(
      parseCountriesCsv(
        ' NAME , CODE \r\n France , FR \r\n United States, US ',
      ),
    ).toEqual([
      { code: 'FR', name: 'France' },
      { code: 'US', name: 'United States' },
    ]);
  });

  it('supports a UTF-8 BOM, quoted commas, and escaped quotes', () => {
    expect(
      parseCountriesCsv(
        '\uFEFFcode,name\nFR,"France, métropolitaine"\nUS,"The ""United"" States"',
      ),
    ).toEqual([
      { code: 'FR', name: 'France, métropolitaine' },
      { code: 'US', name: 'The "United" States' },
    ]);
  });

  it('ignores empty lines and returns an empty list for headers only', () => {
    expect(parseCountriesCsv('code,name\n\n')).toEqual([]);
    expect(parseCountriesCsv('code,name')).toEqual([]);
  });

  it('rejects missing, duplicate, or unexpected headers', () => {
    expect(() => parseCountriesCsv('code\nFR')).toThrow(
      'expected exactly code and name headers',
    );
    expect(() => parseCountriesCsv('code,name,other\nFR,France,value')).toThrow(
      'expected exactly code and name headers',
    );
    expect(() => parseCountriesCsv('code,code\nFR,France')).toThrow(
      'expected exactly code and name headers',
    );
    expect(() => parseCountriesCsv('')).toThrow('missing headers');
  });

  it('rejects invalid codes and empty names', () => {
    expect(() => parseCountriesCsv('code,name\nfr,France')).toThrow(
      'code on data row 2',
    );
    expect(() => parseCountriesCsv('code,name\nFRA,France')).toThrow(
      'code on data row 2',
    );
    expect(() => parseCountriesCsv('code,name\nFR,')).toThrow(
      'name on data row 2',
    );
  });

  it('rejects malformed CSV syntax', () => {
    expect(() => parseCountriesCsv('code,name\nFR,"France')).toThrow(
      'Invalid countries CSV:',
    );
  });
});
