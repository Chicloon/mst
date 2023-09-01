import { PlanFilterNames } from '../enums';
import { PlanHeaderInstance } from '../PlanHeader';
import { FilterInstance } from 'models/Filter';

export const updateArticlesFilters: any = (
  self: PlanHeaderInstance,
  label?: PlanFilterNames
): void => {
  const { articles } = self;

  if (articles.length === 0) {
    return;
  }

  const { article1, article2, article3 } = PlanFilterNames;
  const article1Filter = self.filters.get(article1)!;
  const article2Filter = self.filters.get(article2)!;
  const article3Filter = self.filters.get(article3)!;

  self.filters.get(article1)?.setFilterItems(
    articles.map((item) => ({
      value: item.nameLevel1 || '',
      label: item.nameLevel1 || '',
    }))
  );

  const article2Items: Map<string, string> = new Map();
  const article3Items: Map<string, string> = new Map();

  articles.forEach((el) => {
    if (article1Filter?.multiSelected.includes(el.nameLevel1!)) {
      article2Items.set(el.nameLevel2 as string, el.nameLevel2!);
    }

    if (article2Filter?.multiSelected.includes(el.nameLevel2!)) {
      article3Items.set(el.nameLevel3 as string, el.nameLevel3!);
    }
  });

  const updateFilter = (filter: FilterInstance, newItems: Map<string, string>) => {
    filter.setFilterItems(
      [...newItems.entries()].map((item) => ({
        value: item[1],
        label: item[0],
      }))
    );

    const newSelected = [...newItems.keys()].filter((el) =>
      filter.multiSelected.includes(el)
    );
    filter.setFilter(newSelected || [], true);
  };

  label === PlanFilterNames.article1 && updateFilter(article2Filter, article2Items);
  label === PlanFilterNames.article2 && updateFilter(article3Filter, article3Items);
};
