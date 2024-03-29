import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agents";
import NotFound from "../../app/api/errors/NoFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
 
//useParams : returns object of key/value pairs of URL parameters
export default function ProductDetails() {

    //debugger;
    //const { basket, setBasket, removeItem } = useStoreContext(); //context
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);//component에 product 가져옴
    const [loading, setLoading] = useState(true); //component를 초기화할때 loading=true
    const [quantity, setQuantity] = useState(0); //quantity : quantity container에서 선택한 수량
    const item = basket?.items.find(i => i.productId === product?.id); //item.quantity : original cart quantity
    //updatedQuantity : update될 quantity

    //사용자의 요청(URL)에 의해 product id를 서버에 요청, 에러시 예외처리
    useEffect(() => {
        if (item) setQuantity(item.quantity);

        agent.Catalog.details(parseInt(id!))
            .then(response => setProduct(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id, item])

    /* Item quantity */
    function handleInputChange(event: any) {
        if (event.target.value >= 0) {
            setQuantity(parseInt(event.target.value));
        }
    }

    /* Adding item to cart */
    function handleUpdateCart() {
         if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            dispatch(addBasketItemAsync({productId : product?.id!, quantity: updatedQuantity}))
        } else {
            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({productId : product?.id!, quantity: updatedQuantity}))

        }
    }

    if (loading) return <LoadingComponent message='Loading Product...' />

    if (!product) return <NotFound />



    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/*Quantity container */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* value={quantity} */}
                        <TextField
                            onChange={handleInputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    {/*Quantity button */}
                    <Grid item xs={6}>
                        <LoadingButton
                        disabled={item?.quantity === quantity }
                            loading={status.includes('pendingRemoveItem' + item?.productId)}
                            onClick={handleUpdateCart}
                            sx={{ height: '55px' }}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                        >
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


