import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup(){
    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("STUDENT");

    const register = async () => {
        try {
            const response = await fetch("http://localhost:8080/clients/register", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    role: role
                })
            });

            if(response.ok) {
                alert(`Registration Successful as ${role}`);
                navigate("/");
            } else {
                alert("Registration Failed");
            }
        } catch(error) {
            console.error(error);
            alert("Server not running");
        }
    }

    return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5"}}>
            <div style={{padding: "40px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", textAlign: "center", width: "300px"}}>
                <h2 style={{marginBottom: "20px", color: "#333"}}>Signup</h2>
                
                <input
                    style={{width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box"}}
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

                <input
                    style={{width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box"}}
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    style={{width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box"}}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <select 
                    style={{width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box"}}
                    value={role} 
                    onChange={(e)=>setRole(e.target.value)}
                >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <button 
                    onClick={register}
                    style={{width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px"}}
                >
                    Register
                </button>

                <p 
                    onClick={()=>navigate("/")}
                    style={{marginTop: "20px", color: "#007bff", cursor: "pointer", fontSize: "14px"}}
                >
                    Back to Login
                </p>
            </div>
        </div>
    )
}

export default Signup;