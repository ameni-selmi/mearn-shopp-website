import ShoppingCart from '@mui/icons-material/ShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'
import { Alert, Button, ButtonGroup, Grid, List, ListItem, Rating, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Store } from '../store'

export default function Cart() {

    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {
        cart : {cartItems} ,
        } = state

        const removeItemHandler = (item) => {
            ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
        }

    return (
        <>
            <Helmet>
                <title>Shopping cart</title>
            </Helmet>

            <Typography
                sx={{
                pt: 8,
                pb: 6,
                }}
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Shopping cart
            </Typography>
            <Grid  container spacing={4}>
                <Grid item xs={12}>
                    {cartItems.length === 0 ?
                        (
                            <Alert severity="warning">
                                Cart is empty!
                                <Link to="/">  Go to shopping  </Link>
                            </Alert>
                        ):(
                            <List >
                                {
                                    cartItems.map((item) =>(
                                        <ListItem key={item._id}>
                                            <Grid className='Grid' item xs={4} >
                                                <Link to={`/product/${item.slug}`}>
                                                    <img    
                                                        src={`${item.image}?w=248&fit=crop&auto=format`}
                                                        srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        />

                                                </Link>
                                            </Grid>
                                            <Grid item xs={4} >
                                                <h1>{item.name}</h1>
                                                <span>by: {item.brand}</span>
                                                <div className='rating'>
                                                <Rating name="half-rating-read"  value={item.rating} precision={0.5} readOnly />
                                                    <span className='nb-rating'>{item.nbRating}</span>
                                                </div>
                                            </Grid>
                                            <Grid>
                                                <List>
                                                <ListItem>
                                                        <Button 
                                                            onClick={event =>  window.location.href= item.link } 
                                                            variant="contained" 
                                                            style={{backgroundColor: "#F8CB2E", width : "100%" }}
                                                            endIcon={<ShoppingCart />}>
                                                            Order now
                                                        </Button>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Button 
                                                            onClick={() => {removeItemHandler(item)}} 
                                                            variant="outlined" 
                                                            style={{ color: "#B22727", width : "100%" , border : "1px solid #B22727"}}
                                                            startIcon={<DeleteIcon />}>
                                                            Delete
                                                        </Button>
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        )

                    }
                </Grid>
            </Grid>

        </>
  )
}
