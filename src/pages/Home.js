import { useNavigate } from "react-router-dom";

function Home(){

const navigate = useNavigate();

function logout(){
navigate("/");
}

function goToMenu(){
navigate("/menu");
}

    const userName = localStorage.getItem("name") || "User";

    return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5"}}>
            <div style={{textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)"}}>
                <h1 style={{color: "#333"}}>Welcome, {userName}!</h1>
                <p style={{color: "#666", marginBottom: "30px"}}>Canteen Ordering System</p>
                
                <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                    <button 
                        onClick={goToMenu}
                        style={{padding: "15px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer"}}
                    >
                        View Menu 🍔
                    </button>

                    <button 
                        onClick={()=>navigate("/orders")}
                        style={{padding: "15px", backgroundColor: "#17a2b8", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer"}}
                    >
                        Order History 📜
                    </button>
                    
                    <button 
                        onClick={logout}
                        style={{padding: "10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", fontSize: "14px", cursor: "pointer", marginTop: "10px"}}
                    >
                        Logout 🚪
                    </button>
                </div>
            </div>
        </div>
    )

}

export default Home;