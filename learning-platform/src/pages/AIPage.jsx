import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap, Trash2, StopCircle, RefreshCw, AlertTriangle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('gemini_model') || 'gemini-1.5-flash');
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const [models, setModels] = useState([
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fastest)' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Smartest)' },
        { id: 'gemini-pro', name: 'Gemini 1.0 Pro (Stable)' },
    ]);

    useEffect(() => {
        const key = localStorage.getItem('gemini_api_key');
        if (key) {
            setApiKey(key);
            fetchModels(key);
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: "Greetings, Traveler. I am the Forge AI. Accessing my neural networks... \n\nHow can I assist you with your coding journey today?"
            }]);
        }
    }, []);

    const fetchModels = async (key) => {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
            if (!response.ok) throw new Error('Failed to fetch models');

            const data = await response.json();

            // Smarter filtering to clean up the list
            const cleanModels = data.models
                .filter(m =>
                    m.supportedGenerationMethods?.includes('generateContent') &&
                    m.name.includes('gemini') &&
                    !m.name.includes('vision') && // Filter out vision-only models if any
                    (m.name.includes('pro') || m.name.includes('flash'))
                )
                .map(m => {
                    const id = m.name.replace('models/', '');
                    let friendlyName = m.displayName;

                    if (id.includes('flash')) friendlyName += ' (Fast)';
                    if (id.includes('pro')) friendlyName += ' (Smart)';

                    return { id, name: friendlyName };
                });

            if (cleanModels.length > 0) {
                // Deduplicate by ID
                const uniqueModels = Array.from(new Map(cleanModels.map(item => [item.id, item])).values());
                setModels(uniqueModels);

                // Keep selection if valid, otherwise default to first
                if (!uniqueModels.find(m => m.id === selectedModel)) {
                    setSelectedModel(uniqueModels[0].id);
                    localStorage.setItem('gemini_model', uniqueModels[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch models:', error);
            // Fallback is already set in initial state
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleModelChange = (modelId) => {
        setSelectedModel(modelId);
        localStorage.setItem('gemini_model', modelId);
        setShowModelDropdown(false);
    };

    useEffect(() => {
        // Smart auto-scroll: Only if it's a new message from USER.
        // For AI messages, we let them simply appear so the user starts reading from the top
        // instead of being yanked to the bottom of a potentially long message.
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                scrollToBottom();
            }
            // Logic for AI messages intentionally removed to prevent "jumping to end"
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const userInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to fetch response');
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't process that request.";

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: aiText
            }]);

        } catch (error) {
            console.error('API Error:', error);
            let errorMessage = `Connection error (${selectedModel}).`;

            if (error.message.includes('API_KEY_INVALID')) errorMessage = "Invalid API Key. Please check settings.";
            else if (error.message.includes('404')) errorMessage = "Model not available. Try switching models.";
            else if (error.message.includes('quota')) errorMessage = "API Quota Exceeded.";

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'error', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!apiKey) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center p-4 bg-gradient-to-b from-transparent to-black/40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
                >
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                        <Bot size={32} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-orbitron">AI Assistant</h2>
                    <p className="text-gray-400 mb-8 text-sm">Connect your Gemini API Key to access the neural interface.</p>
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <Zap size={18} /> Configure Key
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen pt-16 flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                            <Sparkles size={16} className="text-purple-400" />
                        </div>
                        <h1 className="font-orbitron font-bold text-lg hidden sm:block">Forge AI</h1>
                    </div>

                    {/* Model Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowModelDropdown(!showModelDropdown)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 transition-all"
                        >
                            <span className="max-w-[150px] truncate">{models.find(m => m.id === selectedModel)?.name || selectedModel}</span>
                            <ChevronDown size={14} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showModelDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-64 bg-[#15151a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 max-h-64 overflow-y-auto custom-scrollbar"
                                >
                                    <div className="p-1">
                                        {models.map(model => (
                                            <button
                                                key={model.id}
                                                onClick={() => handleModelChange(model.id)}
                                                className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center gap-3 transition-colors ${selectedModel === model.id
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedModel === model.id ? 'bg-purple-400' : 'bg-gray-600'}`} />
                                                <span className="truncate">{model.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (window.confirm('Clear conversation?')) {
                                setMessages([{
                                    id: Date.now(),
                                    role: 'assistant',
                                    content: "Chat cleared. How can I help you now?"
                                }]);
                            }
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Clear Chat"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth custom-scrollbar relative z-0"
            >
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'user'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : msg.role === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                            {msg.role === 'user' ? <User size={16} /> : msg.role === 'error' ? <AlertTriangle size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                            <div className={`rounded-2xl px-5 py-3.5 text-sm md:text-base leading-7 shadow-lg backdrop-blur-sm border ${msg.role === 'user'
                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-50 rounded-br-none'
                                : msg.role === 'error'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-200'
                                    : 'bg-white/5 border-white/10 text-gray-200 rounded-bl-none'
                                }`}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 max-w-4xl mx-auto"
                    >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-purple-400" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75" />
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} className="h-4" /> {/* Spacer at bottom */}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl shrink-0 z-20">
                <div className="max-w-3xl mx-auto relative">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative bg-[#0a0a0f] rounded-2xl border border-white/10 flex items-center p-1.5 overflow-hidden">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Message Forge AI..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none min-w-0"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-white/10 shrink-0"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Powered by Google Gemini • AI can make mistakes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPage;
