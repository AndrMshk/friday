import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PacksTable } from './PacksTable';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { createPackTC, setPacksTC } from './packs-reducer';
import useDebounce from '../../common/hooks/useDebounce';
import { Button } from '@mui/material';
import style from './Packs.module.css';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { SliderFilter } from './Slider';

export const Packs = () => {

  const dispatch = useAppDispatch();

  const { cardPacks, page, cardPacksTotalCount, pageCount } = useAppSelector(state => state.packs);
  const maxCardsCount = useAppSelector(state => state.packs.maxCardsCount);
  const userId = useAppSelector(state => state.profile._id);
  const isLoggedIn = useAppSelector(state => state.login.isLoggedIn);

  const [filterByCardsCount, setFilterByCardsCount] = useState<number[]>([0, maxCardsCount]);
  const [isShowMyPacks, setIsShowMyPacks0] = useState<boolean>(false);
  const [packName, setPackName] = useState<string>('');
  const packNameDebounce = useDebounce(packName, 1000);
  const filterByCardsCountDebounce = useDebounce(filterByCardsCount, 1000);

  //временная заглушка на добавление колоды
  const addNewPackHandler = () => {
    const name = prompt();
    if (name) {
      dispatch(createPackTC(name));
    }
  };

  useEffect(() => {
    dispatch(setPacksTC(
      {
        page,
        pageCount,
        min: filterByCardsCount[0],
        max: filterByCardsCount[1],
        user_id: isShowMyPacks ? userId : undefined,
        packName: !!packName ? packName : undefined,
      }));
  }, [page, pageCount, isShowMyPacks, filterByCardsCountDebounce, packNameDebounce]);

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.sidebar}>
          <div className={style.sidebarBlock}>
            <h2>Show packs</h2>
            <ButtonGroup disableElevation>
              <Button
                onClick={() => setIsShowMyPacks0(false)}
                variant={!isShowMyPacks ? 'contained' : 'text'}
              >All</Button>
              <Button
                onClick={() => setIsShowMyPacks0(true)}
                variant={isShowMyPacks ? 'contained' : 'text'}
              >My</Button>
            </ButtonGroup>
            <SliderFilter
              filterByCardsCount={filterByCardsCount}
              setFilterByCardsCount={setFilterByCardsCount}
            />
          </div>
        </div>
        <div className={style.mainBlock}>
          <h1 className={style.title}>Packs list</h1>
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
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
              />
            </Box>
            <Button
              onClick={addNewPackHandler}
              variant="contained"
            >Add new pack</Button>
          </div>
          <div className={style.table}>
            <PacksTable
              packs={cardPacks}
              userId={userId}
              rowsPerPage={pageCount}
              pageCount={cardPacksTotalCount} />
          </div>
        </div>
      </div>
    </div>
  );
};


