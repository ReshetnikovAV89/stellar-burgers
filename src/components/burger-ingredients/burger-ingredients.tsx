import { FC, useMemo, useRef, useState } from 'react';

import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '../../services/store';

import { TIngredient } from '../../utils/types';
import { BurgerIngredient } from '../burger-ingredient';

type TTab = 'bun' | 'main' | 'sauce';

export const BurgerIngredients: FC = () => {
  const items = useSelector((state) => state.ingredients.items);

  const bun = useSelector((state) => state.burgerConstructor.bun);
  const constructorItems = useSelector(
    (state) => state.burgerConstructor.items
  );

  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsEl, setBunsEl] = useState<HTMLElement | null>(null);
  const [mainsEl, setMainsEl] = useState<HTMLElement | null>(null);
  const [saucesEl, setSaucesEl] = useState<HTMLElement | null>(null);

  const bunsRef = (node?: Element | null) => {
    setBunsEl((node as HTMLElement) ?? null);
  };

  const mainsRef = (node?: Element | null) => {
    setMainsEl((node as HTMLElement) ?? null);
  };

  const saucesRef = (node?: Element | null) => {
    setSaucesEl((node as HTMLElement) ?? null);
  };

  const buns = useMemo(
    () => items.filter((i: TIngredient) => i.type === 'bun'),
    [items]
  );
  const mains = useMemo(
    () => items.filter((i: TIngredient) => i.type === 'main'),
    [items]
  );
  const sauces = useMemo(
    () => items.filter((i: TIngredient) => i.type === 'sauce'),
    [items]
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    constructorItems.forEach((item: any) => {
      const ing: TIngredient = item.ingredient ?? item;
      counters[ing._id] = (counters[ing._id] ?? 0) + 1;
    });

    if (bun) {
      counters[bun._id] = (counters[bun._id] ?? 0) + 2;
    }

    return counters;
  }, [bun, constructorItems]);

  const onTabClick = (tab: string) => {
    const value = tab as TTab;
    setCurrentTab(value);

    if (value === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (value === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (value === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
