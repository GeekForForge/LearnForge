import React, { useEffect, useState } from "react";
import { Award, Target } from "lucide-react";
import useAuth from "../context/AuthContext";
import ApiService from "../services/api";

// Helper function to extract handle from CodeChef URL
const extractCodeChefHandle = (url) => {
    if (!url) return null;
    try {
        const match = url.match(/codechef\.com\/users\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
};

const CodeChefStats = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [codeChefHandle, setCodeChefHandle] = useState(null);

    // 1. Set the handle based on the user's codechefUrl
    useEffect(() => {
        const handle = extractCodeChefHandle(user?.codechefUrl);
        setCodeChefHandle(handle);
    }, [user?.codechefUrl]);

    // 2. Fetch stats when the handle is available
    useEffect(() => {
        let mounted = true;
        const fetchMetrics = async () => {
            setError("");
            if (!codeChefHandle) {
                setMetrics(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await ApiService.getCodeChefMetrics(codeChefHandle);
                if (!mounted) return;
                setMetrics(data);
            } catch (err) {
                try {
                    const syncRes = await ApiService.syncCodeChefMetrics(codeChefHandle);
                    if (!mounted) return;
                    setMetrics(syncRes);
                } catch (e) {
                    if (mounted) {
                        setError("Failed to load CodeChef stats. Check handle or try again.");
                        setMetrics(null);
                    }
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchMetrics();
        return () => { mounted = false; };
    }, [codeChefHandle]);

    if (!codeChefHandle) {
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-yellow-500/30 text-center">
                <Award size={36} className="mx-auto mb-4 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">CodeChef Not Connected</h3>
                <p className="text-gray-400">
                    Connect your CodeChef URL in Settings.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-yellow-500/30 text-center">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-300">
                    Loading stats for <span className="font-semibold text-yellow-400">{codeChefHandle}</span>...
                </p>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="text-center p-6 bg-gray-900 rounded-3xl border border-red-500/30">
                <Target size={36} className="mx-auto mb-4 text-red-400" />
                <p className="text-red-400">{error || `Could not load stats for ${codeChefHandle}`}</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
                CodeChef Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                        {metrics.currentRating || 0}
                    </div>
                    <div className="text-sm text-gray-300">Rating</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold">{metrics.highestRating || 0}</div>
                    <div className="text-sm text-gray-300">Highest</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold">{metrics.globalRank || 0}</div>
                    <div className="text-sm text-gray-300">Global Rank</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold">{metrics.stars || "0★"}</div>
                    <div className="text-sm text-gray-300">Stars</div>
                </div>
            </div>
        </div>
    );
};

export default CodeChefStats;