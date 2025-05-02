import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, Surface, useTheme, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAIResponse, ChatMessage } from '../services/openaiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistantScreen = () => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your pregnancy assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  // Reference to the scroll view to auto-scroll to bottom
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (message.trim()) {
      // Add user message to chat
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setIsTyping(true);
      
      try {
        // Convert our messages to the format expected by OpenAI
        const chatMessages: ChatMessage[] = messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));
        
        // Add the new user message
        chatMessages.push({
          role: 'user',
          content: newMessage.text
        });
        
        // Get response from OpenAI
        const aiResponseText = await getAIResponse(chatMessages);
        
        // Add AI response to chat
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        // Handle error
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I encountered an error. Please try again later.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
        console.error('Error getting AI response:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const renderSuggestions = () => {
    const categories = [
      {
        title: 'Nutrition',
        questions: [
          'What foods should I eat during pregnancy?',
          'How much water should I drink daily?',
          'Which vitamins are essential?'
        ]
      },
      {
        title: 'Health & Safety',
        questions: [
          'Is it safe to exercise?',
          'What symptoms are concerning?',
          'How much sleep do I need?'
        ]
      },
      {
        title: 'Baby Development',
        questions: [
          'What size is my baby this week?',
          'When will I feel the first kick?',
          'How is my baby developing?'
        ]
      },
      {
        title: 'Wellness',
        questions: [
          'How to manage morning sickness?',
          'Tips for better sleep',
          'Managing pregnancy stress'
        ]
      }
    ];

    return (
      <View style={styles.suggestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, categoryIndex) => (
            <Card key={categoryIndex} style={styles.categoryCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.categoryTitle}>
                  {category.title}
                </Text>
                {category.questions.map((question, questionIndex) => (
                  <Button
                    key={questionIndex}
                    mode="text"
                    onPress={() => setMessage(question)}
                    style={styles.questionButton}
                    labelStyle={styles.questionButtonLabel}
                  >
                    {question}
                  </Button>
                ))}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <Surface style={styles.avatar}>
          <MaterialCommunityIcons
            name="robot"
            size={24}
            color={theme.colors.primary}
          />
        </Surface>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
            ]}
          >
            {!msg.isUser && (
              <Surface style={styles.avatar}>
                <MaterialCommunityIcons
                  name="robot"
                  size={24}
                  color={theme.colors.primary}
                />
              </Surface>
            )}
            <View
              style={[
                styles.message,
                msg.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text style={msg.isUser ? styles.userMessageText : styles.aiMessageText}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
        {renderTypingIndicator()}
      </ScrollView>

      {renderSuggestions()}

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your question..."
          style={styles.input}
          mode="outlined"
          disabled={isTyping}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSend}
              disabled={!message.trim() || isTyping}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#7C4DFF',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#000',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: '#fff',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoryCard: {
    marginHorizontal: 8,
    minWidth: 280,
    maxWidth: 280,
    marginVertical: 4,
    elevation: 2,
  },
  categoryTitle: {
    color: '#7C4DFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    marginVertical: 2,
  },
  questionButtonLabel: {
    fontSize: 14,
    color: '#666',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginLeft: 8,
  },
  typingDots: {
    flexDirection: 'row',
    width: 32,
    justifyContent: 'space-between',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    opacity: 0.6,
  },
  dot1: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
  },
  dot2: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.2s',
    animationIterationCount: 'infinite',
  },
  dot3: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.4s',
    animationIterationCount: 'infinite',
  },
});

export default AIAssistantScreen;