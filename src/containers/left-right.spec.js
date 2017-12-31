import { Left, Right } from './left-right';
import { resemblesBox } from '../../__tests__/testUtilities';
import { addOne, randomNumberBetween1And10 } from '../../__tests__/utilities';

const randomNumber = randomNumberBetween1And10();

describe('Left container type:', () => {
  const left = Left(randomNumber);

  it('API looks like that of a Box', () => {
    resemblesBox(Left());
  });

  describe('Left.chain', () => {
    it('returns itself', () => {
      expect(
        Left(4)
          .chain(addOne)
          .inspect()
      ).toEqual('Left(4)');
    });
  });

  describe('Left.fold', () => {
    it('applies the second function to the value', () => {
      let mock1 = jest.fn();
      let mock2 = jest.fn();

      left.fold(mock1, mock2);

      expect(mock1).toHaveBeenCalledTimes(1);
      expect(mock2).toHaveBeenCalledTimes(0);
      expect(left.fold(() => 'error', addOne)).toEqual('error');
    });
  });

  describe('Left.inspect', () => {
    it('returns the current value in a `Left(${})`-template', () => {
      expect(left.inspect()).toEqual(`Left(${randomNumber})`);
    });
  });

  describe('Left.map', () => {
    it('returns a new Left', () => {
      resemblesBox(Left(4).map(x => x));
    });

    it('does not apply the function to the value', () => {
      let mockFn = jest.fn();
      Left().map(mockFn);
      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});

describe('Right container type:', () => {
  const right = Right(randomNumber);

  it('API looks like that of a Box', () => {
    resemblesBox(Right());
  });

  describe('Right.chain', () => {
    it('applies the function to the value', () => {
      expect(Right(4).chain(addOne)).toEqual(5);
    });
  });

  describe('Right.fold', () => {
    it('applies the second function parameter to the value', () => {
      let mock1 = jest.fn();
      let mock2 = jest.fn();

      right.fold(mock1, mock2);

      expect(mock1).toHaveBeenCalledTimes(0);
      expect(mock2).toHaveBeenCalledTimes(1);
      expect(right.fold(x => x, addOne)).toEqual(randomNumber + 1);
    });
  });

  describe('Right.inspect', () => {
    it('returns the current value in a `Right(${})`-template', () => {
      expect(right.inspect()).toEqual(`Right(${randomNumber})`);
    });
  });

  describe('Right.map', () => {
    it('returns a new Right', () => {
      resemblesBox(Right(4).map(x => x));
    });

    it('applies the function parameter to the value', () => {
      let mockFn = jest.fn();

      right.map(mockFn);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toBeCalledWith(randomNumber);
    });
  });
});
