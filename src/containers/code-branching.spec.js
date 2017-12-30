import { Either, fromNullable, Left, Right } from './code-branching';
import { isFunction, resemblesBox } from '../../__tests__/testUtilities';
import { addOne, randomNumberBetween1And10 } from '../../__tests__/utilities';

describe('Either container type: code branching', () => {
  let randomNumber = randomNumberBetween1And10();

  it('is a function', () => {
    isFunction(Either);
  });

  describe('input:', () => {
    it('takes one parameter', () => {
      expect(Either.length).toEqual(1);
    });
  });

  describe('output:', () => {
    describe('Left container type:', () => {
      const left = Left(randomNumber);

      it('is a function', () => {
        isFunction(Left);
      });

      it('API looks like that of a Box', () => {
        resemblesBox(Left());
      });

      describe('map method:', () => {
        it('returns a new Left', () => {
          resemblesBox(Left(4).map(x => x));
        });

        it('takes one parameter', () => {
          expect(left.map.length).toEqual(1);
        });

        it('does not apply the functor to the value', () => {
          let mockFn = jest.fn();
          Left().map(mockFn);
          expect(mockFn).toHaveBeenCalledTimes(0);
        });
      });

      describe('fold method:', () => {
        it('is a function', () => {
          isFunction(Right().fold);
        });

        it('takes two parameters', () => {
          expect(left.fold.length).toEqual(2);
        });

        it('applies the second function to the value', () => {
          let mock1 = jest.fn();
          let mock2 = jest.fn();

          left.fold(mock1, mock2);

          expect(mock1).toHaveBeenCalledTimes(1);
          expect(mock2).toHaveBeenCalledTimes(0);
          expect(left.fold(() => 'error', addOne)).toEqual('error');
        });
      });

      describe('inspect', () => {
        it('is a function', () => {
          isFunction(left.inspect);
        });

        it('takes no arguments', () => {
          expect(left.inspect.length).toEqual(0);
        });

        it('returns the current value in a `Left(${})`-template', () => {
          expect(left.inspect()).toEqual(`Left(${randomNumber})`);
        });
      });
    });

    describe('Right container type:', () => {
      const right = Right(randomNumber);

      it('is a function', () => {
        isFunction(Right);
      });

      it('API looks like that of a Box', () => {
        resemblesBox(Right());
      });

      describe('map method:', () => {
        it('returns a new Right', () => {
          resemblesBox(Right(4).map(x => x));
        });

        it('takes one parameter', () => {
          expect(right.map.length).toEqual(1);
        });

        it('applies the function to the value', () => {
          let mockFn = jest.fn();

          right.map(mockFn);
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toBeCalledWith(randomNumber);
        });
      });

      describe('fold method:', () => {
        it('is a function', () => {
          isFunction(Right().fold);
        });

        it('takes two parameters', () => {
          expect(right.fold.length).toEqual(2);
        });

        it('applies the second function to the value', () => {
          let mock1 = jest.fn();
          let mock2 = jest.fn();

          right.fold(mock1, mock2);

          expect(mock1).toHaveBeenCalledTimes(0);
          expect(mock2).toHaveBeenCalledTimes(1);
          expect(right.fold(x => x, addOne)).toEqual(randomNumber + 1);
        });
      });

      describe('inspect', () => {
        it('is a function', () => {
          isFunction(right.inspect);
        });

        it('takes no arguments', () => {
          expect(right.inspect.length).toEqual(0);
        });

        it('returns the current value in a `Right(${})`-template', () => {
          expect(right.inspect()).toEqual(`Right(${randomNumber})`);
        });
      });
    });

    it('branches to a Left when parameter is falsy', () => {
      expect(
        Either(0)
          .map(x => x + 1)
          .fold(() => 'error', x => x)
      ).toEqual('error');
    });

    it('branches to a Right when parameter is truthy', () => {
      expect(
        Either(randomNumber)
          .map(x => x + 1)
          .fold(() => 'error', x => x / 2)
      ).toEqual((randomNumber + 1) / 2);
    });
  });
});

describe('fromNullable', () => {
  it('is a function', () => {
    isFunction(fromNullable);
  });

  it('takes one parameter', () => {
    expect(fromNullable.length).toEqual(1);
  });

  it('returns a Left containing null when the parameter is null or undefined', () => {
    expect(fromNullable(null).inspect()).toEqual('Left(null)');
    expect(fromNullable(undefined).inspect()).toEqual('Left(null)');
  });

  it('returns a Right containing the passed value when not null or undefined', () => {
    expect(fromNullable(5).inspect()).toEqual('Right(5)');
  });
});