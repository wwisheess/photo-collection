import React from 'react';
import './App.css';

import { Collection } from './components/Collection/Collection';

const cats = [
  { name: 'Все' },
  { name: 'Море' },
  { name: 'Горы' },
  { name: 'Архитектура' },
  { name: 'Города' },
];

export default function App() {
  const [page, setPage] = React.useState(1);
  const [categoryId, setCategoryId] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [collections, setCollections] = React.useState([]);
  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryId ? `category=${categoryId}` : '';
    const pageParam = `page=${page}`;

    fetch(
      `https://664f38b9fafad45dfae2e042.mockapi.io/collection?${pageParam}&limit=3&${category}`
    ).then((res) =>
      res
        .json()
        .then((json) => {
          setCollections(json);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении данных');
        })
        .finally(() => setIsLoading(false))
    );
  }, [categoryId, page]);
  return (
    <div className='container'>
      <h1 className='title'>Моя коллекция фотографий</h1>
      <section className='top'>
        <ul className='tags__list'>
          {cats.map((obj, index) => (
            <li
              onClick={() => setCategoryId(index)}
              key={obj.name}
              className={
                categoryId === index
                  ? 'tags__item tags__item--active'
                  : 'tags__item'
              }
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='search__input'
          placeholder='Поиск по названию'
        />
      </section>
      <section className='collections'>
        <div className='collections__inner'>
          {isLoading ? (
            <span className='loading'>Загрузка...</span>
          ) : (
            collections
              .filter((obj) =>
                obj.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((obj, index) => {
                return (
                  <Collection key={index} name={obj.name} images={obj.photos} />
                );
              })
          )}
        </div>

        {isLoading ? (
          ''
        ) : (
          <ul className='pagination'>
            {[...Array(3)].map((_, i) => (
              <li
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={
                  page === i + 1
                    ? 'pagination__item pagination__item--active'
                    : 'pagination__item'
                }
              >
                {i + 1}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
