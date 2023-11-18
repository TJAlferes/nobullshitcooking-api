import { UUIDv7StringId } from './model';

describe('UUIDv7StringId value object', () => {
  it('handles success', () => {
    const input = '01abAC01-01aB-01aB-01aB-010abAB01abA';
    const output = UUIDv7StringId(input);
    expect(output).toBe(input);
  });
});
