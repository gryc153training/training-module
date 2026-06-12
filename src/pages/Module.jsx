// import {useState, useEffect, useRef} from 'react'
// import { supabase } from '../supabaseClient';
// import  Quizzes  from '../assets/quizzes'
// import { quizData} from '../data/quizData.jsx'
// import { useSearchParams} from 'react-router-dom'

// export default function Module() {
//     const [videos, setVideos] = useState([
//         {
//             id: 1,
//             src: "https://www.dropbox.com/scl/fi/wjs49yyxb2pcmb0sf9uao/Bruno-Mars-I-Just-Might-Official-Music-Video.mp4?rlkey=5lu57mq0dbkq5448uw77y2r1p&e=1&st=i9s0va3b&raw=1",
//             isLocked: false,
//             seconds: 213
//         },
//         {
//             id: 2,
//             src: "https://www.dropbox.com/scl/fi/gj3djpwgtcdd4jj2bqmvt/video2.mp4?rlkey=kpu8v4n7zhx3lshnhxtcbtyb6&st=k3yx2l3t&raw=1",
//             isLocked: true,
//             seconds: 200
//         },
//         {
//             id: 3,
//             src: "https://www.dropbox.com/scl/fi/xcqx824us44uehlv868b7/Bruno-Mars-Risk-It-All-Official-Music-Video.mp4?rlkey=8bh7dzt4e0uehflzmr6wgf9yn&st=k2x0484r&raw=1",
//             isLocked: true,
//             seconds: 210
//         }
//     ])
//     const videoRef = useRef(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [activeModule, setActiveModule] = useState(0);
//     const lastTimeRef = useRef(0);
//     const tables = ['module_1', 'module_2', 'module_3'];//ADD NEW TABLE TO SUPABASE
//     const startedRef = useRef(false);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [volume, setVolume] = useState(1);
//     const [videoEnded, setVideoEnded] = useState(false);
//     const [isQuiz, setIsQuiz] = useState(false);
//     const currentQuiz = quizData[currentIndex];
//     const [progress, setProgress] = useState(0);
//     const [modulePassed, setModulePassed] = useState(false);
//     const [videoCompleted, setVideoCompleted] = useState(false);
//     const startTime = useRef(null)
//     const [watchDuration, setWatchDuration] = useState(0);
//     const [watchedProgress, setWatchedProgress] = useState(0);
//     const [finishedAllModules, setFinishedAllModules] = useState(false);
//     const [isSeeking, setIsSeeking] = useState(false);
//     const [searchParams] = useSearchParams();
//     const moduleId = searchParams.get('id');


//     useEffect(() => {
//         const checkUser = async () => {
//             const {data: { session }} = await supabase.auth.getSession();

//             if (!session) {
//                 window.location.href = '/';
//             }
//         };
//         checkUser();
//     }, []);

//     const [name, setName] = useState('');

//     useEffect(() => {
//         const fetchName = async () => {
//             const {data: {user}} = await supabase.auth.getUser();
//             if(user){
//                 setName(user.user_metadata.display_name);
//             }
//         };
//         fetchName();
//     })

//     const moduleStart = async () => {
//         try{
//             if (startedRef.current){
//                 return;
//             }
//             const {data: {user}} = await supabase.auth.getUser();
//             if(!user) return;
//             startedRef.current = true;
//             for(let i = 0; i < videos.length; i++){
//                 if (currentIndex == i){
//                     let currentModule = '';
//                     currentModule = tables[i];
//                     startTime.current = new Date();
//                     const {error} = await supabase.from(`${currentModule}`).upsert({
//                         user_id: user.id,   
//                         start_time: startTime.current
//                     });
                    
//                     if (error) {
//                         console.error("INSERT ERROR", error); 
//                     } //Also currently get two GET errors when starting video for the first time
//                 }
//             }
//         } catch (err) {
//             console.error("moduleStart crashed:", err);
//         }
//     }

//     const moduleEnd = async () => {
//         try{
//             const {data: {user}} = await supabase.auth.getUser();

//             if (!user){ 
//                 console.log("NO USER"); 
//                 return;
//             }

//             const endTime = new Date();

//             for(let i = 0; i < videos.length; i++){
//                 if(currentIndex == i){
//                     let currentModule = tables[i];
//                     const {error} = await supabase.from(`${currentModule}`).update({
//                         end_time: endTime,
//                         is_completed: true
//                     })
//                     .eq('user_id', user.id);
                   
//                     if(error){
//                         console.error("Supabase update error:", error)
//                     }
//                 }
//             }
//             const timeDiffMs = endTime.getTime() - startTime.current.getTime();    
//             const timeDiffSec = Math.round(timeDiffMs/1000);
//             setWatchDuration(timeDiffSec);
//             startTime.current = null;
//         } catch (err) {
//             console.log("moduleEnd crashed", err);
//         }
        
//     }

//     const moduleJump = (index) => {
//         setIsQuiz(false);
//         setCurrentIndex(index);
//         setActiveModule(index);
//         startedRef.current = false;
//     }

//     const handleTimeUpdate = async () => {
//         const video = videoRef.current;
//         if(!video) return;

//         const currentProgress = (video.currentTime / video.duration)*100
        
//         if (!isSeeking){
//             setProgress(currentProgress);
//         }


//         if(!modulePassed){
//             setWatchedProgress(prev =>
//                 Math.max(prev, currentProgress)
//             )
//         }
//     }

//     // const handleSeeking = async (event) => {
//     //     const video = videoRef.current;
//     //     if(!video) return;
//     //     const newValue = Number(event.target.value);

//     //     const allowedProgress = modulePassed ? newValue : Math.min(newValue, watchedProgress);

//     //     const newTime = (allowedProgress * video.duration) / 100

//     //     video.currentTime = newTime;

//     //     setProgress(allowedProgress);
//     // }

//     const fetchCompleted = async () => {
//         if (watchDuration < videos[currentIndex].seconds){
//             return;
//         }else{
//             const {data: {user}} = await supabase.auth.getUser();
//             if(!user) return;

//             let currentModule = '';
//             currentModule = tables[currentIndex];
//             const {error, data} = await supabase
//                 .from(`${currentModule}`)
//                 .select('is_completed')
//                 .eq('user_id', user.id)
//                 .single();

//             if(error) {
//                 console.error("Error fetching completed: ", error.message);
//                 return;
//             }
//             return data.is_completed;
//         }
//     }

//     const fetchPassed = async () => {
//         const {data: {user}} = await supabase.auth.getUser();
//         if(!user) return;

//         let currentModule = '';
//         currentModule = tables[currentIndex];
//         const {error, data} = await supabase
//             .from(`${currentModule}`)
//             .select('quiz_passed')
//             .eq('user_id', user.id)
//             .single();

//         if(error) {
//             console.error("Error fetching passed: ", error.message);
//             return;
//         }

//         if(data.quiz_passed) {
//             setModulePassed(true);
//         }else{
//             setModulePassed(false);
//         }
//         return data.quiz_passed;
//     }

//     const nextVideo = async () => {
//         const passed = await fetchPassed();
//         if(!isQuiz && videoCompleted){
//             if(passed){
//                 goToNextVideo();
//                 return;
//             } else {
//                 const completed = await fetchCompleted();
//                 if(!completed){
//                     setIsQuiz(false);
//                     alert("You need to watch the complete video in order to advance.")
//                     return;
//                 } else {
//                     setIsQuiz(true);
//                 }
//             }
//         } else {
//             if (passed) {
//                 goToNextVideo();
//             } 
//         }
//     }

//     const goToNextVideo = () => {
//         if (currentIndex < videos.length-1){
//             const next = currentIndex + 1;
//             setVideos(prevVideos => prevVideos.map((video, i) => 
//             i === next 
//                 ? {...video, isLocked: false}
//                 : video
//             ));
//             setModulePassed(false);
//             setProgress(0);
//             setVideoCompleted(false);
//             setVideoEnded(false);
//             lastTimeRef.current=0;
//             setCurrentIndex(next);
//             setActiveModule(next);
//             startedRef.current = false;
//             setIsQuiz(false);
//         } else {
//             setIsQuiz(true);
//             setFinishedAllModules(true);
//             // alert("Module Completed! Returning to Dashboard.");
//             // window.location.href = "/dashboard";
//             // setIsQuiz(false)
//         }
//     }
        
    
    
//     const playVideo = () => {
//         videoRef.current?.play();
//         setIsPlaying(true);
//     }

//     const pauseVideo = () => {
//         videoRef.current?.pause();
//         setIsPlaying(false);
//     }

//     const lookForProgress = async () => {
//         const {data: {user}} = await supabase.auth.getUser();

//         const updatedVideos = [...videos];

//         if (!user) return;

//         for(let i = 0; i < videos.length; i++){
//             let currentModule = '';
//             currentModule = tables[i];
//             const {data, error} = await supabase
//             .from(`${currentModule}`)
//             .select('quiz_passed') 
//             .eq('user_id', user.id)
//             .maybeSingle();
//             if(data?.quiz_passed && i + 1 < updatedVideos.length){
//                 updatedVideos[i+1] = {
//                     ...updatedVideos[i+1],
//                     isLocked: false
//                 }
//             }
//         }// If first time watching video, it looks for quiz_passed but there is none because it hadn't been created yet. So a GET error is produced. Could fix maybe? Like Try and Catch statement
        
//         setVideos(updatedVideos);
//     }

//     // MODULE TO-DO LIST:
//     // 1. I DONT LIKE HOW VIDEO STARTS SMALL AND THEN GROWS (NOT A PRIORITY BUT DEF WANT TO SOMEHOW FIX) (somehow I fixed it! Could come back again)✅
//     // 2. STILL NEED TO FIX SIDEBAR (Fixed for now need to comeback and style maybe (CHANGE FONT STYLE INSIDE SIDEBAR))✅
//     // 3. THE SIZE OF THE VIDEO PLAYER AND ITS DIMENSIONS MIGHT HAVE BEEN MESSED UP BY ADDING THE SIDEBAR (same as #1)✅
//     // 4. small fix have module highlighted in sidebar when on that module (Holy Frick this was so hard that I literally had to change the entire code WTH)✅
//     // 5. Continue Button not showing up after video finishes (onVideoEnded is not triggering and I HAVE NO IDEA WHYYYYYY)✅ FINALLLLYYYY!!!!!!
//     // 6. IMPLEMENT QUIZZES ✅ AND CONNECT LOGIC TO NEXT STEP (INCLUDING SUPABASE QUIZ DATA i.e. PASSING QUIZES AND SCORES AND ATTEMPTS?)✅
//     // 7. ADD THE LOCKING MODULES LOGIC (UNACCESSABLE IF NOT WATCHED AND COMPLETED PREVIOUS MODULE)✅
//     // 8. ADD THE UNLOCKING MODULE LOGIC (INCLUDING BEING ABLE TO REWATCH MODULES AND BEING ABLE TO TIMESKIP MODULES)✅
//     // 9. SWITCHING MODULES MID VIDEO DOES NOT RESTART THE VIDEO AND PICKS UP WHERE WE LEFT OFF BUT MAYBE WE WANT THIS??? (Now it does restart the video)✅
//     // 10. IF BYPASSED MAKE THE CONTINUE BUTTON NOT SHOW UP AND HAVE THEM REWATCH VIDEO IN ENTIRETY (USING START AND END TIMES MAYBE? OR A TIMER? WE'LL SEE)✅
//     // 11. SUPABASE MAY BE UPDATNG START TIME AND END TIME WHEN FINISHING THE VIDEO FOR A SECOND TIME (DONT WANT THIS TO HAPPEN) (MAYBE DONT WANT THIS NOT SURE)
//     // 12. CONTINUE BUTTON IS CURRENTLY NOT CENTERED (STYLES ISSUE SAVE FOR THE END BECAUSE THINGS ARE WORKING AND THATS ALL THAT MATTERS)
//     // 13. Progress Bar Glitches out when change volume and pausing and playing(basically interacting with anything)✅
//     // 14. Progress Bar Glitches when trying to time skip (NOT IMPORTANT BUT WOULD BE NICE)✅
//     // 15. After failing quiz, continue button appears briefly allowing user to click and retry quiz without watching the video again.✅
//     // 16. When rewatching video and finish and click continue button, dont want them to retake quiz rather display message saying quiz passed? or just disable submit button along with small message?✅
//     // 17. WHEN PASSING ALL QUIZZES AND SUCCESSFULLY WATCHING ALL VIDEOS WE NEED A CONGRATULATIONS OR CERTIFICATE SCREEN/ALERT (SOMETHING TO NOTIFY FINISHED)!!!! ✅
//     // 18. Fix resizing issues. (Kinda want the video to shrink or idek just fix it somehow)
//     // 19. Check for bug when passing quiz for first time and being able to time skip next video right away

//     const handleVolumeChange = (e) => {
//         const newVolume = parseFloat(e.target.value);
//         setVolume(newVolume);

//         if (videoRef.current) {
//             videoRef.current.volume = newVolume;
//         }
//     }

//     function handleFailQuiz() {
//         alert('You Did Not Pass The Quiz. Please Rewatch The Module And Try Again.') //We could make our own alert system rather than use browser's default alerts, would be more professional
//         setIsQuiz(false);
//         setVideoCompleted(false);
//     }

//     const handlePassQuiz = async () => {
//         const {data: {user}} = await supabase.auth.getUser();
        
//         let currentModule = '';
//         currentModule = tables[currentIndex];
//         await supabase.from(`${currentModule}`).update(
//             {quiz_passed: true}
//         )
//         .eq('user_id', user.id);

//         nextVideo();
//     }

//     const handleSeekPreview = (e) => {
//         const newValue = Number(event.target.value);
//         const allowedProgress = modulePassed ? newValue : Math.min(newValue, watchedProgress)
//         setProgress(allowedProgress);
//     }

//     const handleSeekCommit = (e) => {
//         const video = videoRef.current;
//         if(!video) return;

//         const newValue = Number(e.target.value);

//         video.currentTime = (newValue * video.duration)/100;

//         setIsSeeking(false);
//     }

//     useEffect(() => {
//         lookForProgress();
//     }, []);

//     useEffect(() => {
//         setVideoEnded(false);
//         startedRef.current = false;
//     }, [currentIndex]);

//     useEffect(() => {
//         fetchPassed();
//     }, [currentIndex]);

//     useEffect(() => {
//         if(moduleId){
//             setCurrentIndex(moduleId);
//         }
//     }, [moduleId])

//     return (
//         <main>
//             <div className="content">
//                 <div className="sidebar">
//                     <div id="sidebar-header">

//                     </div>
//                     <div id="module-list">
//                         {videos.map((vid, i) => (
//                             <button
//                                 key={vid.id}
//                                 className={`module-button ${activeModule === i ? 'active' : ''}`}
//                                 onClick={() => moduleJump(i)}
//                                 disabled = {vid.isLocked}
//                             >
//                                 Module {i + 1} 
//                                 {vid.isLocked && (<img id = "lock" src ="src\assets\lock.png" alt = "locked"></img>)}
//                                 {/* maybe change lock icon?? */}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 {!isQuiz ?
//                 (<div>
//                     <div className="video-screen">
//                         <video
//                             ref={videoRef}
//                             key={currentIndex}
//                             className="video"
//                             onPlay={() => {
//                                 setIsPlaying(true);
//                                 setVideoEnded(false);
//                                 moduleStart();
//                             }}
//                             onPause={()=> setIsPlaying(false)}
//                             onEnded={()=> {
//                                 setIsPlaying(false);
//                                 setVideoEnded(true);
//                                 moduleEnd();
//                                 setVideoCompleted(true);
//                             }}
//                             onTimeUpdate={handleTimeUpdate}
//                             autoPlay
//                         >
//                             <source src={videos[currentIndex].src} type="video/mp4"/>
//                         </video>
//                         <div className="controls-container">
//                             <div className="progress-container">
//                                 <input 
//                                     type="range" 
//                                     id="progress-bar" 
//                                     min="0" 
//                                     max="100" 
//                                     step = "0.1" 
//                                     value={progress} 
//                                     style={{
//                                         background: `linear-gradient(
//                                         to right,
//                                         #1a73e8 0%,
//                                         #1a73e8 ${progress}%,
//                                         #d3d3d3 ${progress}%,
//                                         #d3d3d3 100%
//                                         )`
//                                     }}
//                                     onMouseUp={modulePassed ? handleSeekCommit : undefined}
//                                     onChange={modulePassed ? handleSeekPreview : undefined} 
//                                     readOnly={!modulePassed} 
//                                     onMouseDown={modulePassed ? () => setIsSeeking(true) : (e) => e.preventDefault()} 
//                                     // onTouchStart={modulePassed ? setIsSeeking(true) : (e) => e.preventDefault()}
//                                 />
//                             </div>
//                             <div className="buttons-container">
//                                 {isPlaying ? (
//                                     <button id="pause" onClick={pauseVideo}><img src="src\assets\pause-512.png" alt="Pause" width="70%" height="70%" /></button>
//                                 ): (
//                                     <button id="play" onClick={playVideo}><img src="src\assets\play-512.png" alt="Play" width="70%" height="70%" /></button>
//                                 )}
//                                 <img id="volume-icon" src={volume === 0 ? 
//                                     'src/assets/mute-2-512.png' : "src/assets/volume-up-4-512.png"} alt="Volume" width="70%" height="70%" />
//                                 <input 
//                                     type="range" 
//                                     id="volume-slider" 
//                                     min="0" 
//                                     max="1" 
//                                     step="0.01" 
//                                     value={volume} 
//                                     onChange={handleVolumeChange}
//                                     style={{
//                                         background: `linear-gradient(
//                                         to right,
//                                         #1a73e8 0%,
//                                         #1a73e8 ${volume * 100}%,
//                                         #d3d3d3 ${volume * 100}%,
//                                         #d3d3d3 100%
//                                     )`
//                                 }} />
//                             </div>
//                         </div>
//                     </div>
//                         {videoEnded && (<button className="continue-btn" onClick={nextVideo}> Continue </button>)}
//                 </div>) 
//                 :
//                 !finishedAllModules ? 
//                 (<div className = "quiz">
//                     <Quizzes quiz = {currentQuiz} onPassQuiz={handlePassQuiz} onFailQuiz={handleFailQuiz}/>
//                 </div>)
//                 :
//                 (<div className='certificate-container'>
//                     <div className="certificate">
//                         <div className="certificate-header">
//                             Certificate of Completion                    
//                         </div>
//                         <p className='completion-text'> Awarded to</p>
//                         <h1 className='user-name'>{name}</h1>
//                         <p className='completion-text'>
//                             For successfully completing the PS 153 GRYC
//                         </p>
//                         <h1>Summer Training Program</h1>
//                         <div className = 'certificate-seal'>
//                             ✓ COMPLETED
//                         </div>
//                         <p className = 'date'>
//                             {/* DONT WANT DATE ON CERTIFICATE TO CHANGE EVERYTIME! WANT TO KEEP DATE OF FIRST APPEARANCE!! IMPORTANT!!*/}
//                             {new Date().toLocaleDateString()}
//                         </p>
//                     </div>
//                     <button onClick={()=>window.print()}>Print</button> 
//                     {/* COMPLETELY OPTIONAL!! IF DOING IT THO FIX AND ADD ICON AND MAKE IT BELOW CERTIFICATE (ALSO MAYBE SAVE AS PDF BUTTON BUT MORE COMPLICATED) */}
//                 </div>
                
//                     )
//                 }
//             </div>
//         </main>
//         // add a footer maybe??
//     );
// }

    import {useState, useEffect, useRef} from 'react'
    import { supabase } from '../supabaseClient';
    import  Quizzes  from '../assets/quizzes'
    import { quizData} from '../data/quizData.jsx'




    export default function Module() {
    const videos = [
        {
            id: 1,
            title: "GRYC Policies",
            subModules:
            [
                {
                    id: "1a",
                    title: "Introduction",
                    src: "https://www.dropbox.com/scl/fi/cmqhdhtulghmeoo403589/Summer-Rising-Orientation-Presentation.mp4?rlkey=d2399bo1i3gspqs1m795laxre&st=rx1xqz5y&raw=1",               
                    isLocked: false,
                    //   seconds: 213
                },
                {
                    id: "1b",
                    title: "Vision and Mission",
                    src: "https://www.dropbox.com/scl/fi/r41zlrt0q4z3kfu5069tz/Summer-Rising-Vision-and-Mission.mp4?rlkey=0zxfg6abuts85314s78hpjl23&st=5tolekjx&raw=1",
                    isLocked: true,
                    //   seconds: 180
                },
                {
                    id: "1c",
                    title: "Policies and Safety Protocols",
                    src: "https://www.dropbox.com/scl/fi/feax89jh0ux8mw4sg1x75/GRYC-Policies.mp4?rlkey=mncr62xuwv6deo18h0hcfabtc&st=c8ube5xa&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "1d",
                    title: "Policies and Expectations",
                    src: "https://www.dropbox.com/scl/fi/bv55x90qiaxhypzk42zzd/Policies-and-Expectations.mp4?rlkey=ti1ppz1snxoquxseia06ye3ak&st=nbbvt94a&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "1e",
                    title: "Safety Protocols",
                    src: "https://www.dropbox.com/scl/fi/ysolgpg4exqns79ljbtfd/Safety-Procedures.mp4?rlkey=detpy5twt4iaj8njgaiqt1kpu&st=0qblj0m7&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "1f",
                    title: "Medical Incident Reporting",
                    src: "https://www.dropbox.com/scl/fi/fju5iyn80s1vjzoxl5zey/Medical-and-Incident-Reporting.mp4?rlkey=z71fbp91cbtctp93qqs267f5z&st=hth67cf2&raw=1",
                    isLocked: true,
                    //   seconds: 240
                    // FIX IN DROPBOX TRIM IT
                },
                {
                    id: "1g",
                    title: "Drills 1",
                    src: "https://www.dropbox.com/scl/fi/bcboyuiop82uvt57uenma/Drills.mp4?rlkey=q5uc7b53rf8z2joe0gbcpfqwq&st=eqx70qpi&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "1h",
                    title: "Drills 2",
                    src: "https://www.dropbox.com/scl/fi/4ilp5x0kcqe7oxc0njolr/Drills-2.mp4?rlkey=qanlzyv8gs8z8iglmlgdcr60x&st=lvhv2fsw&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
            ]
        },
        {
            id: 2,
            title: "Important Dates and Event Protocols",
            subModules:
            [
                {
                    id: "2a",
                    title: "Introduction",
                    src: "https://www.dropbox.com/scl/fi/26cis4klqnj2qc6pon4sp/Important-Dates-and-Events-Protocols.mp4?rlkey=aocch3qwi7dd54mimljh2niif&st=ozltq281&raw=1",               
                    isLocked: true,
                    //   seconds: 213
                },
                {
                    id: "2b",
                    title: "July 2026",
                    src: "https://www.dropbox.com/scl/fi/iju44w15vgjsx8rwde6t0/July-2026.mp4?rlkey=0ulgemxmll1tez8xvmdrtgoqb&st=u696zzq3&raw=1",
                    isLocked: true,
                    //   seconds: 180
                },
                {
                    id: "2c",
                    title: "August 2026",
                    src: "https://www.dropbox.com/scl/fi/f4e6ogzvhgtb9vbqfyzs6/August-2026.mp4?rlkey=5i10mzttch5c3d4k12wgit645&st=co8tacsi&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "2d",
                    title: "Water Slide Days",
                    src: "https://www.dropbox.com/scl/fi/k4gwcj7rhwky3092vtr1c/Water-Slide-Days.mp4?rlkey=qlt1gz6el711fe7ynhz8wn31a&st=fh3uhhnv&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "2e",
                    title: "Trip Days",
                    src: "https://www.dropbox.com/scl/fi/3bs87zlk3mksj41kes428/Trip-Day-Expectations.mp4?rlkey=l4f9so2lf63bdzurjul18lm50&st=zjr93w3e&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "2f",
                    title: "Dates and Events",
                    src: "https://www.dropbox.com/scl/fi/bnpkd37ik3r8zfhucb4le/Important-Dates-and-Events.mp4?rlkey=th1umg6m5hq98mnvrer7wz4sj&st=63cadaux&raw=1",
                    isLocked: true,
                    //   seconds: 240
                }
            ]
        },
        {
            id: 3,
            title: "Daily Protocols",
            subModules:
            [
                {
                    id: "3a",
                    title: "Introduction",
                    src: "https://www.dropbox.com/scl/fi/uap2m2n3rglru89facpny/Daily-Protocols.mp4?rlkey=1wk1n5dv3f9olis8cs9cvlvwu&st=38wnbayj&raw=1",               
                    isLocked: true,
                    //   seconds: 213
                },
                {
                    id: "3b",
                    title: "Daily Expectations 1",
                    src: "https://www.dropbox.com/scl/fi/l1a98lh80541jntwrx5j4/Daily-Expecations.mp4?rlkey=8hcb3s4i2a6b1zkkfbtgw9af7&st=vjxgorcp&raw=1",
                    isLocked: true,
                    //   seconds: 180
                },
                {
                    id: "3c",
                    title: "Daily Expectations 2",
                    src: "https://www.dropbox.com/scl/fi/f9tkh6enrer854hyo60rm/Daily-Expecations-2.mp4?rlkey=w9i38sg9sud9ltoq2df9ytmfk&st=nh6nn2ce&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "3d",
                    title: "Daily Expectations 3",
                    src: "https://www.dropbox.com/scl/fi/2cex3mmr2cqedfi0osbgy/Daily-Expecations-3.mp4?rlkey=pzfolho5urz9srr75bezpgth6&st=8s92qqnd&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
                {
                    id: "3e",
                    title: "SYEP",
                    src: "https://www.dropbox.com/scl/fi/havgp0as5a5hqx3s40eeq/SYEP.mp4?rlkey=kizo80kurom6qunl7ymw6hcb5&st=sr3v8wlr&raw=1",
                    isLocked: true,
                    //   seconds: 240
                },
            ]
        },
        {
            id: 4,
            title: "Final Notes",
            subModules:
            [
                {
                    id: "4a",
                    title: "Senior Staff",
                    src: "https://www.dropbox.com/scl/fi/gwnzyo69mnsosa8h5hbw5/Senior-Staff.mp4?rlkey=5y1nca16dy7ghmzcagaybf989&st=q72p1nrs&raw=1",               
                    isLocked: true,
                    //   seconds: 213
                },
                {
                    id: "4b",
                    title: "Closing Remarks",
                    src: "https://www.dropbox.com/scl/fi/fnjry09gtbyinuaz3mped/Closing-Remarks.mp4?rlkey=c44j90dw05232lljjrjd4co3t&st=qrx82e2l&raw=1",
                    isLocked: true,
                    //   seconds: 180
                },
                {
                    id: "4c",
                    title: "Congratulations!",
                    src: "https://www.dropbox.com/scl/fi/2ylstemqk32w2vypbie9j/Congratulation.mp4?rlkey=btqp80ez54rr53hgze8f9fhsc&st=fl6ro05b&raw=1",
                    isLocked: true,
                    //   seconds: 240
                }
            ]
        }
    ]
    const [videoData, setVideoData] = useState(videos);
    const videoRef = useRef(null);
    const [currentModule, setCurrentModule] = useState(0);
    const [currentSubmodule, setCurrentSubmodule] = useState(0);   
    const currentVideo = videoData[currentModule].subModules[currentSubmodule];
    const [activeModule, setActiveModule] = useState(0);
    const lastTimeRef = useRef(0);
    const tables = ['module_1', 'module_2', 'module_3', 'module_4'];
    const startedRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [videoEnded, setVideoEnded] = useState(false);
    const [isQuiz, setIsQuiz] = useState(false);
    const currentQuiz = quizData[currentModule];
    const [progress, setProgress] = useState(0);
    const [modulePassed, setModulePassed] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const startTime = useRef(null)
    const [watchDuration, setWatchDuration] = useState(0);
    const [watchedProgress, setWatchedProgress] = useState(0);
    const [finishedAllModules, setFinishedAllModules] = useState(false);
    const [grycPolicyShow, setgrycPolicyShow] = useState(false);
    const [reportFormsShow, setReportFormsShow] = useState(false);
    const [currentModuleFinished, setCurrentModuleFinished] = useState(false);


    useEffect(() => {
        const checkUser = async () => {
            const {data: { session }} = await supabase.auth.getSession();


            if (!session) {
                window.location.href = '/';
            }
        };
        checkUser();
    }, []);


    const [name, setName] = useState('');


    useEffect(() => {
        const fetchName = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if(user){
                setName(user.user_metadata.display_name);
            }
        };
        fetchName();
    })


    const moduleStart = async () => {
        try{
            // if (startedRef.current){
            //     return;
            // }
            //IDK ANYMORE IF NEEDED WORKS WITHOUT IT DONT REMEMBER WHAT IT EVEN HELPED WITH
            const {data: {user}} = await supabase.auth.getUser();
            if(!user) return;
            startedRef.current = true;
            for(let i = 0; i <= videos.length; i++){
                if (currentModule == i){
                    let nowModule = tables[i];
                    startTime.current = new Date();
                    const dynamicColumnName1 = `start_time_module_${currentModule+1}` + `${String.fromCharCode(currentSubmodule+97)}`
                    const {error} = await supabase.from(`${nowModule}`).upsert({
                        user_id: user.id,  
                        [dynamicColumnName1]: startTime.current,
                    });
                    
                    if (error) {
                        console.error("INSERT ERROR", error);
                    } //Also currently get two GET errors when starting video for the first time
                }
            }
        } catch (err) {
            console.error("moduleStart crashed:", err);
        }
    }


    const moduleEnd = async () => {
        try{
            const {data: {user}} = await supabase.auth.getUser();


            if (!user){
                console.log("NO USER");
                return;
            }


            const endTime = new Date();


            for(let i = 0; i < videos.length; i++){
                if(currentModule == i){
                    let nowModule = tables[i];
                    const dynamicColumnName1 = `end_time_module_${currentModule+1}` + `${String.fromCharCode(currentSubmodule+97)}`
                    const dynamicColumnName2 = `is_completed_module_${currentModule+1}` + `${String.fromCharCode(currentSubmodule+97)}`
                    const {error} = await supabase.from(`${nowModule}`).update({
                        [dynamicColumnName1]: endTime,
                        [dynamicColumnName2]: true
                    })
                    .eq('user_id', user.id)

                    if(error){
                        console.error("Supabase update error:", error)
                    }
                }
            }
            const timeDiffMs = endTime.getTime() - startTime.current.getTime();   
            const timeDiffSec = Math.round(timeDiffMs/1000);
            setWatchDuration(timeDiffSec);
            startTime.current = null;
        } catch (err) {
            console.log("moduleEnd crashed", err);
        }
        
    }


    const moduleJump = (index, subIndex) => {
        setIsQuiz(false);
        setCurrentModule(index);
        setCurrentSubmodule(subIndex);
        startedRef.current = false;
    }


    const handleTimeUpdate = async () => {
        const video = videoRef.current;
        if(!video) return;


        const currentProgress = (video.currentTime / video.duration)*100
        
        if (video && video.duration){
            setProgress(currentProgress);
        }




        if(!modulePassed){
            setWatchedProgress(prev =>
                Math.max(prev, currentProgress)
            )
        }
    }


    const handleSeeking = async (event) => {
        const video = videoRef.current;
        if(!video) return;
        const newValue = Number(event.target.value);


        const allowedProgress = modulePassed ? newValue : Math.min(newValue, watchedProgress);


        const newTime = (allowedProgress * video.duration) / 100


        video.currentTime = newTime;


        setProgress(allowedProgress);
    }


    const fetchCompleted = async () => {
        // if (watchDuration < currentVideo.seconds){
        //     return;
        // }else{
            const {data: {user}} = await supabase.auth.getUser();
            if(!user) return;


            let nowModule = tables[currentModule];
            const dynamicColumnName1 = `is_completed_module_${currentModule+1}` + `${String.fromCharCode(currentSubmodule+97)}`

            const {error, data} = await supabase
                .from(`${nowModule}`)
                .select(`${dynamicColumnName1}`)
                .eq('user_id', user.id)
                .single();


            if(error) {
                console.error("Error fetching completed: ", error.message);
                return;
            }
            return data[dynamicColumnName1];
        
    }


    const fetchPassed = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if(!user) return;

        const dynamicColumnName1 = `module_${currentModule+1}_passed`


        let nowModule = tables[currentModule];
        const {error, data} = await supabase
            .from(`quizzes`)
            .select(dynamicColumnName1) //CHANGED THIS FROM * TO THIS CHECK IF STILL WORKING 
            .eq('user_id', user.id)
            .maybeSingle();

        if(error) {
            console.error("Error fetching completed: ", error.message);
            return;
        }

        if(data[dynamicColumnName1]) {
            setModulePassed(true);
        }else{
            setModulePassed(false);
        }
        return data[dynamicColumnName1];
    }


    const nextVideo = async () => {
        const passed = await fetchPassed();
        const completed = await fetchCompleted();
        if(!isQuiz && videoCompleted && (currentSubmodule < videoData[currentModule].subModules.length - 1)){
           if (completed){
                goToNextSubModule();
            }else{
                setIsQuiz(false);
                alert("You need to watch the complete video in order to advance.")
                return;
            }
        } else {
            if (passed && currentSubmodule == videoData[currentModule].subModules.length-1){
                goToNextModule();
                return;
            }
            if(currentModule === 3){
                setIsQuiz(true);
                setFinishedAllModules(true);
            } else {
                setIsQuiz(true);
            }
        }
    }

    const goToNextSubModule = () => {
        setCurrentSubmodule(prev => prev + 1);
        setVideoData(prev =>
            prev.map((module, moduleIndex) => {
                if (moduleIndex !== currentModule) {
                    return module;
                }

                return {
                    ...module,
                    subModules: module.subModules.map((sub, subIndex) => ({
                    ...sub,
                    isLocked:
                    subIndex === currentSubmodule + 1
                    ? false
                    : sub.isLocked
                }))
            };
        }));
        setProgress(0);
        setVideoCompleted(false);
        setVideoEnded(false);
        lastTimeRef.current=0;
        startedRef.current = false;
    }

    const goToNextModule = () => {
        const nextModule = currentModule + 1;
        
        setVideoData(prev =>
            prev.map((module, moduleIndex) => {
                if (moduleIndex !== nextModule) {
                    return module;
                }

                return {
                    ...module,
                    subModules: module.subModules.map((sub, subIndex) => ({
                        ...sub,
                        isLocked: subIndex === 0 ? false : sub.isLocked
                }))
            };
        }));
        setCurrentModule(prev => prev + 1)
        setCurrentSubmodule(0);
    }
        
    
    
    const playVideo = () => {
        videoRef.current?.play();
        setIsPlaying(true);
    }


    const pauseVideo = () => {
        videoRef.current?.pause();
        setIsPlaying(false);
    }


    const lookForProgress = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if (!user) return;

        const updatedVideos = structuredClone(videos);

        for(let i = 0; i < updatedVideos.length; i++){
            let nowModule = tables[i];
            for(let subIndex = 0; subIndex < updatedVideos[i].subModules.length; subIndex++){
                const column =`is_completed_module_${i + 1}` + String.fromCharCode(97 + subIndex);
                const {data, error} = await supabase
                    .from(`${nowModule}`)
                    .select(column)
                    .eq('user_id', user.id)
                    .maybeSingle();

                if(data?.[column]){
                    updatedVideos[i].subModules[subIndex].isLocked = false;
                    if(subIndex < updatedVideos[i].subModules.length - 1){
                        updatedVideos[i].subModules[subIndex + 1].isLocked = false;
                    }
                }
            }
        }
        setVideoData(updatedVideos);
    }


    // MODULE TO-DO LIST:
    // 1. I DONT LIKE HOW VIDEO STARTS SMALL AND THEN GROWS (NOT A PRIORITY BUT DEF WANT TO SOMEHOW FIX) (somehow I fixed it! Could come back again)✅
    // 2. STILL NEED TO FIX SIDEBAR (Fixed for now need to comeback and style maybe (CHANGE FONT STYLE INSIDE SIDEBAR))✅
    // 3. THE SIZE OF THE VIDEO PLAYER AND ITS DIMENSIONS MIGHT HAVE BEEN MESSED UP BY ADDING THE SIDEBAR (same as #1)✅
    // 4. small fix have module highlighted in sidebar when on that module (Holy Frick this was so hard that I literally had to change the entire code WTH)✅
    // 5. Continue Button not showing up after video finishes (onVideoEnded is not triggering and I HAVE NO IDEA WHYYYYYY)✅ FINALLLLYYYY!!!!!!
    // 6. IMPLEMENT QUIZZES ✅ AND CONNECT LOGIC TO NEXT STEP (INCLUDING SUPABASE QUIZ DATA i.e. PASSING QUIZES AND SCORES AND ATTEMPTS?)✅
    // 7. ADD THE LOCKING MODULES LOGIC (UNACCESSABLE IF NOT WATCHED AND COMPLETED PREVIOUS MODULE)✅
    // 8. ADD THE UNLOCKING MODULE LOGIC (INCLUDING BEING ABLE TO REWATCH MODULES AND BEING ABLE TO TIMESKIP MODULES)✅
    // 9. SWITCHING MODULES MID VIDEO DOES NOT RESTART THE VIDEO AND PICKS UP WHERE WE LEFT OFF BUT MAYBE WE WANT THIS??? (Now it does restart the video)✅
    // 10. IF BYPASSED MAKE THE CONTINUE BUTTON NOT SHOW UP AND HAVE THEM REWATCH VIDEO IN ENTIRETY (USING START AND END TIMES MAYBE? OR A TIMER? WE'LL SEE)✅
    // 11. SUPABASE MAY BE UPDATNG START TIME AND END TIME WHEN FINISHING THE VIDEO FOR A SECOND TIME (DONT WANT THIS TO HAPPEN) (MAYBE DONT WANT THIS NOT SURE)
    // 12. CONTINUE BUTTON IS CURRENTLY NOT CENTERED (STYLES ISSUE SAVE FOR THE END BECAUSE THINGS ARE WORKING AND THATS ALL THAT MATTERS)✅
    // 13. Progress Bar Glitches out when change volume and pausing and playing(basically interacting with anything)✅
    // 14. Progress Bar Glitches when trying to time skip (NOT IMPORTANT BUT WOULD BE NICE)✅
    // 15. After failing quiz, continue button appears briefly allowing user to click and retry quiz without watching the video again.✅
    // 16. When rewatching video and finish and click continue button, dont want them to retake quiz rather display message saying quiz passed? or just disable submit button along with small message?✅
    // 17. WHEN PASSING ALL QUIZZES AND SUCCESSFULLY WATCHING ALL VIDEOS WE NEED A CONGRATULATIONS OR CERTIFICATE SCREEN/ALERT (SOMETHING TO NOTIFY FINISHED)!!!! ✅
    // 18. Fix resizing issues. (Kinda want the video to shrink or idek just fix it somehow)

    //UPDATED TO-DO LIST:
    // 1. FIX CONTINUE BUTTON ✅
    // 2. FIX SUPABASE ✅
    // 3. FIX QUIZZES ✅
    // 4. FIX MODULE(SEEKING DOESNT WORK WANT IT SO THAT AFTER PASSING MODULE ALL SUBMODULES ARE SEEKABLE ✅, IF QUIZ ALREADY PASSED SHOULD NOT SHOW UP OR ALLOW THEM TO SUBMIT WE ALREADY DID THIS BUT NEED TO REIMPLEMENT✅)
    // 4a. small bug where passing quiz unlocks next module 1st sub but if leaving before completing stays locked but should stay unlocked because already unlocked that module. (tinker)
    // 5. FIX STYLES (SIDEBAR DOESNT GO ALL THE WAY DOWN, WHEN QUIZ APPEARS HAVE TO SCROLL (WANT IT SO THAT QUIZ GOES UP AS YOU SCROLL NOT JUSTS SCROLL DOWN THE PAGE))✅
    // 6. FIX HELP (FAQ?? ADD LIKE 'if any questions or concerns please contact email')✅
    // 7. FIX DASHBOARD (IF UNABLE TO DO IT IN TIME JUST MAKE PLAIN AND SIMPLE DASHBOARD)✅
    // 8  FIX CERTIFICATE MAKE IT NICE (MAYBE GO TO HER CANVA AND COPY STYLE DOWNLOAD AND JUST PASTE IDK)✅
    // 9. Check COMMENTS make sure everything is done
    // 10. Check Supabase (change name of email address for email confirmation to gryc_training_program@gmail.com and name of account) ✅
    // 11. Check for bugs and glitches (maybe tinker with phone also has to do with styles probably)
    // 12. Push to Github (Make new account)


    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);


        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    }


    const handleFailQuiz = async () => {
        setIsQuiz(false);
        setVideoCompleted(false);
        const {data: {user}} = await supabase.auth.getUser();
        if (!user) return;

        const moduleIndex = currentModule;
        const table = tables[moduleIndex];

        const updatedVideos = structuredClone(videoData);

        for(let subIndex = 0; subIndex < updatedVideos[moduleIndex].subModules.length; subIndex++){
            const column =`is_completed_module_${moduleIndex + 1}` + String.fromCharCode(97 + subIndex);
            const {error} = await supabase.from(`${table}`).update({
                    [column]: false
                    })
                .eq('user_id', user.id);
                updatedVideos[moduleIndex].subModules[subIndex].isLocked = subIndex !== 0;
            }
        setCurrentSubmodule(0);
        setVideoData(updatedVideos);

    }

    const handlePassQuiz = async () => {
        if (currentModule < videos.length - 1) {
            
            const {data: {user}} = await supabase.auth.getUser();
            if (!user) return;

            const dynamicNameColumn = `module_${currentModule + 1}_passed`

            const {error} = await supabase.from(`quizzes`).update({
                [dynamicNameColumn]: true
                })
            .eq('user_id', user.id);
            
            setIsQuiz(false);
            goToNextModule();
        }
    };


    const goToPolicy = () => {
            window.open(
                'https://canva.link/yxtrjkvzy02hc9t',
                '_blank' 
                );   
        
    }


    const goToMedical = () => {
        window.open(
            'https://canva.link/02h6r4e8o6jnheg',
            '_blank' 
        );   
    }


    const goToBehavioral = () => {
        window.open(
            'https://canva.link/q2xsx8lwoav71sx',
            '_blank' 
        );   
    }


    useEffect(() => {
        lookForProgress();
    }, []);


    useEffect(() => {
        if(videoData[currentModule].subModules[currentSubmodule].id === '1d'){
           setgrycPolicyShow(true);
           setReportFormsShow(false);
        }else if(videoData[currentModule].subModules[currentSubmodule].id === '1f'){
            setgrycPolicyShow(false);
            setReportFormsShow(true);
        }else {
            setgrycPolicyShow(false);
            setReportFormsShow(false);
        }
       setVideoEnded(false);
       startedRef.current = false;
    }, [currentSubmodule]);


    useEffect(() => {
       fetchPassed();
    }, [currentModule]);


    return (
        <main>
            <div className="content">
                <div className="sidebar">
                    <div id="sidebar-header">


                    </div>
                    <div id="module-list">
                        <p className='notify-quiz'>(There will be a quiz at the end of each module.) </p>
                        {videoData.map((module, moduleIndex) => (
                            <div key={module.id}>


                                <h3>{module.title}</h3>


                                {module.subModules.map((sub, subIndex) => (
                                    <button
                                        key={sub.id}
                                        className={`module-button ${currentModule === moduleIndex &&
                                            currentSubmodule === subIndex ? 'active' : ''}`}
                                        onClick={() => {
                                            moduleJump(moduleIndex, subIndex)

                                        }}
                                        disabled = {sub.isLocked}
                                    >
                                        {sub.title}
                                        {sub.isLocked && (<img id = "lock" src ="src\assets\lock.png" alt = "locked"></img>)}
                                    </button>
                                    
                                    ))}
                            </div>
                            


                        ))}
                    </div>
                </div>
                {!isQuiz ?
                (<div className='video-wrapper'>
                    <div className="video-screen">
                        <video
                            ref={videoRef}
                            key={`${currentModule}-${currentSubmodule}`}
                            className="video"
                            onPlay={() => {
                                setIsPlaying(true);
                                setVideoEnded(false);
                                moduleStart();
                            }}
                            onPause={()=> setIsPlaying(false)}
                            onEnded={()=> {
                                setIsPlaying(false);
                                setVideoEnded(true);
                                moduleEnd();
                                setVideoCompleted(true);
                            }}
                            onTimeUpdate={handleTimeUpdate}
                            autoPlay
                        >  
                            <source src={currentVideo.src} type="video/mp4"/>
                        </video>
                        {grycPolicyShow ? <div className='gryc-policy' onClick = {goToPolicy}></div>: null}
                        {reportFormsShow ? <div className='medical' onClick={goToMedical}></div>: null}
                        {reportFormsShow ? <div className='behavioral' onClick={goToBehavioral}></div>: null}
                        <div className="controls-container">
                            <div className="progress-container">
                                <input
                                    type="range"
                                    id="progress-bar"
                                    min="0" max="100"
                                    step = "0.1"
                                    value={progress}
                                    style={{
                                        background: `linear-gradient(
                                        to right,
                                        #1a73e8 0%,
                                        #1a73e8 ${progress}%,
                                        #d3d3d3 ${progress}%,
                                        #d3d3d3 100%
                                        )`
                                    }}
                                    onChange={modulePassed ? handleSeeking : undefined}
                                    readOnly={!modulePassed}
                                    onMouseDown={!modulePassed ? (e) => e.preventDefault() : undefined}
                                    onTouchStart={!modulePassed ? (e) => e.preventDefault() : undefined}
                                />
                            </div>
                            <div className="buttons-container">
                                {isPlaying ? (
                                    <button id="pause" onClick={pauseVideo}><img src="src\assets\pause-512.png" alt="Pause" width="70%" height="70%" /></button>
                                ): (
                                    <button id="play" onClick={playVideo}><img src="src\assets\play-512.png" alt="Play" width="70%" height="70%" /></button>
                                )}
                                <img id="volume-icon" src={volume === 0 ?
                                    'src/assets/mute-2-512.png' : "src/assets/volume-up-4-512.png"} alt="Volume" width="70%" height="70%" />
                                <input type="range" id="volume-slider" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
                                style={{
                                    background: `linear-gradient(
                                    to right,
                                    #1a73e8 0%,
                                    #1a73e8 ${volume * 100}%,
                                    #d3d3d3 ${volume * 100}%,
                                    #d3d3d3 100%
                                )`
                            }}
                            />
                            </div>
                        </div>
                    </div>
                        {videoEnded && (<button className="continue-btn" onClick={nextVideo}> Continue </button>)}
                </div>)
                :
                !finishedAllModules ?
                (<div className = "quiz">
                    <Quizzes quiz = {currentQuiz} onPassQuiz={handlePassQuiz} onFailQuiz={handleFailQuiz}/>
                </div>)
                :
                (<div className='certificate-container'>
                    <div className='certificate-wrapper'>
                        <img className = "certificate-img" src="src\assets\Completion.png"></img>
                            {/* DONT WANT DATE ON CERTIFICATE TO CHANGE EVERYTIME! WANT TO KEEP DATE OF FIRST APPEARANCE!! IMPORTANT!!*/}
                        <div className='user-name'>{name}</div>
                        <div className = "date" >{new Date().toLocaleDateString()}</div>
                    </div> 
                </div>
                
                    )
                }
            </div>
        </main>
        // add a footer maybe??
    );
    }

