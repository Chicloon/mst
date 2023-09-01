import { LoadingIndicator, Paper, Typography } from '@pcapcc360/react-ui';
import { LoadStatuses } from 'models';
import React from 'react';

type TableStatusesProps = {
  state: 'notFound' | LoadStatuses;
};

const TableStates: React.FC<TableStatusesProps> = ({ state }) => {
  if (state === LoadStatuses.pending || state === LoadStatuses.error) {
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <Paper
          style={{
            width: '100%',
            height: '65vh',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {state === LoadStatuses.error ? (
              <div style={{ height: '100%' }}>Ошибка при загрузке таблицы плана</div>
            ) : (
              <LoadingIndicator />
            )}
          </div>
        </Paper>
      </div>
    );
  }

  if (state === 'notFound') {
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <Paper
          style={{
            width: '100%',
            height: '65vh',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Typography variant="body1semibold"> Данные не найдены</Typography>
          </div>
        </Paper>
      </div>
    );
  }
  return null;
};

export default TableStates;
