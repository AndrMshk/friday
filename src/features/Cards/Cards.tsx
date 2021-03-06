import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { useParams } from 'react-router-dom';
import { CardsTable } from './CardsTable';
import { createCardTC, setCardsTC } from './cards-reducer';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import useDebounce from '../../common/hooks/useDebounce';
import style from '../Packs/Packs.module.css';

export const Cards = () => {

  const dispatch = useAppDispatch();
  const { packId } = useParams<'packId'>();

  const { packUserId, cards, page, pageCount, cardsTotalCount } = useAppSelector(state => state.cards);
  const packName = useAppSelector(state => state.packs.cardPacks.find(el => el._id === packId)?.name);
  const userId = useAppSelector(state => state.profile._id);

  const [question, setQuestion] = useState<string>('');
  const questionDebounce = useDebounce(question, 1000);

//временная заглушка на добавление карточки
  const addNewCardHandler = () => {
    const question = prompt('question');
    const answer = prompt('answer');
    if (packId && question && answer) {
      dispatch(createCardTC({ cardsPack_id: packId, question, answer }));
    }
  };

  useEffect(() => {
    if (packId) {
      dispatch(setCardsTC(
        {
          cardsPack_id: packId,
          page,
          pageCount,
          cardQuestion: !!question ? question : undefined,
        }));
    }
  }, [packId, page, pageCount, questionDebounce]);

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div>
          {userId !== packUserId
            ? <div><h3>{packName}</h3></div>
            : <div>
              <h3>{packName}</h3>
              <div className={style.searchAndAdd}>
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="search"
                    label="search"
                    variant="outlined"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </Box>
                <Button
                  onClick={addNewCardHandler}
                  variant="contained"
                >Add new card</Button>
              </div>
            </div>}
          <div className={style.table}>
            <CardsTable cards={cards} userId={userId} pageCount={cardsTotalCount} rowsPerPage={pageCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

