import { Hint, IconButton, icons, Button } from '@pcapcc360/react-ui';
import React from 'react';
import useStyles from './styles';
import { useMst, BPtypes } from 'models';
import { observer } from 'mobx-react-lite';
import { adminRoles, userRoles } from 'utils/constants';
import { useHistory } from 'react-router-dom';
import { BASE_URL } from 'api/constants';

const PlanActions = () => {
  const {
    plan: {
      header: { reload, saveChanges },
      table: { type, correctionBody, editedCells },
      idStage,
    },
    user: { roleExistsAny },
  } = useMst();
  const classes = useStyles();
  const history = useHistory();

  const planTypeButton = (planType: keyof typeof BPtypes, title: string) => {
    if (
      roleExistsAny(['kib_skm_pln_km', 'kib_skm_pln_rkm']) &&
      !roleExistsAny([...adminRoles, 'kib_skm_pln_gkm'])
    ) {
      return null;
    }

    return (
      <Button
        onClick={() => history.push(`${BASE_URL}/plan/${idStage}/${planType}`)}
        variant={planType === type ? 'contained' : 'outlined'}
      >
        {title}
      </Button>
    );
  };

  return (
    <div className={classes.actionsWrapper}>
      <div className={classes.planTypesButtonsWrapper}>
        {roleExistsAny([...adminRoles, ...userRoles]) && planTypeButton('inn', 'ИНН')}
        {roleExistsAny([...adminRoles]) && planTypeButton('segment', 'Сегмент')}
        {roleExistsAny([...adminRoles, 'kib_skm_pln_gkm']) &&
          planTypeButton('branch', 'Направление')}
      </div>
      <div className={classes.actionButtonsWrapper}>
        <Hint title="Обновить данные">
          <IconButton onClick={reload}>
            <icons.fill.ArrowsRepeat />
          </IconButton>
        </Hint>
        <Hint title="Сохранить изменения">
          <IconButton onClick={saveChanges} disabled={editedCells.size === 0}>
            <icons.fill.Save />
          </IconButton>
        </Hint>
        <Hint title="Скачать данные">
          <IconButton onClick={() => {}}>
            <icons.fill.Download />
          </IconButton>
        </Hint>
      </div>
    </div>
  );
};

export default observer(PlanActions);
