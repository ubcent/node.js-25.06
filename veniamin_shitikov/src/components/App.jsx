import React, { useState } from 'react';
import { Box, Color, Text } from 'ink';
import TextInput from 'ink-text-input';
import Game from './Game';

const GAME_NAME = 'ОРЕЛ И РЕШКА';

function App({ exit }) {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');


  const handleSubmit = () => {
    if (!name) setName('Гость');
    setReady(true);
  }

  return (
		<Box
      width="90%"
      height="90%"
		>
      {!ready
        ? (
          <>
            <Color green>
              <Text>Здравствуйте! Добро пожаловать в игру {GAME_NAME}!
              Введите ваше имя.{'\n'}>: </Text>
            </Color>
            <TextInput
              value={name}
              onChange={setName}
              onSubmit={handleSubmit}
              showCursor
            />
          </>
        ) 
        : <Game user={name} />
      }
    </Box>
	);
}

module.exports = { App };
