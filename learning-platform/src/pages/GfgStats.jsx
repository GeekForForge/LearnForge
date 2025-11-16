import React, { useEffect, useState } from "react";
import { Cpu, Target } from "lucide-react";
import useAuth from "../context/AuthContext"; // Make sure this path is correct
import ApiService from "../services/api"; // Make sure this path is correct

// Helper function to extract handle from GFG URL
const extractGfgHandle = (url) => {
    if (!url) return null;
    try {
        // Updated regex to be more flexible (handles /user/ and /auth.geeksforgeeks.org/user/)
        const match = url.match(/geeksforgeeks\.org\/user\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
};

const GfgStats = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [gfgHandle, setGfgHandle] = useState(null);

    // 1. Set the handle based on the user's gfgUrl
    useEffect(() => {
        const handle = extractGfgHandle(user?.gfgUrl);
        setGfgHandle(handle);
    }, [user?.gfgUrl]);

    // 2. Fetch stats when the handle is available
    useEffect(() => {
        let mounted = true;
        const fetchMetrics = async () => {
            setError("");
            if (!gfgHandle) {
                setMetrics(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // Try cached stats
                const data = await ApiService.getGfgMetrics(gfgHandle);
                if (!mounted) return;
                setMetrics(data);
            } catch (err) {
                try {
                    // If error, try force-refresh
                    const syncRes = await ApiService.syncGfgMetrics(gfgHandle);
                    if (!mounted) return;
                    setMetrics(syncRes);
                } catch (e) {
                    if (mounted) {
                        setError("Failed to load GFG stats. Check handle or try again.");
                        setMetrics(null);
                    }
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchMetrics();
        return () => { mounted = false; };
    }, [gfgHandle]);

    if (!gfgHandle) {
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-green-500/30 text-center">
                <Cpu size={36} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-bold text-white">GFG Not Connected</h3>
                <p className="text-gray-400">
                    Connect your GeeksforGeeks URL in Settings.
                </p>
                {/* ^^^ THIS WAS THE FIX: It was 'p>' before, now it's '</p>' ^^^ */}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-green-500/30 text-center">
                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-300">
                    Loading stats for <span className="font-semibold text-green-400">{gfgHandle}</span>...
                </p>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="text-center p-6 bg-gray-900 rounded-3xl border border-red-500/30">
                <Target size={36} className="mx-auto mb-4 text-red-400" />
                <p className="text-red-400">{error || `Could not load stats for ${gfgHandle}`}</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
                GeeksforGeeks Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        {metrics.totalProblemsSolved || 0}
                    </div>
                    <div className="text-sm text-gray-300">Total Solved</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">{metrics.easy || 0}</div>
                    <div className="text-sm text-gray-300">Easy</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">{metrics.medium || 0}</div>
                    <div className="text-sm text-gray-300">Medium</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-red-400">{metrics.hard || 0}</div>
                    <div className="text-sm text-gray-300">Hard</div>
                </div>
            </div>
        </div>
    );
};

export default GfgStats;