import React, { useState } from 'react';
import { PlanItemInstance, useMst } from 'models';
import { observer } from 'mobx-react-lite';
import {
  Hint,
  PcapTheme,
  Modal,
  icons,
  TextArea,
  Typography,
  Button,
} from '@pcapcc360/react-ui';
import { makeStyles, useTheme } from '@material-ui/core';
import api from 'api';
import { CellProps } from './types';
import { CELL_HEIGHT } from 'pages/Plan/Plan';

const useStyles = makeStyles<PcapTheme, Partial<{ cellHeight?: number }>>((theme) => ({
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  commentWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& div': {
      scale: ({ cellHeight }) =>
        cellHeight === CELL_HEIGHT ? 1 : cellHeight === CELL_HEIGHT / 2 ? 0.5 : 0.75,
    },
  },
  modalWrapper: {
    height: '55vh',
    width: '50vw',
  },

  borderWrapper: {
    boxShadow: `inset 0px 0px 0px .5px ${theme.pcapPalette.grey[500]}`,
  },
  label: {
    width: 90,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
    '& > p': {
      textAlign: 'end',
      width: '100%',
    },
  },
  infoWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
}));

const PlanCommentCell: React.FC<CellProps<PlanItemInstance>> = ({ data, accessor }) => {
  const theme = useTheme<PcapTheme>();
  const {
    user,
    ui,
    plan: {
      header,
      table: { cellHeight },
    },
  } = useMst();
  const classes = useStyles({ cellHeight });

  const {
    b_correction_info,
    i_tb_name_min,
    id_org,
    s_article_lvl1_name,
    s_article_lvl2_name,
    s_article_lvl3_name,
    id_article_lvl3,
    id_tb,
    id_stage,
  } = data;

  const [hasComment, setHasComment] = useState(b_correction_info === 1);
  const [value, setValue] = useState<string>();
  const [idComment, setIdComment] = useState<number>();
  const [caComment, setCaComment] = useState('');
  const [tbComment, setTbComment] = useState('');

  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setValue(' ');
    setShowModal(true);
  };

  const setHintValue = (tb?: string, ca?: string) => {
    setValue(
      `TБ: ${tb}
      ----------
       ЦА: ${ca || '-'} `
    );
  };

  const onHintOver = async () => {
    if (value || !hasComment) {
      return;
    }
    const params = {
      stageId: id_stage,
      orgId: id_org,
      articleId: id_article_lvl3,
      tbId: id_tb,
    };

    const hintValue: { caText: string; tbText: string; id: number }[] = await api.get({
      method: 'business-plan/correction-info',
      params,
    });

    const caComment = hintValue[0].caText;
    const tbComment = hintValue[0].tbText;
    setIdComment(hintValue[0].id);
    setCaComment(caComment);
    setTbComment(tbComment);

    setHintValue(tbComment, caComment);
  };

  const saveComment = async () => {
    if (!idComment) {
      const body = {
        stageId: id_stage,
        orgId: id_org,
        articleId: id_article_lvl3,
        tbId: id_tb,
        tbText: tbComment,
      };
      try {
        const res: { id: number } = await api.post({
          method: 'business-plan/correction-info-create',
          body,
        });

        setIdComment(res.id);
        setHasComment(true);
      } catch (error: any) {
        ui.alert.setAlert({
          type: 'error',
          title: 'Ошибка при сохранении комментария',
          message: error.message,
        });
      }
    }

    if (idComment) {
      const bodyTb = {
        id: idComment,
        tbText: tbComment,
      };

      const bodyCa = {
        id: idComment,
        caText: caComment,
      };
      try {
        const tbRes = await api.post({
          method: 'business-plan/correction-info/tb/save',
          body: bodyTb,
        });
        const caRes = await api.post({
          method: 'business-plan/correction-info/ca/save',
          body: bodyCa,
        });
      } catch (error: any) {
        ui.alert.setAlert({
          type: 'error',
          title: 'Ошибка при сохранении комментария',
          message: error.message,
        });
      }
    }

    setShowModal(false);
    setHasComment(true);
    setHintValue(tbComment, caComment);
  };

  const fillColor = hasComment
    ? theme.pcapPalette.success.main
    : theme.pcapPalette.grey[500];

  const modalInfoField = (title: string, value: string | null | number) => {
    return (
      <div className={classes.infoWrapper}>
        <div className={classes.label}>
          <Typography variant="body2semibold">{title && `${title}: `} </Typography>
        </div>
        <Typography variant="body2">{value}</Typography>
      </div>
    );
  };

  const onCancel = () => {
    setShowModal(false);
    setValue('');
  };

  const actions = (
    <div className={classes.actionButtonsWrapper}>
      <Button variant="contained" onClick={saveComment}>
        Сохранить
      </Button>

      <Button variant="outlined" onClick={onCancel}>
        Отмена
      </Button>
    </div>
  );

  return (
    <>
      {value && (
        <Modal
          open={showModal}
          onClose={onCancel}
          contentClassName={classes.modalWrapper}
          title="Комментарий"
          maxWidth="xl"
          actions={actions}
        >
          <div>
            {modalInfoField('ИНН', id_org)}
            {modalInfoField('ТБ', i_tb_name_min)}
            {/* @ts-ignore */}
            {modalInfoField('Статья', s_article_lvl1_name.value)}
            {/* @ts-ignore */}
            {modalInfoField('', s_article_lvl2_name.value)}
            {modalInfoField('', s_article_lvl3_name)}

            {/* @ts-ignore */}
            <TextArea
              label={'Комментарий ТБ'}
              value={tbComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTbComment(e.target.value)
              }
            />
            {/* @ts-ignore */}
            <TextArea
              label={'Комментарий ЦА'}
              value={caComment}
              disabled={!idComment || !user.roleExistsAll(['bad_all_pln_cen'])}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setCaComment(e.target.value)
              }
            />
          </div>
        </Modal>
      )}
      <div className={`${classes.commentWrapper} ${classes.borderWrapper}`}>
        {/* @ts-ignore */}
        <Hint
          title={
            value ? (
              <div>
                {value.split(/\r?\n/).map((el, idx) => (
                  <p key={idx}>{el}</p>
                ))}
              </div>
            ) : (
              ''
            )
          }
          onMouseEnter={onHintOver}
        >
          <div style={{ cursor: 'pointer' }} onClick={onClick}>
            <icons.fill.CommentDots fill={fillColor} />
          </div>
        </Hint>
      </div>
    </>
  );
};

export default observer(PlanCommentCell);
