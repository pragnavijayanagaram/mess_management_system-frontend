import React, { useState, useEffect, useRef } from "react";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am your Canteen Bot. Ask me about the menu, your order status, or pickup time!", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    // Process message
    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input.trim();
        setMessages(prev => [...prev, { text: userText, sender: "user" }]);
        setInput("");

        const lowerInput = userText.toLowerCase();
        let botResponse = "I'm sorry, I didn't understand that. You can ask about the menu, your order status, or pickup times.";

        try {
            if (lowerInput.includes("menu")) {
                const res = await fetch("http://localhost:8080/food-items");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        const items = data.map(item => `${item.name} (₹${item.price})`).join(", ");
                        botResponse = `Today's menu includes: ${items}.`;
                    } else {
                        botResponse = "The menu is currently empty.";
                    }
                } else {
                    botResponse = "I couldn't fetch the menu right now.";
                }
            } else if (lowerInput.includes("status") || lowerInput.includes("pickup") || lowerInput.includes("time")) {
                const clientId = localStorage.getItem("clientId");
                const token = localStorage.getItem("token");
                if (!clientId || !token) {
                    botResponse = "Please login first to check your personal order details.";
                } else {
                    const res = await fetch(`http://localhost:8080/orders/client/${clientId}/full`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const orders = await res.json();
                        if (orders.length > 0) {
                            // Find latest order
                            const latestOrder = orders.sort((a,b)=>b.id - a.id)[0];
                            if (lowerInput.includes("status")) {
                                botResponse = `Your latest order (#${latestOrder.id}) is currently: ${latestOrder.status}.`;
                            } else {
                                botResponse = `Your latest order (#${latestOrder.id}) is scheduled for pickup at ${latestOrder.pickupTime}.`;
                            }
                        } else {
                            botResponse = "You haven't placed any orders yet.";
                        }
                    } else {
                        botResponse = "I couldn't fetch your orders right now.";
                    }
                }
            }
        } catch(error) {
            console.error("Chatbot API error:", error);
            botResponse = "Sorry, I am having trouble connecting to the server.";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        }, 500); // slight delay for realistic bot feel
    };

    return (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
            {isOpen ? (
                <div style={{ width: "300px", height: "400px", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <div style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ margin: 0 }}>Canteen Bot 🤖</h4>
                        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>×</button>
                    </div>
                    <div style={{ flex: 1, padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ 
                                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f1f1",
                                color: msg.sender === "user" ? "#fff" : "#333",
                                padding: "8px 12px", borderRadius: "15px", maxWidth: "80%", wordWrap: "break-word", fontSize: "14px"
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={{ display: "flex", borderTop: "1px solid #eee", padding: "10px" }}>
                        {/* eslint-disable-next-line */}
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me something..."
                            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none" }}
                        />
                        <button onClick={handleSend} style={{ marginLeft: "5px", padding: "8px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Send</button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", fontSize: "24px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    💬
                </button>
            )}
        </div>
    );
}

export default Chatbot;
