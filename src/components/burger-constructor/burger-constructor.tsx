import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import type { TConstructorIngredient } from '@utils-types';
import { useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const items = useSelector((state) => state.burgerConstructor.items);

  const constructorItems = useMemo(
    () => ({
      bun,
      ingredients: items.map((item) => ({
        ...item.ingredient,
        id: item.id
      })) as unknown as TConstructorIngredient[]
    }),
    [bun, items]
  );

  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };

  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
