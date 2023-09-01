import { PlanData } from './PlanTable';
import { PlanItemInstance } from './PlanItems';
import { sortBy } from 'lodash';
import { getSnapshot } from 'mobx-state-tree';

export const tableResponseToTableData = (
  resp: PlanItemInstance[],
  type: 'inn' | 'branch' | 'segment' = 'inn'
): any[] => {
  const heights: { [key: keyof PlanData]: number } = {
    s_article_lvl1_name: 1,
    s_article_lvl2_name: 1,
    branch_name: 1,
    gkm_name: 1,
    xo_name: 1,
    id_org_code: 1,
    s_branch_name: 1,
  };
  const data: any[] = [];

  if (resp.length > 0) {
    resp.forEach((el: any, idx) => {
      let res = {
        ...el,
        id_org_code: {
          value: el.id_org_code,
          height: heights.id_org_code,
        },
        s_article_lvl1_name: {
          value: el.s_article_lvl1_name,
          height: heights.s_article_lvl1_name,
        },
        s_article_lvl2_name: {
          value: el.s_article_lvl2_name,
          height: heights.s_article_lvl2_name,
        },
        branch_name: {
          value: el.branch_name,
          height: heights.branch_name,
        },
        xo_name: {
          value: el.xo_name,
          height: heights.xo_name,
        },
        gkm_name: {
          value: el.gkm_name,
          height: heights.gkm_name,
        },
        s_branch_name: {
          value: el.s_branch_name,
          height: heights.s_branch_name,
        },
      };

      const dataCheck = (articleName: keyof PlanData) => {
        if (type === 'inn') {
          if (
            idx !== resp.length - 1 &&
            // @ts-ignore
            el[articleName] === resp[idx + 1][articleName] &&
            el.id_org_code === resp[idx + 1].id_org_code
          ) {
            // dataHeight += 1;
            heights[articleName] = heights[articleName] + 1;
          } else {
            res[articleName].height = heights[articleName];
            heights[articleName] = 1;
          }
        }

        if (type === 'segment') {
          if (
            idx !== resp.length - 1 &&
            // @ts-ignore
            el[articleName] === resp[idx + 1][articleName] &&
            el.s_article_lvl1_name === resp[idx + 1].s_article_lvl1_name
          ) {
            heights[articleName] = heights[articleName] + 1;
          } else {
            res[articleName].height = heights[articleName];
            heights[articleName] = 1;
          }
        }

        if (type === 'branch') {
          if (
            idx !== resp.length - 1 &&
            // @ts-ignore
            el[articleName] === resp[idx + 1][articleName] &&
            el.s_branch_name === resp[idx + 1].s_branch_name
          ) {
            heights[articleName] = heights[articleName] + 1;
          } else {
            res[articleName].height = heights[articleName];
            heights[articleName] = 1;
          }
        }
      };

      dataCheck('s_article_lvl1_name');
      dataCheck('s_article_lvl2_name');
      if (type === 'branch') {
        dataCheck('s_branch_name');
      }
      if (type === 'inn') {
        dataCheck('gkm_name');
        dataCheck('branch_name');
        dataCheck('xo_name');
        dataCheck('id_org_code');
      }

      data.push(res);
    }) as any;
  }

  return data;
};
