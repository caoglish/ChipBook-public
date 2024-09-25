// tests/unit/LogHelper.spec.ts

import LogHelper from '@/Lib/LogHelper'; // Adjust the path to your actual file location
import {Log} from '@/Type/Log'


describe('LogHelper.makeLogDetail', () => {
  it('should return remaining chips for action "setRemaining"', () => {
    const item = { action: 'setRemaining', chips: 100, date: new Date() } as Log;
    const result = LogHelper.makeLogDetail(item);

    expect(result).toEqual({
      'remaining chips': 100,
      'buy in': undefined,
      'refund hands': undefined
    });
  });

  it('should return buy in hands for action "buyin"', () => {
    const item = { action: 'buyin', hands: 2, date: new Date() } as Log;
    const result = LogHelper.makeLogDetail(item);

    expect(result).toEqual({
      'remaining chips': undefined,
      'buy in': 2,
      'refund hands': undefined
    });
  });

  it('should return refund hands for action "refund"', () => {
    const item = { action: 'refund', hands: 3, date: new Date() } as Log;
    const result = LogHelper.makeLogDetail(item);

    expect(result).toEqual({
      'remaining chips': undefined,
      'buy in': undefined,
      'refund hands': 3
    });
  });

  it('should return all fields as undefined for unknown action', () => {
    const item = { action: 'unknown', date: new Date() } ;
    const result = LogHelper.makeLogDetail(item as Log);

    expect(result).toEqual({
      'remaining chips': undefined,
      'buy in': undefined,
      'refund hands': undefined
    });
  });
});
