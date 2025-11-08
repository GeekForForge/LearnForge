// src/pages/SettingsConnectedAccounts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Code, Unlink, CheckCircle, Loader, Link as LinkIcon } from 'lucide-react';

const SettingsConnectedAccounts = () => {
    const { user, updateUser } = useAuth();
    const [handleInput, setHandleInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Sync local input state with user's actual handle
    useEffect(() => {
        if (user?.leetcodeHandle) {
            setHandleInput(user.leetcodeHandle);
        } else {
            setHandleInput('');
        }
    }, [user]);

    const saveHandle = async (e) => {
        e?.preventDefault?.();
        if (!user) return;

        const trimmed = handleInput.trim();
        if (!trimmed) {
            toast.error('Please enter a valid handle.');
            return;
        }

        setIsSaving(true);
        try {
            const success = await updateUser({
                leetcodeHandle: trimmed
            });

            if (success) {
                toast.success('LeetCode handle connected.');
            } else {
                toast.error('Failed to connect LeetCode handle.');
            }
        } catch (err) {
            console.error('Error saving handle', err);
            toast.error('Failed to save handle.');
        } finally {
            setIsSaving(false);
        }
    };

    const removeHandle = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const success = await updateUser({
                leetcodeHandle: null
            });

            if (success) {
                setHandleInput('');
                toast.success('LeetCode handle disconnected.');
            } else {
                toast.error('Failed to disconnect handle.');
            }
        } catch (err) {
            console.error('Error removing handle', err);
            toast.error('Failed to remove handle.');
        } finally {
            setIsSaving(false);
        }
    };

    const isConnected = !!user?.leetcodeHandle;

    return (
        <div className={`p-6 rounded-xl border transition-all duration-300 ${isConnected ? 'border-green-500/30 bg-green-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                        <Code size={24} className={isConnected ? 'text-green-500' : 'text-orange-500'} />
                    </div>
                    <div>
                        <h4 className="font-medium text-white text-lg">LeetCode</h4>
                        <p className="text-sm text-gray-400">
                            {isConnected
                                ? <span className="text-green-400 font-medium">Connected as: {user.leetcodeHandle}</span>
                                : 'Sync your problems and stats'}
                        </p>
                    </div>
                </div>

                {isConnected ? (
                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 font-medium rounded-lg border border-green-500/30 flex items-center gap-2">
                            <CheckCircle size={16} />
                            Connected
                        </span>
                        <button
                            type="button"
                            onClick={removeHandle}
                            disabled={isSaving}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Disconnect"
                        >
                            {isSaving ? <Loader className="animate-spin" size={20} /> : <Unlink size={20} />}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={saveHandle} className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                                <LinkIcon size={16} />
                            </div>
                            <input
                                type="text"
                                value={handleInput}
                                onChange={(e) => setHandleInput(e.target.value)}
                                placeholder="Enter LeetCode Username"
                                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving || !handleInput.trim()}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-orange-500 flex items-center justify-center min-w-[100px]"
                        >
                            {isSaving ? <Loader className="animate-spin" size={18} /> : 'Connect'}
                        </button>
                    </form>
                )}
            </div>
            <ToastContainer theme="dark" position="bottom-right" autoClose={2000} hideProgressBar toastStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
        </div>
    );
};

export default SettingsConnectedAccounts;