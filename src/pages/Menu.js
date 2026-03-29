import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu(){

const navigate = useNavigate();

const [items,setItems] = useState([]);
const [cart,setCart] = useState([]);

useEffect(()=>{

fetch("http://localhost:8080/food-items")
.then(res=>res.json())
.then(data=>setItems(data));

},[]);


const updatedCart = [...cart, item];
setCart(updatedCart);

localStorage.setItem("cart", JSON.stringify(updatedCart));

}
return(

<div>

<h2>Canteen Menu</h2>

{items.map(item => (

<div key={item.id}>

<h3>{item.name}</h3>
<p>₹{item.price}</p>

<button onClick={()=>addToCart(item)}>
Add to Cart
</button>

</div>

))}

<h3>Items in Cart: {cart.length}</h3>

<br/>

<button onClick={()=>navigate("/cart")}>
Go To Cart
</button>

</div>

)

}

export default Menu;