import { Button } from "react-bootstrap";

export const RemoveFromCartComponent=({productId,orderCreated,quantity,price,deleteCartItem=false})=>{
    return(
        <>
            <Button disabled={orderCreated} type="button" variant="secondary" onClick={deleteCartItem?()=>deleteCartItem(productId,quantity,price):undefined}><i class="bi bi-trash"></i></Button>
        </>
    )
}

