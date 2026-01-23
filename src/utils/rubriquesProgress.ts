export type ProgressMap<Id extends string> = Record<Id, number>;

type CardWithId<Id extends string> = { id: Id };

export const hasValue = (val: unknown): boolean => {
  if (val == null) return false;
  if (typeof val === "boolean") return val === true;
  if (typeof val === "number") return true;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object")
    return Object.values(val).some((v) => hasValue(v));
  return false;
};

export const calculateSectionProgress = <Id extends string>(
  ids: readonly Id[],
  valueForId: (id: Id) => unknown,
): ProgressMap<Id> => {
  const progress = {} as ProgressMap<Id>;
  ids.forEach((id) => {
    const value = valueForId(id);
    progress[id] =
      (value as { __completed?: boolean } | undefined)?.__completed
        ? 100
        : hasValue(value)
          ? 50
          : 0;
  });
  return progress;
};

export const computeOverallProgress = <Id extends string>(
  progressMap: ProgressMap<Id>,
  total?: number,
): number => {
  const values = Object.values(progressMap);
  const divisor = total ?? (values.length || 1);
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / divisor);
};

export const countCompleted = <Id extends string>(
  progressMap: ProgressMap<Id>,
): number => Object.values(progressMap).filter((val) => val === 100).length;

export const sortCardsByCompletion = <
  Id extends string,
  Card extends CardWithId<Id>,
>(
  cards: readonly Card[],
  progressMap: ProgressMap<Id>,
): Card[] => {
  const completed: Card[] = [];
  const others: Card[] = [];
  cards.forEach((card) => {
    const progress = progressMap[card.id] ?? 0;
    if (progress === 100) {
      completed.push(card);
    } else {
      others.push(card);
    }
  });
  return [...others, ...completed];
};

export const createDebouncedRefresh = (
  refresh: () => void,
  delayMs: number,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      refresh();
      timer = null;
    }, delayMs);
  };
};
