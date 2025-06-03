import { expect } from '@jest/globals';

export type TTestCase = {
  value: unknown;
  desc: string;
  constraint: string;
  valueCheck: (v: unknown) => void;
};

export const testCases = (typeCase?: 'Date'): TTestCase[] => {
  switch (typeCase) {
    case 'Date':
      return [
        {
          value: new Date(''),
          desc: 'vazio',
          constraint: 'isDate',
          valueCheck: (v) => expect(isNaN((v as Date).getTime())).toBe(true),
        },
        {
          value: null,
          desc: 'null',
          constraint: 'isNotEmpty',
          valueCheck: (v) => expect(v).toBeNull(),
        },
        {
          value: undefined,
          desc: 'undefined',
          constraint: 'isNotEmpty',
          valueCheck: (v) => expect(v).toBeUndefined(),
        },
      ];
    default:
      return [
        {
          value: '',
          desc: 'vazio',
          constraint: 'isNotEmpty',
          valueCheck: (v) => expect(v).toBe(''),
        },
        {
          value: null,
          desc: 'null',
          constraint: 'isNotEmpty',
          valueCheck: (v) => expect(v).toBeNull(),
        },
        {
          value: undefined,
          desc: 'undefined',
          constraint: 'isNotEmpty',
          valueCheck: (v) => expect(v).toBeUndefined(),
        },
      ];
  }
};
