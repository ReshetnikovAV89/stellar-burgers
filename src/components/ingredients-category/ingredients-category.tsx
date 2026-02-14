import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import type { RootState } from '../../services/store';

import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, items } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    items.forEach(({ ingredient }) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [items, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
