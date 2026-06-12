import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'


export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();


    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Password updated successfully!");
            navigate('/dashboard');
        }
    };

    return (
        <div id = "reset-container" className = "container">
            <h2 id = "reset-title">Reset Password</h2>
            <p className = "subtext">Please enter your new password below.</p>
            <form id = "reset-form" onSubmit={handleReset}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span></span>
                <button id = "reset-password-btn" className = "btn" type="submit">Update Password</button>
            </form>
        </div>
    );
}