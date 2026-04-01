import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Orders(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Wrapped in useCallback to prevent infinite re-renders and satisfy ESLint
    const fetchOrders = useCallback(async () => {
        const clientId = localStorage.getItem("clientId");
        const token = localStorage.getItem("token");

        if (!clientId || !token) {
            navigate("/");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/orders/client/${clientId}/full`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                
                // Notification logic: Alert once when order becomes "READY FOR PICKUP"
                const notifiedOrders = JSON.parse(localStorage.getItem("notifiedOrders")) || [];
                let updatedNotified = [...notifiedOrders];
                let shouldUpdateStorage = false;

                data.forEach(order => {
                    if (order.status === "READY FOR PICKUP" && !notifiedOrders.includes(order.id)) {
                        alert(`🔔 Your order #${order.id} is READY FOR PICKUP!`);
                        updatedNotified.push(order.id);
                        shouldUpdateStorage = true;
                    }
                });

                if (shouldUpdateStorage) {
                    localStorage.setItem("notifiedOrders", JSON.stringify(updatedNotified));
                }
                
                setOrders(data.sort((a,b)=>b.id-a.id));
            } else if (res.status === 401) {
                console.error("Session expired.");
            }
        } catch(error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
        const intId = setInterval(fetchOrders, 3000);
        return () => clearInterval(intId);
    }, [fetchOrders]); // Added fetchOrders to dependencies

    if (loading) {
        return <div style={{padding: "20px"}}><h2>Loading orders...</h2></div>;
    }

    const getStatusTextAndColor = (status) => {
        switch(status) {
            case "PLACED": return { text: "Order Placed", color: "orange", bg: "#fffaf0" };
            case "PREPARING": return { text: "Preparing Food ⏳", color: "#17a2b8", bg: "#e0f7fa" };
            case "READY FOR PICKUP": return { text: "Ready for Pickup! 🔔", color: "purple", bg: "#f3e5f5" };
            case "COMPLETED": return { text: "Order Collected ✅", color: "green", bg: "#e8f5e9" };
            default: return { text: status, color: "black", bg: "#fdfdfd" };
        }
    };

    return(
        <div style={{padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif"}}>
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map(order => {
                    const statusInfo = getStatusTextAndColor(order.status);
                    return (
                        <div key={order.id} style={{border: `2px solid ${statusInfo.color}`, borderRadius: "8px", margin:"15px 0", padding:"20px", backgroundColor: statusInfo.bg, boxShadow: "0 4px 6px rgba(0,0,0,0.05)"}}>
                            <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "15px"}}>
                                <h3 style={{margin: 0}}>Order ID: #{order.id}</h3>
                                <h3 style={{margin: 0, color: statusInfo.color}}>{statusInfo.text}</h3>
                            </div>
                            
                            {order.status === "COMPLETED" && (
                                <div style={{backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontWeight: "bold", border: "1px solid #c3e6cb"}}>
                                    🎉 Order successfully collected
                                </div>
                            )}

                            {order.pickupTime && (
                                <p style={{margin: "0 0 15px 0", color: "#d9534f", fontWeight: "bold", fontSize: "16px"}}>
                                    Pickup Scheduled For: {order.pickupTime}
                                </p>
                            )}

                            <div style={{backgroundColor: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #ddd"}}>
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} style={{display: "flex", justifyContent: "space-between", padding: "5px 0"}}>
                                        <span>{item.name} <b>x{item.quantity}</b></span>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div style={{display: "flex", justifyContent: "flex-end", borderTop: "1px solid #ccc", paddingTop: "15px", marginTop: "15px"}}>
                                <h3 style={{margin: 0}}>Total: ₹{order.total.toFixed(2)}</h3>
                            </div>
                        </div>
                    );
                })
            )}
            <br/>
            <button onClick={() => navigate("/home")} style={{padding: "12px 25px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", fontSize: "16px"}}>Back to Home</button>
        </div>
    );
}

export default Orders;
