import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Star, Clock, Filter, SortAsc, Building2, ExternalLink, XCircle, Sparkles, CheckCircle, Circle } from 'lucide-react';
import Papa from 'papaparse';


const API_BASE = 'http://localhost:8080';
const companyNames = ["AMD", "Cohesity", "GSN Games", "LTI", "AQR Capital Management", "Coinbase", "Gameskraft",
    "Larsen & Toubro", "Accenture", "Comcast", "Garmin", "Lendingkart Technologies", "Accolite",
    "Commvault", "Geico", "Lenskart", "Acko", "Compass", "General Motors", "Licious", "Activision",
    "Confluent", "Genpact", "Liftoff", "Adobe", "ConsultAdd", "GoDaddy", "LinkedIn", "Affirm",
    "Coupang", "Gojek", "LiveRamp", "Agoda", "Coursera", "Goldman Sachs", "Lowe's", "Airbnb",
    "Coveo", "Google", "Lucid", "Airbus SE", "Credit Karma", "Grab", "Luxoft", "Airtel", "Criteo",
    "Grammarly", "Lyft", "Airwallex", "CrowdStrike", "Graviton", "MAQ Software", "Akamai", "Cruise",
    "Groupon", "MSCI", "Akuna Capital", "CureFit", "Groww", "Machine Zone", "Alibaba", "DE Shaw",
    "Grubhub", "MakeMyTrip", "Altimetrik", "DP world", "Guidewire", "Mapbox", "Amadeus", "DRW",
    "Gusto", "Mastercard", "Amazon", "DXC Technology", "HCL", "MathWorks", "Amdocs", "Darwinbox",
    "HP", "McKinsey", "American Express", "Databricks", "HPE", "Media.net", "Analytics quotient",
    "Datadog", "HSBC", "Meesho", "Anduril", "Dataminr", "Harness", "Mercari", "Aon", "Delhivery",
    "HashedIn", "Meta", "Apollo.io", "Deliveroo", "Hertz", "Microsoft", "AppDynamics", "Dell",
    "HiLabs", "Microstrategy", "AppFolio", "Deloitte", "Highspot", "Millennium", "Apple",
    "DeltaX", "Hive", "MindTree", "Applied Intuition", "Deutsche Bank", "Hiver", "Mindtickle",
    "Arcesium", "DevRev", "Honeywell", "Miro", "Arista Networks", "Devsinc", "Hotstar", "Mitsogo",
    "Asana", "Devtron", "Houzz", "Mixpanel", "Atlassian", "Directi", "Huawei", "Mobileye",
    "Attentive", "Disney", "Hubspot", "Moengage", "Audible", "Docusign", "Hudson River Trading",
    "Moloco", "Aurora", "DoorDash", "Hulu", "MongoDB", "Autodesk", "Dream11", "IBM", "Morgan Stanley",
    "Avalara", "Dropbox", "IIT Bombay", "Mountblue", "Avito", "Druva", "IMC", "Moveworks", "Axon",
    "Dunzo", "INDmoney", "Myntra", "BILL Holdings", "Duolingo", "IVP", "NCR", "BNY Mellon",
    "EPAM Systems", "IXL", "Nagarro", "BP", "EY", "InMobi", "National Instruments", "Baidu",
    "EarnIn", "Indeed", "National Payments Corporation of India", "Bank of America", "Edelweiss Group",
    "Info Edge", "Navan", "Barclays", "Electronic Arts", "Informatica", "Navi", "Bentley Systems",
    "Epic Systems", "Infosys", "NetApp", "BharatPe", "Expedia", "Instacart", "NetEase", "BitGo",
    "FPT", "Intel", "Netflix", "BlackRock", "FactSet", "Intuit", "Netskope", "BlackStone", "Faire",
    "J.P. Morgan", "Netsuite", "Blizzard", "Fastenal", "Jane Street", "Nextdoor", "Block", "Fidelity",
    "Jump Trading", "Niantic", "Bloomberg", "Fiverr", "Juniper Networks", "Nielsen", "Bolt", "Flexera",
    "Juspay", "Nike", "Booking.com", "Flexport", "KLA", "NinjaCart", "Bosch", "Flipkart", "Kakao",
    "Nokia", "Box", "Fortinet", "Karat", "Nordstrom", "Braze", "Freecharge", "Komprise", "Notion",
    "Brex", "FreshWorks", "LINE", "Nuro", "Bridgewater Associates", "GE Digital", "Nutanix",
    "ByteDance", "GE Healthcare", "Nvidia", "CARS24", "GSA Capital", "Nykaa", "CEDCOSS", "OKX",
    "CME Group", "Odoo", "CRED", "Okta", "CTC", "Ola Cabs", "CVENT", "OpenAI", "Cadence", "Opendoor",
    "Canonical", "Optiver", "Capgemini", "Optum", "Capital One", "Oracle", "Careem", "Otter.ai",
    "Cashfree", "Ozon", "Celigo", "Palantir Technologies", "Chewy", "Palo Alto Networks", "Chime",
    "Patreon", "Circle", "PayPal", "Cisco", "PayPay", "Citadel", "PayU", "Citigroup", "Paycom",
    "Citrix", "Paytm", "Clari", "Peloton", "Cleartrip", "PhonePe", "Cloudera", "Pinterest",
    "Cloudflare", "Pocket Gems", "Coforge", "Point72", "Cognizant", "Pony.ai", "PornHub", "Poshmark",
    "Postmates", "PubMatic", "Publicis Sapient", "Pure Storage", "Pwc", "QBurst", "Qualcomm",
    "Qualtrics", "Quora", "RBC", "Rakuten", "Reddit", "Remitly", "Revolut", "Riot Games", "Ripple",
    "Rippling", "Rivian", "Robinhood", "Roblox", "Roche", "Rokt", "Roku", "Rubrik", "SAP", "SIG",
    "SOTI", "Salesforce", "Samsara", "Samsung", "Scale AI", "Sentry", "ServiceNow", "ShareChat",
    "Shopee", "Shopify", "Siemens", "Sigmoid", "Slice", "Smartsheet", "Snap", "Snapdeal", "Snowflake",
    "SoFi", "Societe Generale", "Softwire", "Sony", "SoundHound", "Splunk", "Spotify", "Sprinklr",
    "Squarepoint Capital", "Squarespace", "StackAdapt", "Stackline", "Stripe", "Sumo Logic", "Swiggy",
    "Synopsys", "Tanium", "Target", "Tech Mahindra", "Tejas Networks", "Tekion", "Tencent", "Teradata",
    "Tesco", "Tesla", "Texas Instruments", "The Trade Desk", "Thomson Reuters", "ThoughtWorks",
    "ThousandEyes", "Tiger Analytics", "TikTok", "Tinder", "Tinkoff", "Toast", "Toptal",
    "Tower Research Capital", "Trexquant", "Trilogy", "Tripadvisor", "TuSimple", "Turing", "Turo",
    "Turvo", "Twilio", "Twitch", "Two Sigma", "UBS", "UKG", "USAA", "Uber", "UiPath", "Unity",
    "Upstart", "Urban Company", "VK", "VMware", "Valve", "Vanguard", "Veeva Systems", "Verily",
    "Veritas", "Verkada", "Vimeo", "Virtu Financial", "Virtusa", "Visa", "Walmart Labs", "Warnermedia",
    "WatchGuard", "Wayfair", "Waymo", "WeRide", "Wealthfront", "Wells Fargo", "Western Digital",
    "Whatnot", "WinZO", "Wipro", "Wise", "Wish", "Wissen Technology", "Wix", "Workday",
    "Works Applications", "WorldQuant", "X", "Yahoo", "Yandex", "Yelp", "Yext", "ZS Associates",
    "ZScaler", "Zalando", "Zendesk", "Zenefits", "Zepto", "Zeta", "Zillow", "ZipRecruiter", "Zluri",
    "Zoho", "Zomato", "Zoom", "Zoox", "Zopsmart", "Zynga", "athenahealth", "blinkit", "carwale",
    "ciena", "eBay", "fourkites", "instabase", "jio", "josh technology"].sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()));

const colorThemes = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-blue-500",
    "from-rose-500 to-pink-500"
];

const sanitizeFileName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

const companies = companyNames.map((name, i) => ({
    name,
    file: `/leetcode/companies/${sanitizeFileName(name)}.csv`,
    count: 0,
    color: colorThemes[i % colorThemes.length]
}));

const normalizeDifficulty = (diff) => {
    if (!diff) return '';
    const d = diff.trim().toLowerCase();
    if (d === 'easy') return 'Easy';
    if (d === 'medium') return 'Medium';
    if (d === 'hard') return 'Hard';
    return diff.trim();
};

/** Stable hash -> short base36 string (no deps) */
function uidFrom(title, link) {
    const s = `${title || ''}|${link || ''}`;
    let h1 = 0x811c9dc5, h2 = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        h1 ^= c; h1 = (h1 + ((h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24))) >>> 0;
        h2 += c + ((h2 << 5) - h2); h2 ^= h1; h2 >>>= 0;
    }
    return (h1.toString(36) + h2.toString(36)).slice(0, 20);
}

export default function Resources() {
    const [search, setSearch] = useState('');
    const [companySearch, setCompanySearch] = useState('');
    const [activeCompany, setActiveCompany] = useState(companies[0]?.name || '');
    const [questions, setQuestions] = useState([]);
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Frequency');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /** completions: map { [questionUid]: true } */
    const [completedQuestions, setCompletedQuestions] = useState({});

    /** simple local cache key per company (session-based auth) */
    const cacheKey = (slug) => `completed:${slug}`;

    /** Load CSV when company changes */
    useEffect(() => {
        if (!activeCompany) { setQuestions([]); return; }
        const co = companies.find(c => c.name === activeCompany);
        if (!co) { setQuestions([]); return; }

        setLoading(true);
        setError(null);

        fetch(co.file)
            .then(res => {
                if (!res.ok) throw new Error(`File not found: ${co.file}`);
                return res.text();
            })
            .then(csv => {
                if (!csv || csv.trim().length === 0) {
                    setQuestions([]);
                    setError(`No data found for ${activeCompany}`);
                    return;
                }
                const parsed = Papa.parse(csv, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.trim()
                });

                const validQuestions = parsed.data
                    .filter(q => {
                        const title = (q.question || q.Question || q.title || q.Title || '').trim();
                        const link = (q.link || q.Link || q.url || q.URL || '').trim();
                        return title.length > 0 || link.length > 0;
                    })
                    .map((q, idx) => {
                        const title = (q.question || q.Question || q.title || q.Title || '').trim();
                        const link = (q.link || q.Link || q.url || q.URL || '').trim();
                        const uid = (q.id || q.ID || '').toString().trim() || uidFrom(title, link);
                        return {
                            ...q,
                            id: uid, // stable question_uid used by backend
                            difficulty: normalizeDifficulty(q.difficulty || q.Difficulty || q.level || q.Level || ''),
                            question: title,
                            topics: (q.topics || q.Topics || q.tags || q.Tags || '').trim(),
                            link,
                            frequency: (q.frequency || q.Frequency || '0').toString(),
                            acceptance: (q.acceptance || q.Acceptance_Rate || q.acceptance_rate || '0').toString()
                        };
                    });

                setQuestions(validQuestions);
            })
            .catch(() => {
                setQuestions([]);
                setError(`Failed to load ${activeCompany} questions`);
            })
            .finally(() => setLoading(false));

        // clear previous completions to avoid flicker
        setCompletedQuestions({});
    }, [activeCompany]);

    /** Fetch completions from backend after company selection */
    useEffect(() => {
        if (!activeCompany) return;
        const companySlug = sanitizeFileName(activeCompany);

        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/completions/${companySlug}`, {
                    credentials: 'include' // send JSESSIONID cookie
                });
                if (!res.ok) throw new Error('fetch completions failed');
                const data = await res.json(); // { company, completedUids: [] }
                const map = Object.fromEntries((data.completedUids || []).map(u => [u, true]));
                setCompletedQuestions(map);
                localStorage.setItem(cacheKey(companySlug), JSON.stringify(map));
            } catch (e) {
                // fallback to cache if backend unreachable or not logged in
                try {
                    const cached = localStorage.getItem(cacheKey(companySlug));
                    setCompletedQuestions(cached ? JSON.parse(cached) : {});
                } catch {
                    setCompletedQuestions({});
                }
            }
        })();
    }, [activeCompany]);

    /** Toggle + persist (optimistic) */
    const handleMarkComplete = async (question) => {
        const companySlug = sanitizeFileName(activeCompany);
        const qid = question.id;

        // optimistic UI
        setCompletedQuestions(prev => {
            const next = { ...prev };
            if (next[qid]) delete next[qid]; else next[qid] = true;
            return next;
        });

        try {
            await fetch(`${API_BASE}/api/completions/${companySlug}/toggle`, {
                method: 'POST',
                credentials: 'include', // send cookie
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionUid: qid,
                    completed: !completedQuestions[qid],
                    title: question.question,
                    link: question.link
                })
            });

            // sync cache
            const current = JSON.parse(localStorage.getItem(cacheKey(companySlug)) || '{}');
            if (!completedQuestions[qid]) current[qid] = true; else delete current[qid];
            localStorage.setItem(cacheKey(companySlug), JSON.stringify(current));
        } catch (e) {
            // rollback on failure
            setCompletedQuestions(prev => {
                const next = { ...prev };
                if (next[qid]) delete next[qid]; else next[qid] = true;
                return next;
            });
            console.error('Failed to persist toggle', e);
        }
    };

    const filteredCompanies = React.useMemo(() => {
        if (!companySearch) return companies;
        return companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));
    }, [companySearch]);

    const filteredQuestions = React.useMemo(() => {
        let arr = questions;
        if (search) {
            arr = arr.filter(q => {
                const title = q.question.toLowerCase();
                const topics = q.topics.toLowerCase();
                return title.includes(search.toLowerCase()) || topics.includes(search.toLowerCase());
            });
        }
        if (difficultyFilter !== 'All') {
            arr = arr.filter(q => q.difficulty === difficultyFilter);
        }
        arr = arr.slice().sort((a, b) => {
            if (sortBy === 'Frequency') {
                return (parseFloat(b.frequency) || 0) - (parseFloat(a.frequency) || 0);
            }
            if (sortBy === 'Acceptance_Rate') {
                return (parseFloat(b.acceptance) || 0) - (parseFloat(a.acceptance) || 0);
            }
            if (sortBy === 'Difficulty') {
                const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
            }
            return 0;
        });
        return arr;
    }, [questions, search, difficultyFilter, sortBy]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    const getTimeEstimate = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '15-25 mins';
            case 'Medium': return '30-45 mins';
            case 'Hard': return '45-60 mins';
            default: return '30 mins';
        }
    };

    const difficultyStats = React.useMemo(() => {
        const stats = { Easy: 0, Medium: 0, Hard: 0 };
        filteredQuestions.forEach(q => {
            if (q.difficulty in stats) stats[q.difficulty]++;
        });
        return stats;
    }, [filteredQuestions]);

    const completedCount = React.useMemo(
        () => filteredQuestions.filter(q => completedQuestions[q.id]).length,
        [filteredQuestions, completedQuestions]
    );

    const progressPercentage = filteredQuestions.length > 0
        ? Math.round((completedCount / filteredQuestions.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-transparent pt-16 px-3 sm:px-5 lg:px-6 pb-4">
            <div className="max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-neon-cyan" />
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                            Interview Resources
                        </h1>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">Master coding interviews with curated problems from top tech companies</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-180px)]">
                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 className="w-5 h-5 text-neon-cyan" />
                                    <h3 className="text-white font-bold text-base">Companies</h3>
                                    <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                    {filteredCompanies.length}
                  </span>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        className="w-full bg-white/10 text-white rounded-lg pl-9 pr-3 py-2 border border-white/10 focus:border-neon-cyan focus:outline-none text-sm placeholder-gray-400"
                                        placeholder="Search companies..."
                                        value={companySearch}
                                        onChange={e => setCompanySearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar" data-lenis-prevent style={{ overscrollBehavior: 'contain' }}>
                                <div className="space-y-2">
                                    {filteredCompanies.map((company) => (
                                        <div
                                            key={company.name}
                                            onClick={() => setActiveCompany(company.name)}
                                            className={`group relative py-2.5 px-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                                                activeCompany === company.name
                                                    ? `bg-gradient-to-r ${company.color} border-transparent shadow-lg`
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${company.color} ${activeCompany === company.name ? 'animate-pulse' : ''}`} />
                                                <span className={`font-medium text-[13px] truncate ${
                                                    activeCompany === company.name ? 'text-white' : 'text-gray-200 group-hover:text-white'
                                                }`}>
                          {company.name}
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full flex flex-col overflow-hidden">
                            <div className="flex-shrink-0 p-4 border-b border-white/10 bg-gradient-to-r from-neon-purple/5 to-neon-cyan/5">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-bold text-white mb-0.5 flex items-center gap-2">
                                            {activeCompany}
                                            <span className="text-xs font-normal text-gray-400">Interview Questions</span>
                                        </h2>
                                        <p className="text-gray-400 text-xs">
                                            {filteredQuestions.length} questions • {completedCount} completed ({progressPercentage}%)
                                        </p>
                                        {filteredQuestions.length > 0 && (
                                            <div className="mt-2 max-w-md">
                                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                                    <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="px-2.5 py-1.5 bg-green-400/10 border border-green-400/20 rounded-md">
                                            <div className="text-green-400 text-[10px] font-semibold">Easy</div>
                                            <div className="text-white font-bold text-sm">{difficultyStats.Easy}</div>
                                        </div>
                                        <div className="px-2.5 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-md">
                                            <div className="text-yellow-400 text-[10px] font-semibold">Medium</div>
                                            <div className="text-white font-bold text-sm">{difficultyStats.Medium}</div>
                                        </div>
                                        <div className="px-2.5 py-1.5 bg-red-400/10 border border-red-400/20 rounded-md">
                                            <div className="text-red-400 text-[10px] font-semibold">Hard</div>
                                            <div className="text-white font-bold text-sm">{difficultyStats.Hard}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            className="w-full bg-white/10 text-white rounded-lg pl-9 pr-3 py-2 border border-white/10 focus:border-neon-purple focus:outline-none text-sm placeholder-gray-400"
                                            placeholder="Search by title or topic..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                        <select
                                            value={difficultyFilter}
                                            onChange={e => setDifficultyFilter(e.target.value)}
                                            className="appearance-none bg-white/10 text-white rounded-lg pl-8 pr-8 py-2 border border-white/10 focus:border-neon-cyan focus:outline-none text-sm font-medium cursor-pointer hover:bg-white/15 transition-all"
                                        >
                                            <option value="All" className="bg-gray-900">All Difficulties</option>
                                            <option value="Easy" className="bg-gray-900">Easy</option>
                                            <option value="Medium" className="bg-gray-900">Medium</option>
                                            <option value="Hard" className="bg-gray-900">Hard</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                        <select
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="appearance-none bg-white/10 text-white rounded-lg pl-8 pr-8 py-2 border border-white/10 focus:border-neon-cyan focus:outline-none text-sm font-medium cursor-pointer hover:bg-white/15 transition-all"
                                        >
                                            <option value="Frequency" className="bg-gray-900">By Frequency</option>
                                            <option value="Acceptance_Rate" className="bg-gray-900">By Acceptance</option>
                                            <option value="Difficulty" className="bg-gray-900">By Difficulty</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" data-lenis-prevent style={{ overscrollBehavior: 'contain' }}>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <p className="text-white text-base">Loading questions...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                            <XCircle className="w-8 h-8 text-red-400" />
                                        </div>
                                        <p className="text-red-400 text-base font-medium mb-1">{error}</p>
                                        <p className="text-gray-500 text-xs">The CSV file might be missing or incorrectly named</p>
                                    </div>
                                ) : filteredQuestions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-400 text-base font-medium mb-1">No questions found</p>
                                        <p className="text-gray-500 text-xs">Try adjusting your search or filters</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {filteredQuestions.map((q, idx) => {
                                            const isCompleted = !!completedQuestions[q.id];
                                            return (
                                                <div
                                                    key={q.id}
                                                    className={`group rounded-lg p-4 border transition-all ${
                                                        isCompleted
                                                            ? 'bg-green-500/5 border-green-500/20'
                                                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-neon-cyan/30'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleMarkComplete(q); }}
                                                            className="cursor-pointer flex-shrink-0 mt-0.5"
                                                            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle size={20} className="text-green-400" />
                                                            ) : (
                                                                <Circle size={20} className="text-gray-500 hover:text-gray-300 transition-colors" />
                                                            )}
                                                        </button>

                                                        <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-md flex items-center justify-center text-white font-bold text-xs">
                                                            {idx + 1}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                                <h3
                                                                    onClick={() => q.link && window.open(q.link, "_blank")}
                                                                    className="text-[15px] font-semibold text-white group-hover:text-neon-cyan transition-colors flex items-center gap-1.5 cursor-pointer truncate"
                                                                    title={q.question || 'Untitled Question'}
                                                                >
                                                                    {q.question || 'Untitled Question'}
                                                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                                </h3>
                                                                {q.difficulty && (
                                                                    <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyColor(q.difficulty)}`}>
                                    {q.difficulty}
                                  </span>
                                                                )}
                                                            </div>

                                                            {q.topics && (
                                                                <p className="text-gray-400 text-xs mb-2 line-clamp-1">{q.topics}</p>
                                                            )}

                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                                                                    {q.frequency && parseFloat(q.frequency) > 0 && (
                                                                        <div className="flex items-center gap-1.5 text-blue-400">
                                                                            <TrendingUp size={13} />
                                                                            <span className="font-medium">{parseFloat(q.frequency).toFixed(1)}% frequency</span>
                                                                        </div>
                                                                    )}
                                                                    {q.acceptance && parseFloat(q.acceptance) > 0 && (
                                                                        <div className="flex items-center gap-1.5 text-yellow-400">
                                                                            <Star size={13} />
                                                                            <span className="font-medium">{parseFloat(q.acceptance).toFixed(1)}% accepted</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-1.5 text-purple-400">
                                                                        <Clock size={13} />
                                                                        <span className="font-medium">{getTimeEstimate(q.difficulty)}</span>
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleMarkComplete(q); }}
                                                                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all border text-xs ${
                                                                        isCompleted
                                                                            ? 'bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30'
                                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20 hover:border-white/30'
                                                                    }`}
                                                                >
                                                                    {isCompleted ? (<><CheckCircle size={14} /> Done</>) : (<><Circle size={14} /> Mark</>)}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Custom Scrollbar Styling */}
            <style jsx>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(124, 58, 237, 0.6) rgba(255, 255, 255, 0.05);
                    overscroll-behavior: contain;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, rgba(139, 92, 246, 0.7), rgba(6, 182, 212, 0.7));
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, rgba(139, 92, 246, 0.9), rgba(6, 182, 212, 0.9));
                }
                select option { background-color: #1a1a2e; color: white; }
            `}</style>
        </div>
    );
}
