import { supabase } from '../supabaseClient'
import {useState,useEffect} from 'react'



export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
 
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
                <a href = "/dashboard">Dashboard</a>
                <a href = "/module">Modules</a>
                <a href = "/resources">Resources</a>
                <a href = "/help">Help</a>
                {loggedIn ? <button className = 'btn' onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                }}>Logout</button>
                :
                null}
            </nav>
        </header>
    );
}