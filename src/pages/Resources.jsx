import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom';

export default function Resources() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const {data: { session }} = await supabase.auth.getSession();


            if (!session) {
                navigate('/');
            }
        };
        checkUser();
    }, []);


    return(
    <div className="resources-page">
        <div className="resources-card">
            <h1>Resources</h1>
            <p className="resources-subtitle">
            Access important documents and forms used throughout the program.
            </p>

            <div className="resource-list">
                <a
                    href="https://canva.link/yxtrjkvzy02hc9t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                >
                    📖 GRYC Policies
                </a>

                <a
                    href="https://canva.link/02h6r4e8o6jnheg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                >
                    🩺 Medical Report Form
                </a>

                <a
                    href="https://canva.link/q2xsx8lwoav71sx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                >
                    📝 Incident Report Form
                </a>
                <a
                    href="https://canva.link/i71xen7pl8fkna3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                >
                    📅 Calendars
                </a>
            </div>
        </div>
    </div>
    )
}