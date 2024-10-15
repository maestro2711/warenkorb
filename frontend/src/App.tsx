
import './App.css'
import {useQuery} from "react-query";



//Components define here

import Drawer from '@material-ui/core/Drawer';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid2';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {Badge} from "@mui/material";

// styles( what we need for our componente for styling
import {Wrapper, StyledButton} from './App.styles';
import Item from "./Item/Item";
import {useState} from "react";
import Cart from "./Cart/Cart.tsx";
import cartItem from "./CartItem/CartItem.tsx";

//Types
export type CartItemType = {
  id:number,
  category:string,
  description:string,
  image:string,
  price:number,
  title:string,
  amount:number;
}

const getProducts = async ():Promise<CartItemType[]> =>
    await(await fetch('https://fakestoreapi.com/products')).json();


function App() {
  const [cartOpen,setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([])

  const { data, isLoading, error}= useQuery<CartItemType[]>(
      'products',
      getProducts);
  console.log(data)

  const getTotalItems = (items:CartItemType[])=>
  items.reduce((ack:number, item)=>ack + item.amount, 0);

  const handleAddToCart =(clickedItem:CartItemType)=> {
      setCartItems(prevState => {
          //1. is the item already  added in cart? when yes, only the amount will be increase
          const isItemInCart = prevState.find(item=>item.id===clickedItem.id)

          if(isItemInCart){
              return prevState.map(item=>(
                  item.id===clickedItem.id
                  ? {...item, amount: item.amount +1}
                      :item
              ))
              //First time thr item is added
          }
          return  [...prevState,{...clickedItem, amount:1}]

      })
  };

  const handleRemoveFromCart = (id:number)=> {
      setCartItems(prevState =>(
          prevState.reduce((ack, item) =>{
              if(item.id ===id){
                  if(item.amount===1) return ack; // we will remove the Item on the array, so we only return our accumulator and do nothing
                  return [...ack, {...item, amount:item.amount -1}]
              }else{
                  return [...ack, item]
              }

          }, [] as CartItemType[])
      ))
  };

  if(isLoading)
    return

    <LinearProgress />
  // das kommt von Material UI
  if(error)
    return <div>something went wrong ....</div>;




  return (

      <Wrapper>
        <Drawer anchor='right' open={cartOpen} onClose={()=>setCartOpen(false)}>
          <Cart cartItems={cartItems}
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
          />
        </Drawer>
        <StyledButton onClick={()=>setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color='error'>
            <AddShoppingCartIcon/>
          </Badge>
        </StyledButton>
        <Grid container spacing={3}>
          {data && data.length > 0 ? (
              data.map((item) => (
                  <Grid item key={item} size={{ xs: 12, md: 4 }}>
                    <Item item={item} handleAddToCart={handleAddToCart} />
                  </Grid>
              ))
          ) : (
              <p>No items available</p> // Fallback für leere oder nicht existierende Daten
          )}
        </Grid>
      </Wrapper>

  )
}

export default App
