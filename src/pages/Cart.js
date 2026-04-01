import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart(){
    const [cart, setCart] = useState([]);
    const [pickupTime, setPickupTime] = useState("12:00 PM");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    },[]);

    const placeOrder = async () => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        if(cartItems.length === 0){
            alert("Cart is empty!");
            return;
        }

        const clientId = localStorage.getItem("clientId");
        const token = localStorage.getItem("token");

        if(!clientId || !token) {
            alert("Please login first.");
            navigate("/");
            return;
        }

        setLoading(true);
        const totalAmount = cartItems.reduce((sum, item)=>sum+item.price, 0);

        try {
            const response = await fetch("http://localhost:8080/orders/full",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    clientId: Number(clientId),
                    pickupTime: pickupTime,
                    total: totalAmount,
                    items: cartItems.map(item => ({
                        id: item.id,
                        price: item.price,
                        quantity: 1
                    }))
                })
            });

            if (response.ok) {
                alert("Order placed successfully");
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/orders");
            } else if (response.status === 401) {
                alert("Session expired. Please login again.");
                navigate("/");
            } else {
                alert("Order failed" + await response.text());
            }
        } catch(error) {
            console.error(error);
            alert("Server connect failed");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div style={{padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "sans-serif"}}>
            <h2>Your Cart</h2>
            
            {cart.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <div style={{border: "1px solid #ddd", padding: "15px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"}}>
                    {cart.map((item,index)=>(
                        <div key={index} style={{display: "flex", justifyContent: "space-between", borderBottom: index < cart.length - 1 ? "1px solid #eee" : "none", padding: "10px 0"}}>
                            <span>{item.name}</span>
                            <span style={{fontWeight: "bold", color: "#28a745"}}>₹{item.price}</span>
                        </div>
                    ))}
                    
                    <div style={{display: "flex", justifyContent: "space-between", padding: "15px 0 0 0", borderTop: "2px solid #ddd", marginTop: "10px"}}>
                        <h3 style={{margin: 0}}>Total Amount:</h3>
                        <h3 style={{margin: 0}}>₹{cart.reduce((sum, item)=>sum+item.price, 0).toFixed(2)}</h3>
                    </div>

                    <div style={{marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <strong style={{fontSize: "16px"}}>Select Pickup Time:</strong>
                        <select 
                            value={pickupTime} 
                            onChange={(e) => setPickupTime(e.target.value)}
                            style={{padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px", outline: "none"}}
                        >
                            <option value="4:00 PM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="12:00 PM">12:10 PM</option>
                            <option value="12:00 PM">12:20 PM</option>
                            <option value="12:00 PM">12:30 PM</option>
                            <option value="12:00 PM">12:40 PM</option>
                            <option value="12:00 PM">12:50 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="1:00 PM">1:10 PM</option>
                            <option value="1:00 PM">1:20 PM</option>
                            <option value="1:00 PM">1:30 PM</option>
                            <option value="1:00 PM">1:40 PM</option>
                            <option value="1:00 PM">1:50 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
    
                        </select>
                    </div>
                </div>
            )}

            <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
                <button onClick={() => navigate("/menu")} style={{padding: "12px 20px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", backgroundColor: "#fff", fontSize: "16px", flex: 1}}>← Back to Menu</button>
                {cart.length > 0 && (
                    <button 
                        onClick={placeOrder} 
                        disabled={loading}
                        style={{padding: "12px 20px", backgroundColor: loading ? "#6c757d" : "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "bold", flex: 2}}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Cart;