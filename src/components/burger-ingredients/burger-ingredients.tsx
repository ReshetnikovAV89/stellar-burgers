import { FC, useMemo, useRef, useState, useCallback } from 'react';
import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '../../services/store';
import { TTabMode } from '@utils-types';

export const BurgerIngredients: FC = () => {
  const items = useSelector((state) => state.ingredients.items);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const bunsSectionRef = useRef<Element | null>(null);
  const mainsSectionRef = useRef<Element | null>(null);
  const saucesSectionRef = useRef<Element | null>(null);

  const bunsRef = useCallback((node?: Element | null) => {
    bunsSectionRef.current = node ?? null;
  }, []);

  const mainsRef = useCallback((node?: Element | null) => {
    mainsSectionRef.current = node ?? null;
  }, []);

  const saucesRef = useCallback((node?: Element | null) => {
    saucesSectionRef.current = node ?? null;
  }, []);

  const buns = useMemo(() => items.filter((i) => i.type === 'bun'), [items]);
  const mains = useMemo(() => items.filter((i) => i.type === 'main'), [items]);
  const sauces = useMemo(
    () => items.filter((i) => i.type === 'sauce'),
    [items]
  );

  const onTabClick = (val: string) => {
    const tab = val as TTabMode;
    setCurrentTab(tab);

    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
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
