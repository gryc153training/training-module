export default function Help() {


    return(
        <div className="min-h-screen_bg-gray-100_p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Help & Support
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Need Assistance?
                </h2>

                <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions, concerns, or need assistance regarding
                    the program, please don't hesitate to reach out.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                    Whether you're experiencing technical issues, need clarification on
                    program procedures, or have general feedback, we're here to help.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">
                    Contact Information
                    </h3>

                    <p className="text-gray-700">
                    Email:
                    <a
                        href="mailto:youremail@example.com"
                        className="email"
                    >
                        gryc153trainingprogram@gmail.com
                    </a>
                    </p>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    We will try to respond as soon as possible.
                </p>
            </div>
        </div>
    </div>
    )
}