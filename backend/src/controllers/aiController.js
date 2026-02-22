const Activity = require('../models/Activity');
const User = require('../models/User');

async function getStudentSummaryData(userId) {
    const activities = await Activity.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: "$category", totalCount: { $sum: "$count" }, totalDuration: { $sum: "$durationMinutes" } } }
    ]);

    let summaryText = "";
    let totalScore = 0;

    activities.forEach(a => {
        summaryText += `${a._id}: ${a.totalCount} problems/activities (${a.totalDuration} mins)\n`;
        totalScore += a.totalCount;
    });

    if (summaryText === "") summaryText = "No activities logged yet.";

    const readinessScore = Math.min(totalScore, 100);

    return {
        summaryText,
        readinessScore,
        weakAreas: getWeakAreas(activities),
    };
}

function getWeakAreas(activities) {
    if (activities.length === 0) return "All areas";
    const counts = { coding: 0, aptitude: 0, core: 0, softskills: 0 };
    activities.forEach(a => {
        if (counts[a._id] !== undefined) counts[a._id] = a.totalCount;
    });

    const weak = [];
    if (counts.coding < 10) weak.push("Coding");
    if (counts.aptitude < 10) weak.push("Aptitude");
    if (counts.core < 10) weak.push("Core Concepts");
    if (counts.softskills < 5) weak.push("Soft Skills");

    return weak.length > 0 ? weak.join(', ') : "None currently";
}

// @desc Generate Personalized Roadmap
// @route POST /api/ai/roadmap
// @access Protected (Student)
const generateRoadmap = async (req, res) => {
    let weakAreas = "All areas";
    let readinessScore = 0;
    try {
        const studentId = req.user._id;
        const student = await User.findById(studentId);

        const summaryObj = await getStudentSummaryData(studentId);
        const summaryText = summaryObj.summaryText;
        weakAreas = summaryObj.weakAreas;
        readinessScore = summaryObj.readinessScore;

        const prompt = `
You are an expert placement mentor.
Student Performance:
${summaryText}
Readiness Score: ${readinessScore}%

Weak Areas:
${weakAreas}

Generate:
1. Weakness analysis
2. 7-day action plan
3. Topic recommendations
4. Company readiness suggestion
5. Motivation

Respond clearly in structured format.
`;

        // We use HuggingFace Inference API for TinyLlama without a key (Rate limited)
        const response = await fetch("https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 300, temperature: 0.6 }
            })
        });

        if (response.ok) {
            const data = await response.json();
            const generatedText = data[0].generated_text.replace(prompt, '').trim();
            res.json({ roadmap: generatedText });
        } else {
            // Smart Fallback using Pollinations AI (free, no-key LLM Text Generation)
            const fallbackRes = await fetch("https://text.pollinations.ai/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "openai",
                    messages: [
                        { role: "system", content: "You are an expert placement mentor. Generate a structured 7-day action plan." },
                        { role: "user", content: `Student Performance: ${summaryText}\nReadiness Score: ${readinessScore}%\nWeak Areas: ${weakAreas}\n\nGenerate:\n1. Weakness analysis\n2. 7-day action plan\n3. Topic recommendations\n4. Company readiness suggestion\n5. Motivation\n\nFormat clearly using markdown (- and ###).` }
                    ]
                })
            });

            if (fallbackRes.ok) {
                const fallbackText = await fallbackRes.text();
                if (fallbackText.includes('"error":')) throw new Error('Pollinations rate limit');

                let finalRoadmap = fallbackText;
                try {
                    const parsed = JSON.parse(fallbackText);
                    if (parsed.choices && parsed.choices[0]?.message?.content) {
                        finalRoadmap = parsed.choices[0].message.content;
                    } else if (parsed.content) {
                        finalRoadmap = parsed.content;
                    } else if (parsed.reasoning_content) {
                        finalRoadmap = parsed.reasoning_content;
                    }
                } catch (e) { /* was plain text */ }

                res.json({ roadmap: finalRoadmap.trim() });
            } else {
                throw new Error("Pollinations failed");
            }
        }
    } catch (error) {
        console.error("AI Error:", error);
        // Final Local Fallback if HuggingFace and Pollinations both fail (Rate Limits)
        const fallbackText = `### Weakness Analysis\nYour primary weak areas are: ${weakAreas}. You need to dedicate more focused time here.\n\n### 7-Day Action Plan\n- Day 1-2: Focus entirely on fundamentals of ${weakAreas.split(',')[0] || 'your core weak topics'}.\n- Day 3-4: Practice 10 problems daily.\n- Day 5-6: Take mock assessments.\n- Day 7: Review all mistakes.\n\n### Topic Recommendations\n- Arrays, Strings, Basic Math (Coding)\n- Percentages, Ratios (Aptitude)\n- Operating Systems, DBMS Basics (Core)\n\n### Company Readiness Suggestion\nCurrently your readiness score is ${readinessScore}%. A score above 75% indicates you are ready for entry-level tech roles at companies like Wipro, and Infosys.\n\n### Motivation\nConsistency is key! You are doing great, just keep logging activities and stay disciplined.`;
        res.json({ roadmap: fallbackText });
    }
};

// @desc AI Chatbot
// @route POST /api/ai/chat
// @access Protected (Student)
const chatWithAI = async (req, res) => {
    let weakAreas = "All areas";
    let readinessScore = 0;
    try {
        const { question } = req.body;
        const studentId = req.user._id;

        const summaryObj = await getStudentSummaryData(studentId);
        const summaryText = summaryObj.summaryText;
        weakAreas = summaryObj.weakAreas;
        readinessScore = summaryObj.readinessScore;

        const prompt = `
<|system|>
You are a placement mentor chatbot.
Context of the student:
Activity: ${summaryText}
Readiness Score: ${readinessScore}%
Answer concisely and practically.
</s>
<|user|>
${question}
</s>
<|assistant|>
`;

        const response = await fetch("https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputs: prompt,
                parameters: { max_new_tokens: 150, temperature: 0.6 }
            })
        });

        if (response.ok) {
            const data = await response.json();
            let generatedText = data[0].generated_text;
            const parts = generatedText.split('<|assistant|>');
            if (parts.length > 1) {
                generatedText = parts[1].trim();
            }
            res.json({ reply: generatedText });
        } else {
            // Smart Fallback using Pollinations API depending on HF quota drops
            const fallbackRes = await fetch("https://text.pollinations.ai/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "openai",
                    messages: [
                        { role: "system", content: `You are a placement mentor chatbot. Student context: Activity: ${summaryText.replace('\n', ', ')}. Readiness Score: ${readinessScore}%. Weak Areas: ${weakAreas}. Answer concisely, intelligently, and practically in 1-2 paragraphs.` },
                        { role: "user", content: question }
                    ]
                })
            });

            if (fallbackRes.ok) {
                const fallbackReplyText = await fallbackRes.text();
                if (fallbackReplyText.includes('"error":')) throw new Error('Pollinations rate limit');

                let finalReply = fallbackReplyText;
                try {
                    const parsed = JSON.parse(fallbackReplyText);
                    if (parsed.choices && parsed.choices[0]?.message?.content) {
                        finalReply = parsed.choices[0].message.content;
                    } else if (parsed.content) {
                        finalReply = parsed.content;
                    } else if (parsed.reasoning_content) {
                        finalReply = parsed.reasoning_content;
                    }
                } catch (e) { /* was plain text */ }

                res.json({ reply: finalReply.trim() });
            } else {
                throw new Error("Pollinations failed");
            }
        }
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.json({ reply: "I noticed you asked an important question, but I am currently offline due to high traffic! However, based on my last analysis of your profile, I advise completing 5 coding problems today on Arrays to bring your readiness score up." });
    }
};

module.exports = {
    generateRoadmap,
    chatWithAI
};
