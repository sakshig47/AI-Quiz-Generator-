let currentContent = '';
        let selectedDifficulty = '';
        let quizData = [];
        let currentQuestionIndex = 0;
        let userAnswers = [];
        let score = 0;

        // File upload handling
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const textInput = document.getElementById('textInput');

        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', handleDragOver);
        uploadZone.addEventListener('drop', handleFileDrop);
        uploadZone.addEventListener('dragleave', handleDragLeave);
        fileInput.addEventListener('change', handleFileSelect);

        function handleDragOver(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        }

        function handleDragLeave(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        }

        function handleFileDrop(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            processFiles(files);
        }

        function handleFileSelect(e) {
            const files = e.target.files;
            processFiles(files);
        }

        function processFiles(files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentContent += e.target.result + '\n';
                    updateUploadZone(`File "${file.name}" loaded successfully!`);
                };
                reader.readAsText(file);
            });
        }

        function updateUploadZone(message) {
            uploadZone.innerHTML = `
                <div class="upload-icon">✅</div>
                <h3>${message}</h3>
                <p>Ready to generate quiz</p>
            `;
        }

        function processContent() {
            const textContent = textInput.value.trim();
            if (textContent) {
                currentContent += textContent;
            }

            if (!currentContent.trim()) {
                alert('Please upload a file or enter some text content first!');
                return;
            }

            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('difficultySection').style.display = 'block';
        }

        function selectDifficulty(difficulty) {
            selectedDifficulty = difficulty;
            
            // Remove selected class from all cards
            document.querySelectorAll('.difficulty-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to chosen card
            event.target.closest('.difficulty-card').classList.add('selected');
            
            // Enable start quiz button
            document.getElementById('startQuizBtn').disabled = false;
        }

        function startQuiz() {
            if (!selectedDifficulty) {
                alert('Please select a difficulty level first!');
                return;
            }

            document.getElementById('difficultySection').style.display = 'none';
            document.getElementById('loadingSection').style.display = 'block';

            // Simulate quiz generation (in real app, this would call your backend)
            setTimeout(() => {
                generateQuizQuestions();
                document.getElementById('loadingSection').style.display = 'none';
                document.getElementById('quizSection').style.display = 'block';
                displayQuestion();
            }, 3000);
        }

        function generateQuizQuestions() {
            // Sample quiz data - in real app, this would come from your AI backend
            const sampleQuestions = {
                simple: [
                    {
                        question: "What is the main topic discussed in the provided content?",
                        options: ["Technology", "Science", "History", "Literature"],
                        correct: 0,
                        type: "multiple-choice"
                    },
                    {
                        question: "The content mentions specific facts about the subject.",
                        options: ["True", "False"],
                        correct: 0,
                        type: "true-false"
                    }
                ],
                moderate: [
                    {
                        question: "How do the concepts in the content relate to each other?",
                        options: ["They are completely separate", "They build upon each other", "They contradict each other", "They are examples of the same principle"],
                        correct: 1,
                        type: "multiple-choice"
                    },
                    {
                        question: "What can you infer from the information provided?",
                        options: ["The topic is simple", "There are complex relationships", "More research is needed", "All of the above"],
                        correct: 3,
                        type: "multiple-choice"
                    }
                ],
                hard: [
                    {
                        question: "Analyze the implications of the main concepts discussed. What would happen if these principles were applied in a different context?",
                        options: ["Similar results would occur", "Completely different outcomes", "The principles wouldn't apply", "New variables would need consideration"],
                        correct: 3,
                        type: "multiple-choice"
                    },
                    {
                        question: "Critically evaluate the strengths and weaknesses of the arguments presented in the content.",
                        options: ["Mostly strengths", "Mostly weaknesses", "Balanced arguments", "Insufficient information to evaluate"],
                        correct: 2,
                        type: "multiple-choice"
                    }
                ]
            };

            // Generate 10 questions by repeating and varying the sample questions
            quizData = [];
            const baseQuestions = sampleQuestions[selectedDifficulty];
            
            for (let i = 0; i < 10; i++) {
                const baseQuestion = baseQuestions[i % baseQuestions.length];
                quizData.push({
                    ...baseQuestion,
                    question: `Question ${i + 1}: ${baseQuestion.question}`,
                    id: i
                });
            }

            userAnswers = new Array(quizData.length).fill(-1);
        }

        function displayQuestion() {
            const question = quizData[currentQuestionIndex];
            const container = document.getElementById('questionContainer');
            
            container.innerHTML = `
                <div class="question">
                    <h3>${question.question}</h3>
                    <div class="options">
                        ${question.options.map((option, index) => `
                            <div class="option" onclick="selectAnswer(${index})" data-index="${index}">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Update progress and counter
            const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

            // Show/hide appropriate buttons
            if (currentQuestionIndex === quizData.length - 1) {
                document.getElementById('nextBtn').classList.add('hidden');
                document.getElementById('submitBtn').classList.remove('hidden');
            } else {
                document.getElementById('nextBtn').classList.remove('hidden');
                document.getElementById('submitBtn').classList.add('hidden');
            }
        }

        function selectAnswer(answerIndex) {
            // Remove previous selection
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected');
            });

            // Add selection to chosen option
            document.querySelector(`[data-index="${answerIndex}"]`).classList.add('selected');
            
            // Store user answer
            userAnswers[currentQuestionIndex] = answerIndex;
        }

        function nextQuestion() {
            if (userAnswers[currentQuestionIndex] === -1) {
                alert('Please select an answer before proceeding!');
                return;
            }

            currentQuestionIndex++;
            displayQuestion();
        }

        function submitQuiz() {
            if (userAnswers[currentQuestionIndex] === -1) {
                alert('Please select an answer before submitting!');
                return;
            }

            // Calculate score
            score = 0;
            for (let i = 0; i < quizData.length; i++) {
                if (userAnswers[i] === quizData[i].correct) {
                    score++;
                }
            }

            displayResults();
        }

        function displayResults() {
            document.getElementById('quizSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';

            const percentage = Math.round((score / quizData.length) * 100);
            const scoreCircle = document.getElementById('scoreCircle');
            
            // Set score circle color based on performance
            if (percentage >= 80) {
                scoreCircle.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
            } else if (percentage >= 60) {
                scoreCircle.style.background = 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
            } else {
                scoreCircle.style.background = 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
            }

            scoreCircle.textContent = percentage + '%';

            // Update performance text
            let title, description;
            if (percentage >= 90) {
                title = "Excellent! 🏆";
                description = `Outstanding performance! You scored ${score} out of ${quizData.length} questions correctly.`;
            } else if (percentage >= 80) {
                title = "Great Job! 🌟";
                description = `Well done! You scored ${score} out of ${quizData.length} questions correctly.`;
            } else if (percentage >= 60) {
                title = "Good Effort! 👍";
                description = `Nice work! You scored ${score} out of ${quizData.length} questions correctly.`;
            } else {
                title = "Keep Practicing! 💪";
                description = `You scored ${score} out of ${quizData.length} questions correctly. Review the material and try again!`;
            }

            document.getElementById('performanceTitle').textContent = title;
            document.getElementById('performanceDescription').textContent = description;

            // Display detailed results
            const detailedResults = document.getElementById('detailedResults');
            detailedResults.innerHTML = `
                <h4>Performance Breakdown:</h4>
                <div style="margin-top: 15px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Correct Answers:</span>
                        <span style="color: #10b981; font-weight: bold;">${score}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Incorrect Answers:</span>
                        <span style="color: #ef4444; font-weight: bold;">${quizData.length - score}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Difficulty Level:</span>
                        <span style="font-weight: bold; text-transform: capitalize;">${selectedDifficulty}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Accuracy Rate:</span>
                        <span style="font-weight: bold;">${percentage}%</span>
                    </div>
                </div>
            `;
        }

        function reviewAnswers() {
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('quizSection').style.display = 'block';
            
            // Reset to first question for review
            currentQuestionIndex = 0;
            displayReviewQuestion();
        }

        function displayReviewQuestion() {
            const question = quizData[currentQuestionIndex];
            const container = document.getElementById('questionContainer');
            
            container.innerHTML = `
                <div class="question">
                    <h3>${question.question}</h3>
                    <div class="options">
                        ${question.options.map((option, index) => {
                            let className = 'option';
                            if (index === question.correct) {
                                className += ' correct';
                            } else if (index === userAnswers[currentQuestionIndex] && index !== question.correct) {
                                className += ' incorrect';
                            } else if (index === userAnswers[currentQuestionIndex]) {
                                className += ' selected';
                            }
                            
                            return `<div class="${className}">${option}</div>`;
                        }).join('')}
                    </div>
                    <div style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-radius: 8px;">
                        <strong>Your Answer:</strong> ${question.options[userAnswers[currentQuestionIndex]] || 'No answer selected'}<br>
                        <strong>Correct Answer:</strong> ${question.options[question.correct]}
                    </div>
                </div>
            `;

            // Update counter
            document.getElementById('questionCounter').textContent = `Review ${currentQuestionIndex + 1} of ${quizData.length}`;
            
            // Update buttons for review mode
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');
            
            if (currentQuestionIndex === quizData.length - 1) {
                nextBtn.classList.add('hidden');
                submitBtn.classList.remove('hidden');
                submitBtn.textContent = 'Back to Results 📊';
                submitBtn.onclick = () => {
                    document.getElementById('quizSection').style.display = 'none';
                    document.getElementById('resultsSection').style.display = 'block';
                };
            } else {
                nextBtn.classList.remove('hidden');
                submitBtn.classList.add('hidden');
                nextBtn.onclick = () => {
                    currentQuestionIndex++;
                    displayReviewQuestion();
                };
            }
        }

        function restartApp() {
            // Reset all variables
            currentContent = '';
            selectedDifficulty = '';
            quizData = [];
            currentQuestionIndex = 0;
            userAnswers = [];
            score = 0;

            // Reset UI
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('uploadSection').style.display = 'block';
            
            // Reset upload zone
            uploadZone.innerHTML = `
                <div class="upload-icon">📁</div>
                <h3>Drop files here or click to browse</h3>
                <p>Supports PDF, DOC, DOCX, and TXT files</p>
            `;
            
            // Clear text input
            textInput.value = '';
            
            // Reset difficulty selection
            document.querySelectorAll('.difficulty-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.getElementById('startQuizBtn').disabled = true;
        }