import { getParent } from 'mobx-state-tree';
import { PlanInstance } from '../Plan';
import { PlanHeaderInstance } from '../PlanHeader';

import { PlanFilterNames } from '../enums';

const { fact, factPrognosis } = PlanFilterNames;

const hiddenHeader: any = (self: PlanHeaderInstance) => {
  const {
    table: { type },
    stage,
  } = getParent<PlanInstance>(self);

  if (type !== 'inn') {
    return [];
  }

  const hiddenHeader = [
    // Колонки ХО
    'PLAN_XO_1Q',
    'PLAN_XO_2Q',
    'PLAN_XO_3Q',
    'PLAN_XO_9M',
    'PLAN_XO_4Q',
    'PLAN_XO_Y',

    // Планы и прогнозы
    // 'FACT_PREV_9M',
    // 'FACT_4Q',
    // 'FACT_9M',
    // 'FACT_2M2Q',
    // 'FORECAST_1Q',
    // 'FORECAST_2Q',
    // 'FORECAST_3Q',
  ];

  // факт 2022: Факт 1Q22, Факт 2Q22, Факт 3Q22, Факт 4Q22, Факт 2022
  // факт/прогноз 2023: Факт 1Q23, Факт 31.05.23, Прогноз 2Q23

  if (stage?.type === 'SEMIANNUAL') {
    hiddenHeader.push(
      ...[
        'FACT_PREV_9M',
        'FACT_2Q',
        'FACT_3Q',
        'FACT_4Q',
        'FORECAST_1Q',
        'FORECAST_3Q',
        'FORECAST_4Q',
        'FORECAST_Y',
      ]
    );
  }

  if (stage?.type === 'ANNUAL') {
    hiddenHeader.push(
      ...[
        // Факт
        'FACT_PREV_9M',
        'FACT_4Q',
        'FACT_2M2Q',

        // Прогнозы
        'FORECAST_1Q',
        'FORECAST_2Q',
        'FORECAST_3Q',

        'PLAN_TB_9M',
        'PLAN_CA_9M',
        'DELTA_9M',
        'PLAN_XO_9M',

        'PLAN_APPROVED_1Q',
        'PLAN_APPROVED_2Q',
        'PLAN_APPROVED_3Q',
        'PLAN_APPROVED_9M',
        'PLAN_APPROVED_4Q',
        'PLAN_APPROVED_Y',
      ]
    );
  }

  if (self.filters.get(fact)?.selectedItem === 'off') {
    if (stage?.type === 'SEMIANNUAL') {
      hiddenHeader.push(
        ...[
          // Факты пердыдущие
          'FACT_PREV_1Q',
          'FACT_PREV_2Q',
          'FACT_PREV_3Q',
          'FACT_PREV_4Q',
          'FACT_PREV_Y',
        ]
      );
    } else {
      hiddenHeader.push(
        ...[
          // Факты пердыдущие
          'FACT_PREV_1Q',
          'FACT_PREV_2Q',
          'FACT_PREV_3Q',
          'FACT_PREV_9M',
          'FACT_PREV_4Q',
          'FACT_PREV_Y',
        ]
      );
    }
  }

  if (self.filters.get(factPrognosis)?.selectedItem === 'off') {
    if (stage?.type === 'SEMIANNUAL') {
      hiddenHeader.push(...['FACT_1Q', 'FACT_2M2Q', 'FORECAST_2Q', 'FORECAST_Y']);
    } else {
      hiddenHeader.push(
        ...[
          // Факт текущий
          'FACT_1Q',
          'FACT_2Q',
          'FACT_3Q',
          'FACT_4M',
          'FACT_Y',

          // Прогнозы
          'FORECAST_4Q',
          'FORECAST_Y',
        ]
      );
    }
  }
  return hiddenHeader;
};

export default hiddenHeader;
