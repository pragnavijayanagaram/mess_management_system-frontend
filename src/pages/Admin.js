import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Admin(){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const navigate = useNavigate();

    // Wrapped in useCallback to prevent infinite re-renders and satisfy ESLint
    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch("http://localhost:8080/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else if (res.status === 401) {
                alert("Session expired");
                navigate("/");
            }
        } catch(error) {
            console.error("Error fetching admin orders", error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
        // Auto-refresh orders every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders]); // Added fetchOrders to dependencies

    const addFood = async () => {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:8080/food-items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, price })
        });
        alert("Food Added ✅");
        setName("");
        setPrice("");
    };

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8080/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch(error) {
            console.error("Error updating status", error);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const filteredOrders = orders.filter(o => filter === "ALL" || o.status === filter);

    const getStatusColor = (status) => {
        switch(status) {
            case "PLACED": return "orange";
            case "PREPARING": return "#17a2b8";
            case "READY FOR PICKUP": return "purple";
            case "COMPLETED": return "green";
            default: return "black";
        }
    };

    return (
        <div style={{padding: "20px", maxWidth: "1000px", margin: "auto", fontFamily: "sans-serif"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                <h2>Admin Dashboard</h2>
                <button onClick={logout} style={{padding: "10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer"}}>Logout 🚪</button>
            </div>

            <div style={{display: "flex", gap: "20px"}}>
                {/* Left Panel: Manage Menu */}
                <div style={{flex: "1", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", height: "fit-content"}}>
                    <h3>➕ Add Food Item</h3>
                    <input style={{width: "100%", padding: "8px", margin: "10px 0", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc"}} placeholder="Food Name" value={name} onChange={(e)=>setName(e.target.value)} />
                    <input style={{width: "100%", padding: "8px", margin: "10px 0 20px 0", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc"}} placeholder="Price" value={price} onChange={(e)=>setPrice(e.target.value)} />
                    <button onClick={addFood} style={{width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"}}>Add Food</button>
                </div>

                {/* Right Panel: Orders */}
                <div style={{flex: "2", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #ddd"}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px"}}>
                        <h3 style={{flex: 1}}>📜 Order Management</h3>
                        <select style={{padding: "8px", borderRadius: "4px", marginLeft: "auto"}} value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="ALL">All Orders (Today)</option>
                            <option value="PLACED">Placed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY FOR PICKUP">Ready for Pickup</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                        {filteredOrders.length === 0 ? <p>No orders found.</p> : filteredOrders.map(order => (
                            <div key={order.id} style={{border: "1px solid #eee", borderRadius: "8px", padding: "15px", backgroundColor: order.status === "COMPLETED" ? "#f0fff0" : "#fffaf0", boxShadow: "0 2px 5px rgba(0,0,0,0.05)"}}>
                                <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px"}}>
                                    <strong>Order #{order.id}</strong>
                                    <span style={{color: "white", backgroundColor: getStatusColor(order.status), padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold"}}>{order.status}</span>
                                </div>
                                <div style={{marginBottom: "10px"}}>
                                    <p style={{margin: "0 0 5px 0"}}><strong>Student:</strong> {order.clientName}</p>
                                    <p style={{margin: "0 0 5px 0"}}><strong>Email:</strong> {order.clientEmail}</p>
                                    <p style={{margin: "0 0 5px 0", color: "#d9534f", fontWeight: "bold"}}><strong>Pickup Time:</strong> {order.pickupTime}</p>
                                </div>
                                <div style={{backgroundColor: "#fff", padding: "10px", borderRadius: "4px", border: "1px solid #ddd"}}>
                                    <strong>Items:</strong>
                                    <ul style={{margin: "5px 0", paddingLeft: "20px"}}>
                                        {order.items && order.items.map((it, idx) => (
                                            <li key={idx}>{it.name} x{it.quantity} (₹{it.price})</li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px"}}>
                                    <h4 style={{margin: 0}}>Total: ₹{order.total.toFixed(2)}</h4>
                                    
                                    <div>
                                        {order.status === "PLACED" && (
                                            <button onClick={() => updateStatus(order.id, "PREPARING")} style={{padding: "8px 15px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"}}>
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === "PREPARING" && (
                                            <button onClick={() => updateStatus(order.id, "READY FOR PICKUP")} style={{padding: "8px 15px", backgroundColor: "purple", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"}}>
                                                Mark Ready
                                            </button>
                                        )}
                                        {order.status === "READY FOR PICKUP" && (
                                            <button onClick={() => updateStatus(order.id, "COMPLETED")} style={{padding: "8px 15px", backgroundColor: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"}}>
                                                Complete Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
