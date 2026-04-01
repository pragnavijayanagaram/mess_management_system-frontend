import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async () => {
    try {
        const response = await fetch("http://localhost:8080/clients/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const textRes = await response.text();
        let data;
        try {
            data = JSON.parse(textRes);
        } catch(e) {
            // If the backend returns a literal string ("INVALID" or "eyJhb...")
            // It means the Spring Boot server has not been recompiled/rebooted!
            if(textRes === "INVALID") {
                alert("Invalid login");
                return;
            } else if (textRes.startsWith("eyJ")) {
                alert("Backend Update Required: Your backend is returning the old plain-text token. Please RESTART and REBUILD your Spring Boot Server to apply the latest changes!");
                return;
            } else {
                alert("Unknown response format: " + textRes);
                return;
            }
        }

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("clientId", data.clientId);
            localStorage.setItem("name", data.name);
            localStorage.setItem("role", data.role);
            
            if (data.role === "ADMIN") {
                navigate("/admin");
            } else {
                alert("Login success");
                navigate("/home");
            }
        } else {
            alert(data.error || "Invalid login");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Server error. Please try again later.");
    }
};

    return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5"}}>
            <div style={{padding: "40px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", textAlign: "center", width: "300px"}}>
                <h2 style={{marginBottom: "20px", color: "#333"}}>Login</h2>
                
                <input
                    style={{width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box"}}
                    placeholder="Email"
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    style={{width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box"}}
                    type="password"
                    placeholder="Password"
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button 
                    onClick={handleLogin}
                    style={{width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px"}}
                >
                    Login
                </button>

                <p 
                    onClick={()=>navigate("/signup")}
                    style={{marginTop: "20px", color: "#007bff", cursor: "pointer", fontSize: "14px"}}
                >
                    New User? Signup
                </p>
            </div>
        </div>
    )

}

export default Login;