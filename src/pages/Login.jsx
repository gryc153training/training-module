import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                navigate('/dashboard');
            }
        };

        checkUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // This can be used to toggle between login and signup forms if needed
        if (isSignup) {
            await handleSignup();
        } else {
            await handleLogin();
        }
    }


    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message)
        } else {
            navigate('/dashboard');
        }
    };

    //TO DO LIST:
    // 1. Fix SupaBase Profile Table RLS Policy (Error: Database error saving new user) (DONE)
    // 2. Let form handle both login and signup with a toggle instead of separate buttons (can be done with state and conditional rendering) (DONE)
    // 3. Remove DOM Manipulation and use State to toggle between Login and Signup forms (DONE)
    // 4. Check confirm email issues. (i.e. only send 2 emails every hour, after confirming email it redirects to login page, etc.)(Fixed!! Now can send 30 emails per hour)
    // 5. Add Logout Functionality (DONE)
    // 6. Add Forgot Password Functionality (DONE)
    // 7. Add Reset Password Page (DONE)
    // 8. (Optional) Create a separate Reset Password input component for email instead of using the same email input for both login and forgot password (can be done with conditional rendering)
    // NEXT STEP MOVE ON TO DASHBOARD
    
    const handleSignup = async () => {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:5173/dashboard',
                data: {
                    display_name: name,
                }
            }
        });
        
        if (error) {
            alert(error.message)
            return;
        }
        
        alert('Signup successful! Check your email for confirmation.')

        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const passwordsMatch = password === confirmPassword;

    function handleCreateAccount(e) {
        e.preventDefault();
        setIsSignup(true);
    }
    
    function handleLoginAccount(e) {
        e.preventDefault();
        setIsSignup(false);
        setName('');
        setPassword('');
        setConfirmPassword('');
    }

    const handleForgotPassword = async () => {
    if (!email) {
        alert("Please enter your email first");
        return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password',
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Password reset email sent! (Make sure to check your Spam)");
    }
};


    return (
        <div id = "login-container" className ="container"> 
            <div > 
                <h2 id = 'login-title'> {isSignup ? "Signup" : "Login"} </h2>
                <p id = "login-subtext" className="subtext">{isSignup ? "Create your free account to start learning." : "Enter your credentials to access your account."}</p>
            </div>
            <form id = "login-form" onSubmit = {handleSubmit}>
                {isSignup ? 
                <input
                    id = "name"
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required = {isSignup}
                />
                : null}

                <input
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    id = "password"
                    type = "password"
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                {isSignup ?
                    <input
                        id = "confirm-password"
                        type = "password"
                        value = {confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required = {isSignup}
                    />
                    : null}

                <span id="message" style={{ color: 'red' }}>
                    {!passwordsMatch && confirmPassword && "Passwords Must Match"}
                </span>
                <button type="submit" className="btn">
                    {isSignup ? "Signup" : "Login"}
                </button>
            </form>
            {isSignup ? 
                <p className = "links" id = "login-account-btn">Already have an account? <a href='' onClick={handleLoginAccount}> Login </a></p> 
                : 
                <p className = "links" id = "create-account-btn">Don't have an account? <a href='' onClick={handleCreateAccount}> Sign Up </a></p>
            }
            <p className="links"><a href="" onClick={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                }}>
            {isSignup ? "" : "Forgot Password?"}
            </a></p>
        </div>
    );
}