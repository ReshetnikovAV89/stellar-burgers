import { FC, useMemo, useRef, useState } from 'react';
import { BurgerIngredientsUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { TIngredient } from '../../utils/types';
import { addIngredient } from '../../services/slices/constructorSlice';

type TTab = 'bun' | 'main' | 'sauce';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.ingredients.items);

  const [currentTab, setCurrentTab] = useState<TTab>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsEl, setBunsEl] = useState<HTMLElement | null>(null);
  const [mainsEl, setMainsEl] = useState<HTMLElement | null>(null);
  const [saucesEl, setSaucesEl] = useState<HTMLElement | null>(null);

  const bunsRef = (node?: Element | null) =>
    setBunsEl((node as HTMLElement) ?? null);
  const mainsRef = (node?: Element | null) =>
    setMainsEl((node as HTMLElement) ?? null);
  const saucesRef = (node?: Element | null) =>
    setSaucesEl((node as HTMLElement) ?? null);

  const buns = useMemo(() => items.filter((i) => i.type === 'bun'), [items]);
  const mains = useMemo(() => items.filter((i) => i.type === 'main'), [items]);
  const sauces = useMemo(
    () => items.filter((i) => i.type === 'sauce'),
    [items]
  );

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

  const handleAdd = (ingredient: TIngredient) => {
    dispatch(addIngredient(ingredient));
  };

  const uiProps = {
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick,
    handleAdd
  };

  return <BurgerIngredientsUI {...(uiProps as any)} />;
};
