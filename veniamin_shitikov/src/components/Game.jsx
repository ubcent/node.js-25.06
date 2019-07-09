import React, { useState } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

import Statistics from './Statistics';
import Play from './Play';
import logger from '../logger';

const answers = [{
  label: 'Играть',
  value: 1,
}, {
  label: 'Выход',
  value: 2,
}];

export default function Game({ user }) {
  const [score, setScore] = useState({
    count: 0,
    win: 0,
  });
  const [step, setStep] = useState(0);
  const { count, win } = score;

  const onSelect = selected => {
    setStep(selected.value);
  };

  const onFinish = (result) => {
    logger(user, result);
    setScore({
      count: count + 1,
      win: result ? win + 1 : win,
    });
    setTimeout(() => setStep(0), 1000);
  }

  if (step === 2) return null;

  return (
    <Box width="100%" height={8} flexDirection="column">
      <Statistics
        user={user}
        games={count}
        win={win}
        lose={count - win}
      />
      {step === 0
        ? (
          <>
            <Text bold>Выберите действие:</Text>
            <SelectInput items={answers} onSelect={onSelect} />
          </>
        )
        : (
          <Play onFinish={onFinish} />
        )
      }
    </Box>
  );
}
