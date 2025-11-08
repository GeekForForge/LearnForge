import React, { useEffect, useState } from "react";
import { Target, Zap, Crown, Star, Medal } from "lucide-react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import useAuth from "../context/AuthContext";
import ApiService from "../services/api";

const LeetCodeStats = () => {
    const { user } = useAuth(); // user?.leetcodeHandle should be present if connected
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const leetcodeHandle = user?.leetcodeHandle;

    // NEW: Refresh stats (force backend fetch) when handle changes
    useEffect(() => {
        let mounted = true;
        const fetchMetrics = async () => {
            setError("");
            if (!leetcodeHandle) {
                setMetrics(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // First try cached stats (GET)
                const data = await ApiService.getLeetCodeMetrics(leetcodeHandle);
                if (!mounted) return;
                setMetrics(data);
            } catch (err) {
                // If error, try force-refresh (POST to /leetcode/sync/{handle})
                try {
                    const syncRes = await ApiService.syncLeetCodeMetrics(leetcodeHandle);
                    if (!mounted) return;
                    setMetrics(syncRes);
                } catch (e) {
                    if (mounted) {
                        setError("Failed to load stats. Check handle or try again.");
                        setMetrics(null);
                    }
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchMetrics();
        return () => {
            mounted = false;
        };
    }, [leetcodeHandle]);

    if (!leetcodeHandle)
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-neon-purple/30 text-center">
                <Target size={36} className="mx-auto mb-4 text-neon-cyan" />
                <h3 className="text-2xl font-bold text-white">LeetCode Not Connected</h3>
                <p className="text-gray-400">
                    Connect your LeetCode handle in Settings to show stats here.
                </p>
            </div>
        );

    if (loading)
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-neon-purple/30 text-center">
                <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-300">
                    Loading stats for <span className="font-semibold text-neon-cyan">{leetcodeHandle}</span>...
                </p>
            </div>
        );

    if (error || !metrics)
        return (
            <div className="text-center p-6 bg-gray-900 rounded-3xl border border-red-500/30">
                <Target size={36} className="mx-auto mb-4 text-red-400" />
                <p className="text-red-400">{error || `Could not load stats for ${leetcodeHandle}`}</p>
                <p className="text-gray-400 text-sm mt-2">
                    Please check the handle in Settings or reconnect.
                </p>
            </div>
        );

    // --- The rest UI (copied from your original) ---
    const heatmapValues = metrics.calendar
        ? Object.keys(metrics.calendar).map((ts) => {
            const date = new Date(parseInt(ts, 10) * 1000);
            return { date: date.toISOString().split("T")[0], count: metrics.calendar[ts] };
        })
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-neon-purple/30">
                <h3 className="text-2xl font-bold text-white mb-4">
                    LeetCode Stats {metrics.handle || leetcodeHandle}
                </h3>
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                        <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            {metrics.totalSolved ?? metrics.total ?? 0}
                        </div>
                        <div className="text-sm text-gray-300">Total Solved</div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold">{metrics.easy ?? metrics.easySolved ?? 0}</div>
                        <div className="text-sm text-gray-300">Easy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold">{metrics.medium ?? metrics.mediumSolved ?? 0}</div>
                        <div className="text-sm text-gray-300">Medium</div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold">{metrics.hard ?? metrics.hardSolved ?? 0}</div>
                        <div className="text-sm text-gray-300">Hard</div>
                    </div>
                </div>
                <div className="bg-black/50 rounded-2xl p-6 border border-white/10 mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="text-yellow-400" size={18} /> Difficulty Breakdown
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{metrics.easy ?? 0}</div>
                            <div className="text-xs text-gray-400">Easy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">{metrics.medium ?? 0}</div>
                            <div className="text-xs text-gray-400">Medium</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">{metrics.hard ?? 0}</div>
                            <div className="text-xs text-gray-400">Hard</div>
                        </div>
                    </div>
                </div>
                <div className="bg-black/50 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        Activity Heatmap
                    </h4>
                    <CalendarHeatmap
                        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                        endDate={new Date()}
                        values={heatmapValues}
                        classForValue={(value) => {
                            if (!value || value.count === 0) return "color-empty";
                            if (value.count >= 5) return "color-github-4";
                            return `color-github-${Math.min(4, value.count)}`;
                        }}
                        tooltipDataAttrs={(value) => {
                            const date = value?.date ? new Date(value.date).toDateString() : "No data";
                            const count = value?.count ? value.count : 0;
                            return { "data-tip": `${date}: ${count} submissions` };
                        }}
                    />
                </div>
            </div>
            {/* Awards & Achievements */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-yellow-500/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Crown className="text-yellow-400" size={28} /> Awards & Achievements
                </h3>
                <div className="text-center mb-6">
                    <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                        2
                    </div>
                    <p className="text-gray-400 text-sm">Badges Earned</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <Medal className="text-white" size={24} />
                        </div>
                        <div>
                            <div className="text-white font-semibold">Problem Solver</div>
                            <div className="text-yellow-400 text-sm">100+ Questions</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                            <Star className="text-white" size={24} />
                        </div>
                        <div>
                            <div className="text-white font-semibold">Consistency King</div>
                            <div className="text-purple-400 text-sm">7-Day Streak</div>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl">
                    View All Achievements
                </button>
            </div>
        </div>
    );
};

export default LeetCodeStats;
