import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu(){
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Fetch food items from backend
    useEffect(() => {
        fetch("http://localhost:8080/food-items")
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.error(err));

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Add item to cart
    function addToCart(item){
        const updatedCart = [...cart, item];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert(item.name + " added to cart");
    }

    return(
        <div style={{padding: "20px", maxWidth: "800px", margin: "auto"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h2>Canteen Menu</h2>
                <div>
                    <button onClick={() => navigate("/cart")} style={{padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>
                        Go to Cart 🛒 ({cart.length})
                    </button>
                    <button onClick={() => navigate("/home")} style={{padding: "10px 15px", marginLeft: "10px", cursor: "pointer", borderRadius: "5px", border: "1px solid #ccc"}}>
                        Home
                    </button>
                </div>
            </div>

            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px"}}>
                {items.length === 0 ? <p>Loading menu...</p> : null}
                {items.map(item => (
                    <div key={item.id} style={{border:"1px solid #ddd", borderRadius: "8px", padding:"15px", textAlign: "center", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}}>
                        <h3 style={{margin: "0 0 10px 0", color: "#333"}}>{item.name}</h3>
                        <p style={{fontSize: "1.2em", color: "#28a745", fontWeight: "bold", margin: "10px 0"}}>₹{item.price}</p>
                        <button onClick={() => addToCart(item)} style={{padding: "8px 15px", width: "100%", backgroundColor: "#ffc107", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"}}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu;