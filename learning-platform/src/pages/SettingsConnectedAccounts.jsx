// src/pages/SettingsConnectedAccounts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsConnectedAccounts = () => {
    const { user, fetchUser, updateUser } = useAuth();
    const [handleInput, setHandleInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.leetcodeHandle) setHandleInput(user.leetcodeHandle);
        else setHandleInput('');
    }, [user]);

    const saveHandle = async (e) => {
        e?.preventDefault?.();
        if (!user) return;
        setIsSaving(true);
        try {
            const payload = { leetcodeHandle: handleInput && handleInput.trim() ? handleInput.trim() : null };
            // call backend
            await ApiService.updateUser(user.userId, payload);

            // optimistic UI
            updateUser({ leetcodeHandle: payload.leetcodeHandle });

            // authoritative refresh
            await fetchUser();

            toast.success('LeetCode handle saved.');
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
            await ApiService.updateUser(user.userId, { leetcodeHandle: null });
            updateUser({ leetcodeHandle: null });
            await fetchUser();
            setHandleInput('');
            toast.success('LeetCode handle removed.');
        } catch (err) {
            console.error('Error removing handle', err);
            toast.error('Failed to remove handle.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Connected Accounts</h2>

            <form onSubmit={saveHandle} className="flex flex-col md:flex-row gap-3 items-center">
                <input
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    placeholder="Your LeetCode Handle"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-neon-cyan"
                />
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                    type="button"
                    onClick={removeHandle}
                    disabled={isSaving || !user?.leetcodeHandle}
                    className="px-4 py-3 bg-white/5 rounded-xl text-white hover:bg-white/10 disabled:opacity-50"
                >
                    Remove
                </button>
            </form>

            <p className="text-sm text-gray-400 mt-4">After saving, your profile page will show your LeetCode stats automatically.</p>

            <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar />
        </div>
    );
};

export default SettingsConnectedAccounts;
