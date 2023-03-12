import "./UpdatePassword.css"
import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import { useDispatch, } from "react-redux";
import { loginUser } from "../../Actions/User";

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(loginUser(oldPassword, newPassword));
    };

    return (
        <div className="updatePassword">
            <form className="updatePasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vmax" }}>
                    Social Media
                </Typography>

                <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    className="updatePasswordInputs"
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    className="updatePasswordInputs"
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <Button type="submit">CHANGE PASSWORD</Button>
            </form>
        </div>
    );
};

export default UpdatePassword