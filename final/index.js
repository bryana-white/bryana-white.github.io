// Quiz Data
const QUIZ_DATA = {
    questions: [
        {
            question: "What's your favorite mood?",
            options: [
                { text: "Energetic and upbeat", genre: "Pop" },
                { text: "Relaxed and chill", genre: "Electronic" },
                { text: "Deep and emotional", genre: "Indie" },
                { text: "Powerful and intense", genre: "Rock" },
                { text: "Smooth and cool", genre: "R&B" }
            ]
        },
        {
            question: "Pick your ideal weekend activity:",
            options: [
                { text: "Dancing at a club", genre: "Pop" },
                { text: "Listening to vinyl at home", genre: "Electronic" },
                { text: "Intimate acoustic concert", genre: "Indie" },
                { text: "Big stadium rock show", genre: "Rock" },
                { text: "Lounging with friends", genre: "R&B" }
            ]
        }
    ],
    playlists: {
        "Pop": {
            name: "Pop Party Playlist",
            description: "Energetic pop hits to keep you dancing",
            tracks: [
                "Blinding Lights - The Weeknd",
                "Levitating - Dua Lipa",
                "Shape of You - Ed Sheeran"
            ]
        },
        "Electronic": {
            name: "Chill Electronic Vibes",
            description: "Smooth electronic beats for relaxation",
            tracks: [
                "Midnight City - M83",
                "Faded - Alan Walker",
                "Strobe - Deadmau5"
            ]
        },
        "Indie": {
            name: "Indie Soul Sounds",
            description: "Soulful alternative and indie tracks",
            tracks: [
                "Take Me To Church - Hozier",
                "Ho Hey - The Lumineers",
                "Budapest - George Ezra"
            ]
        },
        "Rock": {
            name: "Classic Rock Anthems",
            description: "Powerful rock tracks to fuel your spirit",
            tracks: [
                "Livin' on a Prayer - Bon Jovi",
                "Sweet Child O' Mine - Guns N' Roses",
                "Don't Stop Believin' - Journey"
            ]
        },
        "R&B": {
            name: "Smooth R&B Grooves",
            description: "Cool and sultry R&B tracks",
            tracks: [
                "Ordinary People - John Legend",
                "No Diggity - Blackstreet",
                "Killing Me Softly - The Fugees"
            ]
        }
    }
};

class MusicQuiz {
    constructor(quizContainer, quizData) {
        this.quizContainer = quizContainer;
        this.quizData = quizData;
        this.currentQuestionIndex = 0;
        this.genreScores = {
            "Pop": 0,
            "Electronic": 0,
            "Indie": 0,
            "Rock": 0,
            "R&B": 0
        };
        this.init();
    }

    init() {
        this.renderQuestion();
    }

    renderQuestion() {
        const currentQuestion = this.quizData.questions[this.currentQuestionIndex];
        const quizContent = document.getElementById('quizContent');

        // Use template literals safely
        quizContent.innerHTML = `
            <div class="question">
                <h2>${this.escapeHtml(currentQuestion.question)}</h2>
                ${currentQuestion.options.map((option, index) => `
                    <button class="option-btn" data-genre="${this.escapeHtml(option.genre)}">
                        ${this.escapeHtml(option.text)}
                    </button>
                `).join('')}
            </div>
        `;

        // Add event listeners to buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e));
        });
    }

    // Added HTML escaping method to prevent XSS
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    handleAnswer(event) {
        const selectedGenre = event.target.dataset.genre;
        this.genreScores[selectedGenre]++;

        if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        } else {
            this.generatePlaylist();
        }
    }

    generatePlaylist() {
        // Find the genre with the highest score
        const topGenre = Object.keys(this.genreScores).reduce((a, b) =>
            this.genreScores[a] > this.genreScores[b] ? a : b
        );

        const playlist = this.quizData.playlists[topGenre];
        const quizContent = document.getElementById('quizContent');

        quizContent.innerHTML = `
            <div class="result">
                <h2>Your Personalized Playlist</h2>
                <div class="playlist-card">
                    <h3>${this.escapeHtml(playlist.name)}</h3>
                    <p>${this.escapeHtml(playlist.description)}</p>
                    <h4>Recommended Tracks:</h4>
                    <ul>
                        ${playlist.tracks.map(track => `<li>${this.escapeHtml(track)}</li>`).join('')}
                    </ul>
                </div>
                <button class="restart-btn" id="restartButton">Retake Quiz</button>
            </div>
        `;

        // Add event listener for restart button
        document.getElementById('restartButton').addEventListener('click', () => {
            location.reload();
        });
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quizContainer');
    new MusicQuiz(quizContainer, QUIZ_DATA);
});