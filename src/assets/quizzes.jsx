import { supabase } from '../supabaseClient';
import {useState} from 'react'

export default function Quizzes({ quiz, onPassQuiz, onFailQuiz}){
    const [answers, setAnswers] = useState({});

    function handleAnswer(event) {
        const {name, value} = event.target;


        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [name]: value
        }));
    }
    
    const checkAnswers = async (event) => {
        event.preventDefault();
        
        const {data: {user}} = await supabase.auth.getUser();

        let total = 0;

        quiz.questions.forEach(question => {
            if (answers[question.id] === question.answer) {
                total++;
            }
        });

        const passed = total > quiz.questions.length / 2;

        if (passed) {
            alert(`Your Score: ${total}/${quiz.questions.length}`)
            onPassQuiz();
        } else {
            alert(`Your Score: ${total}/${quiz.questions.length}. You Did Not Pass The Quiz. Please Rewatch The Module And Try Again.`)
            //We could make our own alert system rather than use browser's default alerts, would be more professional
            onFailQuiz();
        }
    }

    return (
        <form onSubmit={checkAnswers}>

            <h2 className='score-requirement'  >
                Module Quiz (Must score at least 75% in order to proceed)
            </h2>

            {quiz.questions.map((question, index) => (

                <div
                    key={question.id}
                    className="question-block"
                >

                    <h3 className = "quiz-title"> 
                        {index + 1}
                    </h3>

                    <fieldset className="question">

                        <legend className='question-title'>
                            {question.question}
                        </legend>

                        <ul className="answer-list">

                            {question.options.map(option => (

                                <li key={option.value}>

                                    <label className="form-control">

                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option.value}
                                            onChange={handleAnswer}
                                        />

                                        {option.text}

                                    </label>

                                </li>
                            ))}

                        </ul>

                    </fieldset>

                </div>
            ))}

            <button id = "quiz-btn" className="btn" type="submit">
                Submit
            </button>

        </form>
    );
}