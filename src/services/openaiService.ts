// OpenAI API service for the AI Assistant
// This is a simple implementation to interact with OpenAI's API

// API key (in a real app, this would be stored securely and not hardcoded)
const OPENAI_API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';

// System message to provide context about the assistant's role
const SYSTEM_MESSAGE = `You are a helpful pregnancy assistant that provides information and guidance to expecting mothers.
Your responses should be:
1. Accurate and based on medical consensus
2. Supportive and empathetic
3. Clear and concise
4. Always remind users to consult healthcare providers for medical advice
5. Focus on pregnancy-related topics including nutrition, health, baby development, and wellness`;

// Interface for the chat message
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Fallback responses for common pregnancy questions
const fallbackResponses = new Map<string, string>([
  ['nutrition', `During pregnancy, it's important to focus on nutrient-rich foods. Here are some key recommendations:

1. Fruits and vegetables: Aim for a variety of colors to get different vitamins and minerals.
2. Protein: Include lean meats, poultry, fish, eggs, beans, and nuts.
3. Whole grains: Choose whole grain bread, pasta, and cereals.
4. Dairy: Consume calcium-rich foods like milk, yogurt, and cheese.
5. Iron-rich foods: Include spinach, beans, and lean red meat.
6. Folate sources: Leafy greens, fortified cereals, and beans.

Remember to stay hydrated and take your prenatal vitamins as recommended by your healthcare provider.`],

  ['avoid', `During pregnancy, it's advisable to avoid or limit:

1. Raw or undercooked meat, poultry, fish, and eggs
2. Unpasteurized dairy products and juices
3. High-mercury fish (shark, swordfish, king mackerel, tilefish)
4. Raw sprouts
5. Excess caffeine (limit to 200mg per day, about one 12oz cup of coffee)
6. Alcohol
7. Processed foods high in sugar and salt

Always consult with your healthcare provider for personalized advice regarding your diet during pregnancy.`],

  ['exercise', `Exercise during pregnancy is generally safe and beneficial when done appropriately:

1. Aim for 150 minutes of moderate activity per week
2. Good options include walking, swimming, stationary cycling, and prenatal yoga
3. Avoid high-impact activities, contact sports, and exercises with fall risks
4. Listen to your body and avoid overheating or exhaustion
5. Stay hydrated before, during, and after exercise
6. Stop if you experience pain, dizziness, shortness of breath, or vaginal bleeding

Always consult with your healthcare provider before starting or continuing an exercise program during pregnancy.`],

  ['symptoms', `Common pregnancy symptoms include:

1. Nausea and vomiting (morning sickness)
2. Fatigue
3. Frequent urination
4. Tender, swollen breasts
5. Food cravings or aversions
6. Heartburn and constipation
7. Back pain
8. Swelling in feet and ankles

Contact your healthcare provider immediately if you experience:
• Severe abdominal pain
• Heavy vaginal bleeding
• Severe headaches or vision changes
• Difficulty breathing
• Decreased fetal movement
• High fever
• Sudden swelling in face or hands`],

  ['development', `Baby development varies by trimester:

First Trimester (Weeks 1-12):
• All major organs begin forming
• Heart starts beating around week 6
• Limb buds develop into arms and legs
• By week 12, baby is about 2.5 inches long

Second Trimester (Weeks 13-26):
• Gender becomes visible on ultrasound
• You may feel movement ("quickening") around weeks 18-22
• Baby can hear sounds from outside the womb
• By week 26, baby is about 14 inches long

Third Trimester (Weeks 27-40):
• Brain development accelerates
• Baby gains significant weight
• Lungs mature in preparation for breathing
• Baby moves into head-down position for birth
• Full-term babies average 19-21 inches in length`],

  ['sleep', `Tips for better sleep during pregnancy:

1. Sleep Position: Try sleeping on your left side with knees bent, which improves blood flow to your baby, uterus, and kidneys. Use pillows between your knees, under your abdomen, and behind your back for support.

2. Create a Routine: Go to bed and wake up at consistent times, and develop a relaxing pre-sleep routine.

3. Manage Discomfort: Address heartburn by avoiding spicy/acidic foods before bed and elevating your upper body. For leg cramps, stretch before bed and stay hydrated.

4. Limit Fluids Before Bed: Reduce liquid intake 2-3 hours before sleeping to minimize bathroom trips.

5. Create a Sleep-Friendly Environment: Keep your bedroom dark, quiet, and cool.

Always discuss persistent sleep problems with your healthcare provider, as quality sleep is important for both you and your baby.`]
]);

// Function to get a response from OpenAI
export const getAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Check if we can identify a topic from the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (lastUserMessage) {
      const userQuery = lastUserMessage.content.toLowerCase();
      
      // Check for keywords in the user's message to determine topic
      if (userQuery.includes('eat') || userQuery.includes('food') || userQuery.includes('nutrient') || userQuery.includes('vitamin')) {
        return fallbackResponses.get('nutrition') || getFallbackResponse();
      }
      
      if (userQuery.includes('avoid') || userQuery.includes('should not eat') || userQuery.includes('dangerous')) {
        return fallbackResponses.get('avoid') || getFallbackResponse();
      }
      
      if (userQuery.includes('exercise') || userQuery.includes('workout') || userQuery.includes('activity') || userQuery.includes('fitness')) {
        return fallbackResponses.get('exercise') || getFallbackResponse();
      }
      
      if (userQuery.includes('symptom') || userQuery.includes('feel') || userQuery.includes('pain') || userQuery.includes('discomfort')) {
        return fallbackResponses.get('symptoms') || getFallbackResponse();
      }
      
      if (userQuery.includes('development') || userQuery.includes('growing') || userQuery.includes('size') || userQuery.includes('week')) {
        return fallbackResponses.get('development') || getFallbackResponse();
      }
      
      if (userQuery.includes('sleep') || userQuery.includes('rest') || userQuery.includes('tired') || userQuery.includes('insomnia')) {
        return fallbackResponses.get('sleep') || getFallbackResponse();
      }
    }
    
    // Try to use the API if no keyword match was found
    try {
      // Include the system message at the beginning if it's not already there
      const completeMessages = messages[0]?.role === 'system' 
        ? messages 
        : [{ role: 'system', content: SYSTEM_MESSAGE }, ...messages];
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Using GPT-4o model
          messages: completeMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        // If API quota is exceeded or other error, use fallback
        return getFallbackResponse();
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      // If API call fails, use fallback
      return getFallbackResponse();
    }
  } catch (error) {
    console.error('Error in AI response system:', error);
    return getFallbackResponse();
  }
};

// Function to get a generic fallback response when no specific topic is matched
function getFallbackResponse(): string {
  const fallbackResponses = [
    "I understand you have a question about your pregnancy. While I'd like to provide specific information, I recommend discussing this with your healthcare provider for personalized advice. They can offer guidance tailored to your specific situation.",
    
    "Thank you for your question about pregnancy. This is an important topic to discuss with your healthcare provider who can give you personalized advice based on your medical history and current condition.",
    
    "That's a great question about pregnancy. For the most accurate and personalized information, I recommend consulting with your healthcare provider. They can provide guidance specific to your situation.",
    
    "Pregnancy brings many questions, and it's important to get accurate information. Your healthcare provider is the best resource for personalized advice about your specific situation.",
    
    "I appreciate your question about pregnancy. For the most reliable information, please consult with your healthcare provider who can give you guidance based on your individual needs and medical history."
  ];
  
  // Return a random fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}
