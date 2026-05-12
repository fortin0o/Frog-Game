class Leaderboard {

    static getScores() {

        return JSON.parse(localStorage.getItem('frogLeaderboard')) || [];
    }

    static saveScore(score) {

        let scores = this.getScores();

        scores.push(score);

        scores.sort((a, b) => b - a);

        scores = scores.slice(0, 5);

        localStorage.setItem('frogLeaderboard', JSON.stringify(scores));
    }
}