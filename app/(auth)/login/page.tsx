"use client";
import { useEffect, useState } from "react";
import { userDetail } from "@/types/user";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onclickHandler = async () => {
        try {
            const userDetail: userDetail = { email, password };
            const response = await fetch(`/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDetail),
            });
            const data = await response.json();
            console.log(data);
        } catch (e) {
            console.error(`Error sending the post request for login: ${e}`);
        }
    };

    useEffect(() => {
        console.log("Email: ", email);
        console.log("Password: ", password);
    }, [email, password]);

    return (
        <>
            <input
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={onclickHandler}>Submit</button>
        </>
    );
};

export default Login;
