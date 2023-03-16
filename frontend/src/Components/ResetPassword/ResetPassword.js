import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector, } from "react-redux";
import { useAlert } from "react-alert"
import React, { useEffect, useState } from 'react'
import "./ResetPassword.css"
import { resetPassword } from '../../Actions/User';
import { Link, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const dispatch = useDispatch();
    const alert = useAlert()
    const { error, loading, message } = useSelector((state) => state.like)
    const params = useParams()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(resetPassword(params.token, newPassword))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: "clearMessage" })
        }
    }, [alert, error, dispatch, message])
    return (
        <div className="resetPassword">
            <form className="resetPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vmax" }}>
                    Social Media
                </Typography>
                <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    className="updatePasswordInputs"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Link to="/forgot/password"><Typography>Request Another Token</Typography></Link>

                <Button disabled={loading} type="submit">RESET PASSWORD</Button>
                <Link to="/"><Typography>Login</Typography></Link>
            </form>
        </div>
    )
}

export default ResetPassword