import { useCallback, useState } from 'react';

export function useObjectState<T extends {}>(initialValue: T) {
  const [object, setObject] = useState(initialValue);

  /**Takes an input event and updates the correct key in the internal object. Automatically assigns numbers as numbers, and gets the checked-value from checkbox inputs. */
  const updateObject = useCallback(
    (e: any) => {
      const { type, name } = e.target;
      const val =
        type === 'number'
          ? e.target.valueAsNumber
          : type === 'checkbox'
          ? e.target.checked
          : e.target.value;

      setObject({
        ...object,
        [name]: val,
      });
    },
    [setObject, object]
  );

  return [object, updateObject, setObject] as const;
}
