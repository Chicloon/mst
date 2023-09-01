import { ColumnFilter } from '@pcapcc360/react-ui';
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core';
import { PcapTheme } from '@pcapcc360/react-ui';
import { getSnapshot } from 'mobx-state-tree';
import { TableSearchFilter } from './TableSearchFilter';
import { useMst } from 'models';

type ComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never;
type Props = ComponentProps<typeof ColumnFilter>;

const useStyles = makeStyles((theme: PcapTheme) => ({
  activeFilter: {
    '& button': {
      color: 'red',
    },
  },
}));

export const TableFilter: FC<{ column: any } & Props> = ({ column, colorScheme, filters, ...props }) => {
  const classes = useStyles();
  const { stagesSettings } = useMst();
  const componentMap = {
    crmId: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'crmId'} type={'organization'} />;
    },
    name: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'name'} type={'organization'} />;
    },
    shortName: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'shortName'} type={'organization'} />;
    },
    inn: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'inn'} type={'organization'} />;
    },
    innPre: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'innPre'} type={'organization'} />;
    },
    code: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'code'} type={'organization'} />;
    },
    tbId: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'tbId'} type={'organization'} />;
    },
    tb: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'tb'} type={'organization'} />;
    },
    gosbId: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'gosbId'} type={'organization'} />;
    },
    gosb: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'gosb'} type={'organization'} />;
    },
    xo: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'xo'} type={'organization'} />;
    },
    branch: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'branch'} type={'organization'} />;
    },

    Name: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'name'} type={'article'} />;
    },
    group: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'group'} type={'article'} />;
    },
    subGroup: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'subGroup'} type={'article'} />;
    },
    article: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'article'} type={'article'} />;
    },
    articleCode: (props: any) => {
      return <TableSearchFilter {...props} keyCom={'code'} type={'article'} />;
    },
  };
  return (
    // @ts-ignore
    <div>
      <ColumnFilter
        {...column}
        filterComponent={componentMap[column.filter as keyof typeof componentMap]}
        colorScheme={colorScheme}
        filters={filters}
        showDefaultActionButton={false}
      />
    </div>
  );
};
