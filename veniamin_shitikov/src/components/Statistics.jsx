import React from 'react';
import { Box, Text } from 'ink';

export default function Statistics({ games, win, lose, user }) {
  const fields = [
    {
      title: 'Игрок: ',
      value: user,
    },
    {
      title: 'Игр сыграно: ',
      value: games,
    },
    {
      title: 'Побед: ',
      value: win,
    },
    {
      title: 'Поражений: ',
      value: lose,
    },
   ];
  
  return (
    <Box flexDirection="column" height={fields.length}>
      {fields.map(({ title, value }) => (
        <Box key={title} width={20} justifyContent="space-between">
          <Text>{title}</Text>
          <Text>{value}</Text>
        </Box>
      ))}
    </Box>
  );
}
