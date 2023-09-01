import React from 'react';
import {Routes, Route} from 'react-router-dom';
import axios from "axios";
import Index from './components/Drawer';
import Header from './components/Header';
import AppContext from './context';
import Orders from './pages/Orders';

import Home from './pages/Home';
import Favorites from './pages/Favorites';


function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  console.log(JSON.stringify(cartItems));

  React.useEffect(() => {
    async function fetchData() {
      const itemsResponse = await axios.get('https://62c67d2774e1381c0a604dc7.mockapi.io/items');
      const cartResponse = await axios.get('https://62c67d2774e1381c0a604dc7.mockapi.io/cart');
      const favoritesResponse = await axios.get('https://62c67d2774e1381c0a604dc7.mockapi.io/favorites');

      setIsLoading(false);

      setItems(itemsResponse.data);
      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
    }

    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    console.log(obj);
    if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
      axios.delete(`https://62c67d2774e1381c0a604dc7.mockapi.io/cart${obj.id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
    } else {
      axios.post('/cart', obj);
      setCartItems((prev) => [...prev, obj]);
    }
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://62c67d2774e1381c0a604dc7.mockapi.io/cart${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        await axios.delete(`https://62c67d2774e1381c0a604dc7.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const {data} = await axios.post('https://62c67d2774e1381c0a604dc7.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }


  const isItemAdded = (id) => {
    console.log(id, 222);
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  }


  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems
      }}>
      <div className="wrapper clear">
        <Index
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)}/>

        <Routes>
          <Route exact path="/" element={
            <Home
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />
          }/>
          <Route exact path="/orders" element={<Orders/>}/>
          <Route exact path="/favorites" element={<Favorites/>}/>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
