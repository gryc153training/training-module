import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [name, setName] = useState('');
    const modules = [
        {
            title: 'module_1',
            subModules: 8
        },
        {
            title: 'module_2',
            subModules: 6
        },
        {
            title: 'module_3',
            subModules: 5
        },
        {
            title: 'module_4',
            subModules: 3
        },
    ];
    const [totalCompleted, settotalCompleted] = useState(0);
    const [certificate, setCertificate] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchName = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if(user){
                setName(user.user_metadata.display_name);
            }
        };
        fetchName();
    })

    useEffect(() => {
        checkUser();
        
    }, []);

    const checkUser = async () => {
        const {data: { session }} = await supabase.auth.getSession();

        if (!session) {
            navigate('/');
        }
    };

    const checkCompleted = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if(!user){ return }

        let total = 0;

        for (let i = 0; i < modules.length; i++){
            for (let j = 0; j < modules[i].subModules; j++){
                const column = `is_completed_module_${i+1}` + `${String.fromCharCode(j+97)}`
                const {error, data} = await supabase
                .from(`${modules[i].title}`)
                .select(column)
                .eq('user_id', user.id)
                .maybeSingle()

                if(error || !data) continue;

                if(data[column]){
                    total++;
                }
            }
        }
        settotalCompleted(total);
    }

    const checkCertificate = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if(!user){ return }

        const {error, data} = await supabase
        .from('module_4')
        .select('is_completed_module_4c')
        .eq('user_id', user.id)
        .maybeSingle()

        if(error || !data) return;

        if(data.is_completed_module_4c){
            setCertificate(true)
        } else {
            setCertificate(false)
        }
    }

    useEffect(() => {
        checkCompleted();
        checkCertificate();
    }, [])


    
    // CURRENT TO-DO LIST FOR FINISHING PROJECT BECAUSE WE ARE ALMOST DONE!!:
    // 1. Finish Dashboard (i.e. Continue Learning Button takes you to most recent unlocked module, Progress: shows a percentage of the modules completed (ex: if finished
    //    2 out of 4 modules the progress bar should be half filled and say 50% completed.), Modules: Shows list of modules and completion status (module completed, quiz passed, etc.))
    // 2. Add the HELP page. (Probably just a page that says if you have any questions or need any help contact ...)
    // 3. Check all comments and fix anything that needs to be fixed
    // 4. Once done check for any bugs or ways to bypass things. Thourough check.
    // 5. Check Supabase (email address sender, text message maybe?? Just check)
    // 6. Push to Github (Make a new account with a new username appropiate for project)

    return (
        <div className="dashboard">
            <div className="welcome-card">
                <h1>{name ? `Welcome back, ${name} 👋` : "Loading..."}</h1>
                <p>Continue your training journey.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Lessons</h3>
                    <span>22</span>
                </div>

                <div className="stat-card">
                    <h3>Completed</h3>
                    <span>{`${totalCompleted}`}</span>
                </div>

                <div className="stat-card">
                    <h3>Certificate</h3>
                    <span>{certificate ? `Completed` : "Locked"}</span>
                </div>
            </div>

            <div className="modules-card">
                <h2>Training Modules</h2>

                <ul>
                    <li>Module 1 - GRYC Policies </li>
                    <li>Module 2 - Important Dates And Event Protocols</li>
                    <li>Module 3 - Daily Protocols</li>
                    <li>Module 4 - Final Notes</li>
                </ul>
            </div>
        </div>
    );
}