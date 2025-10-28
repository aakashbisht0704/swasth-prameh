'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var groq_sdk_1 = require("groq-sdk");
var node_fetch_1 = require("node-fetch");
var dotenv_1 = require("dotenv");
// Load env from .env.local first, then fallback to .env
dotenv_1.default.config({ path: '.env.local' });
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
var GROQ_API_KEY = process.env.GROQ_API_KEY;
var GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
var SUPABASE_URL = process.env.SUPABASE_PROJECT_URL;
var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
var groq = GROQ_API_KEY ? new groq_sdk_1.Groq({ apiKey: GROQ_API_KEY }) : null;
app.post('/generate-plan', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, diagnosis_id, context, messages, parsed, tryModels, lastErr, _i, tryModels_1, model, completion, content, err_1, msg, summary, plan, persistErr_1, e_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 13, , 14]);
                _a = req.body, user_id = _a.user_id, diagnosis_id = _a.diagnosis_id, context = _a.context;
                if (!user_id || !context) {
                    return [2 /*return*/, res.status(400).json({ error: 'user_id and context are required' })];
                }
                messages = [
                    {
                        role: 'system',
                        content: 'You are an Ayurvedic AI assistant specializing in diabetes management. Given a users Prakriti, Pariksha, lifestyle, and dosha diagnosis, generate a 15-day holistic plan focusing on diet, yoga, sleep, hydration, and mindfulness. Output STRICT JSON only, with schema: {"summary": string, "plan": [{"day": number, "morning": string, "meals": string, "evening": string}], "markdown_table": string}. The markdown_table should be a formatted table. Do not include any extra text. Avoid medical prescriptions.'
                    },
                    { role: 'user', content: JSON.stringify(context) }
                ];
                parsed = void 0;
                if (!!groq) return [3 /*break*/, 1];
                // Fallback stub when no API key is configured
                parsed = {
                    summary: 'Sample 15-day lifestyle plan (development stub).',
                    plan: Array.from({ length: 15 }).map(function (_, i) { return ({
                        day: i + 1,
                        morning: '10 min breathwork + light stretching',
                        meals: 'Warm, lightly spiced, low-sugar balanced meals',
                        evening: '20 min walk; digital sunset 1 hour before bed'
                    }); })
                };
                return [3 /*break*/, 8];
            case 1:
                tryModels = [GROQ_MODEL, 'llama-3.1-8b-instant'];
                lastErr = null;
                _i = 0, tryModels_1 = tryModels;
                _e.label = 2;
            case 2:
                if (!(_i < tryModels_1.length)) return [3 /*break*/, 7];
                model = tryModels_1[_i];
                _e.label = 3;
            case 3:
                _e.trys.push([3, 5, , 6]);
                return [4 /*yield*/, groq.chat.completions.create({
                        model: model,
                        messages: messages,
                        temperature: 0.4,
                        max_completion_tokens: 2048,
                        top_p: 1,
                        response_format: { type: 'json_object' },
                    })];
            case 4:
                completion = _e.sent();
                content = ((_d = (_c = (_b = completion === null || completion === void 0 ? void 0 : completion.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || '{}';
                try {
                    parsed = JSON.parse(content);
                }
                catch (_f) {
                    parsed = { summary: 'Plan unavailable', plan: [] };
                }
                lastErr = null;
                return [3 /*break*/, 7];
            case 5:
                err_1 = _e.sent();
                lastErr = err_1;
                msg = String((err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || '');
                if (!(msg.includes('model_decommissioned') || msg.includes('decommissioned'))) {
                    return [3 /*break*/, 7];
                }
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7:
                if (lastErr)
                    throw lastErr;
                // Final safety: if plan missing or empty, synthesize a basic 15-day plan
                if (!parsed || !Array.isArray(parsed.plan) || parsed.plan.length === 0) {
                    summary = (parsed === null || parsed === void 0 ? void 0 : parsed.summary) || '15-day lifestyle plan based on your profile.';
                    plan = Array.from({ length: 15 }).map(function (_, i) { return ({
                        day: i + 1,
                        morning: '10 min breathwork + gentle stretching',
                        meals: 'Balanced, warm, low-sugar meals aligned to dosha moderation',
                        evening: '20 min walk; 5 min mindfulness; regular sleep time'
                    }); });
                    parsed = { summary: summary, plan: plan };
                }
                _e.label = 8;
            case 8:
                if (!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) return [3 /*break*/, 12];
                _e.label = 9;
            case 9:
                _e.trys.push([9, 11, , 12]);
                return [4 /*yield*/, (0, node_fetch_1.default)("".concat(SUPABASE_URL, "/rest/v1/plans"), {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_SERVICE_ROLE_KEY,
                            'Authorization': "Bearer ".concat(SUPABASE_SERVICE_ROLE_KEY),
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            user_id: user_id,
                            diagnosis_id: diagnosis_id || null,
                            plan_json: parsed,
                            summary: parsed.summary || ''
                        })
                    })];
            case 10:
                _e.sent();
                return [3 /*break*/, 12];
            case 11:
                persistErr_1 = _e.sent();
                console.error('Persist plan error:', persistErr_1);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/, res.json(parsed)];
            case 13:
                e_1 = _e.sent();
                console.error('LLM /generate-plan error:', e_1);
                return [2 /*return*/, res.status(500).json({ error: String(e_1) })];
            case 14: return [2 /*return*/];
        }
    });
}); });
// Generic chat endpoint - returns assistant text using provided messages + context
app.post('/chat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, messages, context, lastMessageContent, lastMessage_1, irrelevantKeywords, relevantKeywords, hasRelevantKeyword, hasIrrelevantKeyword, isIrrelevant, sys, ctxMsg, completion, text, e_2;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 2, , 3]);
                _a = req.body, user_id = _a.user_id, messages = _a.messages, context = _a.context;
                if (!messages || !Array.isArray(messages)) {
                    return [2 /*return*/, res.status(400).json({ error: 'messages (array) required' })];
                }
                lastMessageContent = (_b = messages[messages.length - 1]) === null || _b === void 0 ? void 0 : _b.content;
                lastMessage_1 = typeof lastMessageContent === 'string' ? lastMessageContent : '';
                irrelevantKeywords = [
                    'weather', 'sports', 'politics', 'movies', 'music', 'games', 'travel', 'shopping',
                    'celebrity', 'news', 'stock', 'crypto', 'bitcoin', 'programming', 'coding', 'tech',
                    'fashion', 'clothes', 'shoes', 'cars', 'real estate', 'dating', 'social media'
                ];
                relevantKeywords = [
                    'health', 'diabetes', 'ayurveda', 'dosha', 'prakriti', 'diet', 'exercise', 'meditation',
                    'yoga', 'wellness', 'lifestyle', 'nutrition', 'herbs', 'spices', 'healing', 'therapy',
                    'consultation', 'assessment', 'plan', 'recommendation', 'guidance', 'support', 'help',
                    'question', 'query', 'doubt', 'clarify', 'explain', 'understand', 'learn', 'know',
                    'swasth', 'prameh', 'app', 'website', 'platform', 'service', 'feature', 'function',
                    'login', 'signup', 'dashboard', 'profile', 'onboarding', 'report', 'upload', 'chat',
                    'feedback', 'contact', 'admin', 'user', 'account', 'settings', 'privacy', 'terms',
                    'personalized', 'custom', 'individual', 'specific', 'always', 'give', 'based', 'upon',
                    'how', 'what', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should',
                    'personal', 'customized', 'tailored', 'unique', 'different', 'same', 'similar'
                ];
                hasRelevantKeyword = relevantKeywords.some(function (keyword) {
                    return lastMessage_1.toLowerCase().includes(keyword);
                });
                hasIrrelevantKeyword = irrelevantKeywords.some(function (keyword) {
                    return lastMessage_1.toLowerCase().includes(keyword);
                });
                isIrrelevant = hasIrrelevantKeyword && !hasRelevantKeyword && lastMessage_1.length > 15;
                if (isIrrelevant) {
                    return [2 /*return*/, res.json({
                            text: "I'm here to help with your Ayurvedic health and diabetes management journey. Please ask questions related to:\n\n• Your Prakriti constitution and dosha assessment\n• Diabetes management strategies and lifestyle changes\n• Ayurvedic herbs, spices, and natural remedies\n• Diet and nutrition guidance for your constitution\n• Exercise, yoga, and wellness routines\n• Meditation, mindfulness, and stress management\n• Using the SwasthPrameh platform features\n• Understanding your health reports and recommendations\n• General health questions and clarifications\n\nHow can I assist you with your health goals today?"
                        })];
                }
                sys = {
                    role: 'system',
                    content: "You are a helpful Ayurvedic assistant specializing in diabetes management. Use the provided context (onboarding, diagnosis, plans) to personalize replies. \n\nIMPORTANT FORMATTING RULES:\n- For 15-day plans, ALWAYS format as markdown tables\n- Use this exact table format:\n| Day | Morning | Meals | Evening |\n|-----|---------|-------|---------|\n| 1 | Morning routine | Meal plan | Evening routine |\n| 2 | Morning routine | Meal plan | Evening routine |\n\n- Use markdown headers (# ## ###) for sections\n- Use bullet points (-) for lists\n- Keep responses focused on Ayurvedic health and diabetes management\n- Avoid medical prescriptions, only provide lifestyle recommendations"
                };
                ctxMsg = { role: 'system', content: context ? JSON.stringify(context) : '{}' };
                if (!groq) {
                    // Stub path
                    return [2 /*return*/, res.json({ text: 'This is a development stub response. Your profile context will be used when the LLM key is configured.' })];
                }
                return [4 /*yield*/, groq.chat.completions.create({
                        model: GROQ_MODEL,
                        messages: __spreadArray([sys, ctxMsg], messages, true),
                        temperature: 0.4,
                        top_p: 1,
                        max_completion_tokens: 1024,
                    })];
            case 1:
                completion = _f.sent();
                text = ((_e = (_d = (_c = completion === null || completion === void 0 ? void 0 : completion.choices) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.content) || '';
                return [2 /*return*/, res.json({ text: text })];
            case 2:
                e_2 = _f.sent();
                console.error('LLM /chat error:', e_2);
                return [2 /*return*/, res.status(500).json({ error: String(e_2) })];
            case 3: return [2 /*return*/];
        }
    });
}); });
var port = process.env.PORT || 8002;
app.listen(port, function () {
    console.log("LLM server listening on :".concat(port));
});
