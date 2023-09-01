import { makeStyles, useTheme } from '@material-ui/core';
import { IconButton, PcapTheme, TextField } from '@pcapcc360/react-ui';
import { Icon } from 'components/Icon';
import { observer } from 'mobx-react-lite';
import { ParamsKeysArt } from 'models/StagesSettings/ArticlesModel';
import { ParamsKeys } from 'models/StagesSettings/OrganizationsModal';
import React, { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { useMst } from '../../models/Root';

const useStyles = makeStyles<PcapTheme, { size: number }>((theme) => ({
  clearButton: {
    backgroundColor: 'transparent !important',
    '& svg': {
      height: ({ size }) => size,
      width: ({ size }) => size,
    },
  },
}));

export const TableSearchFilter: FC<{
  keyCom: ParamsKeys | ParamsKeysArt;
  type: string;
}> = ({ keyCom, type, ...props }) => {
  const { filters, id, setGlobalFilter } = props;
  const [counter, setCounter] = useState(0);
  const sendTime = 15;
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const theme = useTheme();
  const classes = useStyles({ size: 18 });
  const { organiazationsModal, acrticlesModal } = useMst().stagesSettings;
  const maxLength = 1000;
  const placeholder = 'Поиск ';
  const settersObj = {
    crmId: organiazationsModal.setCrmId,
    name: organiazationsModal.setName,
    shortName: organiazationsModal.setShortName,
    inn: organiazationsModal.setInn,
    innPre: organiazationsModal.setInnPre,
    code: organiazationsModal.setCode,
    tbId: organiazationsModal.setTbId,
    tb: organiazationsModal.setTb,
    gosbId: organiazationsModal.setGosbId,
    gosb: organiazationsModal.setGosb,
    xo: organiazationsModal.setXo,
    branch: organiazationsModal.setBranch,
  };

  const settersArticles = {
    name: acrticlesModal.setName,
    group: acrticlesModal.setGroup,
    subGroup: acrticlesModal.setSubGroup,
    article: acrticlesModal.setArticle,
    code: acrticlesModal.setCode,
  };

  const func = type === 'organization' ? settersObj[keyCom] : settersArticles[keyCom];

  const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setGlobalFilter(event.target.value);
    func(event.target.value);
    if (type === 'organization') organiazationsModal.debounceLoad();
  }, []);

  const onClearHandler = useCallback(() => {
    setGlobalFilter('');
    func(null);
    if (type === 'organization') organiazationsModal.load();
  }, []);

  return (
    <TextField
      autoFocus
      placeholder={placeholder}
      value={filters.find((item) => item.id === id)?.value || ''}
      onChange={onChangeHandler}
      endAdornment={
        <>
          {
            <IconButton classes={classes.clearButton} onClick={onClearHandler}>
              <Icon
                iconName="line.FilterCircleXmark"
                props={{ color: theme.pcapPalette.grey[400] }}
              />
            </IconButton>
          }
        </>
      }
    />
  );
};

export default observer(TableSearchFilter);
