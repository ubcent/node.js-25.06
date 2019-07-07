import React, { useState } from 'react';
import { Box, Color, Text } from 'ink';
import Statistics from './Statistics';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { randomBoolean } from '../helpers';

const answers = [{
  label: 'Орел',
  value: 0,
}, {
  label: 'Решка',
  value: 1,
}];

export default function Play({ onFinish }) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');

  const onSelect = selected => {
    setAnswer(selected.label);
    const newResult = randomBoolean();
    setResult(newResult);
    onFinish(newResult);
  };

  return (
		<Box
      flexDirection="column"
		>
      {!answer
        ? (
          <>
            <Text bold>Ваш ход:</Text>
            <SelectInput items={answers} onSelect={onSelect} />
          </>
        )
        : (
          <Color green><Text>Вы {result ? 'выиграли' : 'проиграли'}!</Text></Color>
        )
      }
    </Box>
	);
}
