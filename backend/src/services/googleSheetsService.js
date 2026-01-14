const { google } = require('googleapis');

class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = null;
    }

    async initialize() {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });

            this.auth = await auth.getClient();
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            console.log('✅ Google Sheets API initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Google Sheets API:', error.message);
            // Don't throw - allow app to run without Google Sheets integration
        }
    }

    async getQuizResponses(spreadsheetId, range = 'Form Responses 1!A:Z') {
        if (!this.sheets) {
            await this.initialize();
        }

        if (!this.sheets) {
            throw new Error('Google Sheets API not initialized. Check credentials.');
        }

        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        return response.data.values || [];
    }

    parseQuizData(rawData, studentEmail) {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        // First row is headers
        const headers = rawData[0];
        const responses = rawData.slice(1);

        // Find email column index
        const emailIndex = headers.findIndex(h =>
            h.toLowerCase().includes('email') || h.toLowerCase().includes('e-mail')
        );

        if (emailIndex === -1) {
            console.warn('No email column found in sheet');
            return [];
        }

        // Find student's responses
        const studentResponses = responses.filter(row => {
            return row[emailIndex] && row[emailIndex].toLowerCase() === studentEmail.toLowerCase();
        });

        return studentResponses.map(row => {
            const response = {};
            headers.forEach((header, index) => {
                response[header] = row[index] || '';
            });
            return response;
        });
    }

    calculateStats(responses) {
        if (!responses || responses.length === 0) {
            return {
                avgScore: 0,
                quizzesDone: 0,
                consistency: 0,
            };
        }

        // Find score column (look for "Score", "Points", "Grade", etc.)
        const firstResponse = responses[0];
        const scoreKey = Object.keys(firstResponse).find(key =>
            key.toLowerCase().includes('score') ||
            key.toLowerCase().includes('points') ||
            key.toLowerCase().includes('grade')
        );

        if (!scoreKey) {
            return {
                avgScore: 0,
                quizzesDone: responses.length,
                consistency: 0,
            };
        }

        // Calculate average score
        const scores = responses
            .map(r => parseFloat(r[scoreKey] || 0))
            .filter(s => !isNaN(s));

        if (scores.length === 0) {
            return {
                avgScore: 0,
                quizzesDone: responses.length,
                consistency: 0,
            };
        }

        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Calculate consistency (based on score variance)
        // Lower variance = higher consistency
        const variance = scores.reduce((sum, score) =>
            sum + Math.pow(score - avgScore, 2), 0
        ) / scores.length;
        const standardDeviation = Math.sqrt(variance);

        // Convert to consistency percentage (inverse of coefficient of variation)
        // 0 std dev = 100% consistency, higher std dev = lower consistency
        const consistency = avgScore > 0
            ? Math.max(0, Math.min(100, 100 - (standardDeviation / avgScore * 100)))
            : 0;

        return {
            avgScore: avgScore.toFixed(1),
            quizzesDone: responses.length,
            consistency: Math.round(consistency),
        };
    }

    formatRecentActivity(responses) {
        if (!responses || responses.length === 0) {
            return [];
        }

        // Find relevant columns
        const firstResponse = responses[0];
        const keys = Object.keys(firstResponse);

        const timestampKey = keys.find(k => k.toLowerCase().includes('timestamp'));
        const titleKey = keys.find(k => k.toLowerCase().includes('quiz') || k.toLowerCase().includes('title'));
        const scoreKey = keys.find(k => k.toLowerCase().includes('score') || k.toLowerCase().includes('points'));

        return responses.slice(-5).reverse().map(r => ({
            title: r[titleKey] || 'Quiz',
            score: r[scoreKey] ? `${r[scoreKey]}%` : 'N/A',
            date: r[timestampKey] ? new Date(r[timestampKey]).toLocaleDateString() : 'N/A',
            status: parseFloat(r[scoreKey] || 0) >= 60 ? 'Passed' : 'Review',
        }));
    }
}

module.exports = new GoogleSheetsService();
