import { supabase } from '../supabaseClient'
import {useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
 
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setLoggedIn(true);
            }
        };

        checkUser();
    }, []);

    return (
        <header> 
            <h1> GRYC PS 153 Training</h1>
            <nav> 
                <Link to = "/dashboard">Dashboard</Link>
                <Link to = "/module">Modules</Link>
                <Link to = "/resources">Resources</Link>
                <Link to = "/help">Help</Link>
                {loggedIn ? <button className = 'btn' onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                }}>Logout</button>
                :
                null}
            </nav>
        </header>
    );
}