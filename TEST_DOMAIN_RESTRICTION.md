# Test Domain Restriction for SwasthPrameh AI Assistant

## Test Cases for Domain Restriction

### ✅ Relevant Queries (Should Get Full Responses)

1. **Ayurvedic Diabetes Questions:**
   - "What foods are good for balancing Kapha in diabetes?"
   - "Explain Madhumeha according to Ayurveda"
   - "How does Pitta dosha affect blood sugar?"
   - "What herbs help with diabetes management?"

2. **General Ayurvedic Health (Diabetes-related):**
   - "What is the Ayurvedic understanding of blood sugar?"
   - "How can yoga help with diabetes?"
   - "What lifestyle changes help prediabetes?"
   - "Explain dosha imbalances in diabetes"

3. **Platform-related Questions:**
   - "How does the SwasthPrameh platform work?"
   - "What is my Prakriti assessment?"
   - "How do I use the meal logging feature?"

### ❌ Irrelevant Queries (Should Get Refusal Message)

1. **Gaming & Entertainment:**
   - "What is CSGO?"
   - "Tell me about Rainbow Six Siege"
   - "Who is Virat Kohli?"
   - "What's the latest movie?"

2. **Technology & Programming:**
   - "How do I learn coding?"
   - "What is React?"
   - "Explain machine learning"

3. **General Topics:**
   - "What's the weather today?"
   - "Tell me about politics"
   - "How to invest in stocks?"

## Expected Behavior

### ✅ Relevant Query Response:
```
User: "What foods are good for balancing Kapha in diabetes?"

Expected: Full Ayurvedic response about Kapha-balancing foods for diabetes management, including specific recommendations and explanations.
```

### ❌ Irrelevant Query Response:
```
User: "What is CSGO?"

Expected: "I'm designed to assist only with Ayurveda for Diabetes and holistic diabetic wellness. Please ask something about Ayurvedic diabetes care, dosha balance, diet, lifestyle, or preventive care instead."
```

## Testing Instructions

1. **Start the LLM server:**
   ```bash
   cd src/llm
   npx ts-node server.ts
   ```

2. **Test with curl commands:**

   **Relevant Query Test:**
   ```bash
   curl -X POST http://localhost:8002/chat \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "test-user",
       "messages": [
         {"role": "user", "content": "What foods are good for balancing Kapha in diabetes?"}
       ]
     }'
   ```

   **Irrelevant Query Test:**
   ```bash
   curl -X POST http://localhost:8002/chat \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "test-user", 
       "messages": [
         {"role": "user", "content": "What is CSGO?"}
       ]
     }'
   ```

3. **Expected Results:**
   - Relevant query: Detailed Ayurvedic response
   - Irrelevant query: Refusal message with redirection

## Implementation Details

### Files Modified:
- ✅ `src/lib/ai/systemPrompts.ts` - Centralized prompts and keyword filtering
- ✅ `src/llm/server.ts` - Updated chat and plan generation endpoints
- ✅ Domain restriction applied to both `/chat` and `/generate-plan` endpoints

### Key Features:
- ✅ **Centralized System Prompts** - Consistent messaging across all AI features
- ✅ **Keyword Filtering** - Automatic detection of relevant vs irrelevant queries
- ✅ **Graceful Refusal** - Polite redirection for off-topic questions
- ✅ **Context Integration** - Personalized responses using user's Prakriti and health data
- ✅ **Markdown Formatting** - Proper table formatting for 15-day plans

### Allowed Keywords Include:
- Core Ayurvedic terms: ayurveda, dosha, vata, pitta, kapha, prakriti
- Diabetes terms: diabetes, blood sugar, glucose, insulin, madhumeha, prameha
- Management terms: herbs, diet, yoga, meditation, lifestyle, wellness
- Platform terms: swasth, prameh, assessment, plan, recommendation

The AI assistant now exclusively focuses on Ayurvedic diabetes care while maintaining a helpful and educational tone!
