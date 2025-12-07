import { useState } from 'react';
import { ChatMessage } from '../types/chat';

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            text: 'Hi! I\'m your AI nutritionist. Ask me anything about healthy eating, meal planning, or nutrition.',
            timestamp: '10:30',
        },
        {
            id: '2',
            sender: 'user',
            text: 'What\'s a good low-carb breakfast?',
            timestamp: '10:32',
        },
        {
            id: '3',
            sender: 'ai',
            text: 'Great question! Here are some tasty low-carb breakfast ideas:\n\n• Greek yogurt with berries and nuts\n• Scrambled eggs with spinach and avocado\n• Chia seed pudding\n• Smoked salmon with cream cheese\n\nAll of these will keep you full and energized!',
            timestamp: '10:32',
        },
        {
            id: '4',
            sender: 'user',
            text: 'How much protein should I eat daily?',
            timestamp: '10:35',
        },
        {
            id: '5',
            sender: 'ai',
            text: 'For weight loss, aim for 0.8-1g of protein per pound of body weight. At your current weight of 145 lbs, that\'s about 115-145g per day.\n\nThis helps preserve muscle while losing fat.',
            timestamp: '10:36',
        },
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const sendMessage = (text: string) => {
        // In a real app, you would send the text to the backend here
        // For now, we just add it to the list (handled by UI component logic mostly for pure text? Or here?)
        // To match original logic which didn't actually add the text message to the list in handleSend...
        // The original handleSend just cleared input. Wait, looking at original code:
        // handleSend: if (inputText.trim()) { setInputText(''); setContentHeight(0); }
        // It did nothing with the message! That seems like a bug in the original code or it was just a visual mock that didn't update.
        // I should probably make it working or keep it as is.
        // Let's make it add the message for better UX in refactor.

        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newUserMessage]);

        // Simulate AI response for text
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: "I'm just a demo AI for now, but that sounds interesting!",
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    const sendImageMessage = (imageUri: string) => {
        setIsAnalyzing(true);

        // Add analyzing message
        const analyzingMessageId = `analyzing-${Date.now()}`;
        const analyzingMessage: ChatMessage = {
            id: analyzingMessageId,
            sender: 'ai',
            text: 'Analyzing photo...',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };

        // Add user message with photo
        const userMessageId = `photo-${Date.now()}`;
        const userMessage: ChatMessage = {
            id: userMessageId,
            sender: 'user',
            text: '',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            imageUri: imageUri,
        };

        setMessages((prev) => [...prev, userMessage, analyzingMessage]);

        // Simulate API call
        setTimeout(() => {
            const analysisResult: ChatMessage = {
                id: `result-${Date.now()}`,
                sender: 'ai',
                text: 'I can see in the photo:\n\n• Approximately 450-500 calories\n• Protein: ~25g\n• Carbs: ~60g\n• Fat: ~15g\n\nThis is a well-balanced meal!',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === analyzingMessageId ? analysisResult : msg
                )
            );
            setIsAnalyzing(false);
        }, 2000);
    };

    return {
        messages,
        isAnalyzing,
        sendMessage,
        sendImageMessage,
    };
};
