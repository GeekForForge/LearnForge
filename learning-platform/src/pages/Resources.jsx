import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Star, Filter, SortAsc, Building2, ExternalLink } from 'lucide-react';
import Papa from 'papaparse';

const companyNames = [
    "AMD", "Cohesity", "GSN Games", "LTI", "AQR Capital Management", "Coinbase", "Gameskraft", "Larsen & Toubro", "Accenture", "Comcast", "Garmin",
    "Lendingkart Technologies", "Accolite", "Commvault", "Geico", "Lenskart", "Acko", "Compass", "General Motors", "Licious", "Activision", "Confluent",
    "Genpact", "Liftoff", "Adobe", "ConsultAdd", "GoDaddy", "LinkedIn", "Affirm", "Coupang", "Gojek", "LiveRamp", "Agoda", "Coursera", "Goldman Sachs",
    "Lowe's", "Airbnb", "Coveo", "Google", "Lucid", "Airbus SE", "Credit Karma", "Grab", "Luxoft", "Airtel", "Criteo", "Grammarly", "Lyft", "Airwallex",
    "CrowdStrike", "Graviton", "MAQ Software", "Akamai", "Cruise", "Groupon", "MSCI", "Akuna Capital", "CureFit", "Groww", "Machine Zone", "Alibaba",
    "DE Shaw", "Grubhub", "MakeMyTrip", "Altimetrik", "DP world", "Guidewire", "Mapbox", "Amadeus", "DRW", "Gusto", "Mastercard", "Amazon", "DXC Technology",
    "HCL", "MathWorks", "Amdocs", "Darwinbox", "HP", "McKinsey", "American Express", "Databricks", "HPE", "Media.net", "Analytics quotient", "Datadog",
    "HSBC", "Meesho", "Anduril", "Dataminr", "Harness", "Mercari", "Aon", "Delhivery", "HashedIn", "Meta", "Apollo.io", "Deliveroo", "Hertz", "Microsoft",
    "AppDynamics", "Dell", "HiLabs", "Microstrategy", "AppFolio", "Deloitte", "Highspot", "Millennium", "Apple", "DeltaX", "Hive", "MindTree", "Applied Intuition",
    "Deutsche Bank", "Hiver", "Mindtickle", "Arcesium", "DevRev", "Honeywell", "Miro", "Arista Networks", "Devsinc", "Hotstar", "Mitsogo", "Asana", "Devtron",
    "Houzz", "Mixpanel", "Atlassian", "Directi", "Huawei", "Mobileye", "Attentive", "Disney", "Hubspot", "Moengage", "Audible", "Docusign", "Hudson River Trading",
    "Moloco", "Aurora", "DoorDash", "Hulu", "MongoDB", "Autodesk", "Dream11", "IBM", "Morgan Stanley", "Avalara", "Dropbox", "IIT Bombay", "Mountblue", "Avito",
    "Druva", "IMC", "Moveworks", "Axon", "Dunzo", "INDmoney", "Myntra", "BILL Holdings", "Duolingo", "IVP", "NCR", "BNY Mellon", "EPAM Systems", "IXL",
    "Nagarro", "BP", "EY", "InMobi", "National Instruments", "Baidu", "EarnIn", "Indeed", "National Payments Corporation of India", "Bank of America",
    "Edelweiss Group", "Info Edge", "Navan", "Barclays", "Electronic Arts", "Informatica", "Navi", "Bentley Systems", "Epic Systems", "Infosys", "NetApp",
    "BharatPe", "Expedia", "Instacart", "NetEase", "BitGo", "FPT", "Intel", "Netflix", "BlackRock", "FactSet", "Intuit", "Netskope", "BlackStone", "Faire",
    "J.P. Morgan", "Netsuite", "Blizzard", "Fastenal", "Jane Street", "Nextdoor", "Block", "Fidelity", "Jump Trading", "Niantic", "Bloomberg", "Fiverr",
    "Juniper Networks", "Nielsen", "Bolt", "Flexera", "Juspay", "Nike", "Booking.com", "Flexport", "KLA", "NinjaCart", "Bosch", "Flipkart", "Kakao", "Nokia",
    "Box", "Fortinet", "Karat", "Nordstrom", "Braze", "Freecharge", "Komprise", "Notion", "Brex", "FreshWorks", "LINE", "Nuro", "Bridgewater Associates",
    "GE Digital", "Nutanix", "ByteDance", "GE Healthcare", "Nvidia", "CARS24", "GSA Capital", "Nykaa", "CEDCOSS", "OKX", "CME Group", "Odoo", "CRED",
    "Okta", "CTC", "Ola Cabs", "CVENT", "OpenAI", "Cadence", "Opendoor", "Canonical", "Optiver", "Capgemini", "Optum", "Capital One", "Oracle", "Careem",
    "Otter.ai", "Cashfree", "Ozon", "Celigo", "Palantir Technologies", "Chewy", "Palo Alto Networks", "Chime", "Patreon", "Circle", "PayPal", "Cisco",
    "PayPay", "Citadel", "PayU", "Citigroup", "Paycom", "Citrix", "Paytm", "Clari", "Peloton", "Cleartrip", "PhonePe", "Cloudera", "Pinterest", "Cloudflare",
    "Pocket Gems", "Coforge", "Point72", "Cognizant", "Pony.ai", "PornHub", "Poshmark", "Postmates", "PubMatic", "Publicis Sapient", "Pure Storage",
    "Pwc", "QBurst", "Qualcomm", "Qualtrics", "Quora", "RBC", "Rakuten", "Reddit", "Remitly", "Revolut", "Riot Games", "Ripple", "Rippling", "Rivian",
    "Robinhood", "Roblox", "Roche", "Rokt", "Roku", "Rubrik", "SAP", "SIG", "SOTI", "Salesforce", "Samsara", "Samsung", "Scale AI", "Sentry", "ServiceNow",
    "ShareChat", "Shopee", "Shopify", "Siemens", "Sigmoid", "Slice", "Smartsheet", "Snap", "Snapdeal", "Snowflake", "SoFi", "Societe Generale", "Softwire",
    "Sony", "SoundHound", "Splunk", "Spotify", "Sprinklr", "Squarepoint Capital", "Squarespace", "StackAdapt", "Stackline", "Stripe", "Sumo Logic",
    "Swiggy", "Synopsys", "Tanium", "Target", "Tech Mahindra", "Tejas Networks", "Tekion", "Tencent", "Teradata", "Tesco", "Tesla", "Texas Instruments",
    "The Trade Desk", "Thomson Reuters", "ThoughtWorks", "ThousandEyes", "Tiger Analytics", "TikTok", "Tinder", "Tinkoff", "Toast", "Toptal",
    "Tower Research Capital", "Trexquant", "Trilogy", "Tripadvisor", "TuSimple", "Turing", "Turo", "Turvo", "Twilio", "Twitch", "Two Sigma",
    "UBS", "UKG", "USAA", "Uber", "UiPath", "Unity", "Upstart", "Urban Company", "VK", "VMware", "Valve", "Vanguard", "Veeva Systems", "Verily",
    "Veritas", "Verkada", "Vimeo", "Virtu Financial", "Virtusa", "Visa", "Walmart Labs", "Warnermedia", "WatchGuard", "Wayfair", "Waymo",
    "WeRide", "Wealthfront", "Wells Fargo", "Western Digital", "Whatnot", "WinZO", "Wipro", "Wise", "Wish", "Wissen Technology", "Wix",
    "Workday", "Works Applications", "WorldQuant", "X", "Yahoo", "Yandex", "Yelp", "Yext", "ZS Associates", "ZScaler", "Zalando", "Zendesk",
    "Zenefits", "Zepto", "Zeta", "Zillow", "ZipRecruiter", "Zluri", "Zoho", "Zomato", "Zoom", "Zoox", "Zopsmart", "Zynga", "athenahealth",
    "blinkit", "carwale", "ciena", "eBay", "fourkites", "instabase", "jio", "josh technology"
];

const colorThemes = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-blue-500",
    "from-rose-500 to-pink-500"
];

const companies = companyNames.map((name, i) => ({
    name,
    file: `/leetcode/companies/${name.replace(/[^a-z0-9]/gi, '').toLowerCase()}.xlsx`,
    count: 0,
    color: colorThemes[i % colorThemes.length]
}));

export default function Resources() {
    const [search, setSearch] = useState('');
    const [companySearch, setCompanySearch] = useState('');
    const [activeCompany, setActiveCompany] = useState(companies[0].name);
    const [questions, setQuestions] = useState([]);
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Frequency');

    useEffect(() => {
        const co = companies.find(c => c.name === activeCompany);
        if (!co) return setQuestions([]);
        fetch(co.file)
            .then(res => res.ok ? res.text() : "")
            .then(csv => {
                if (!csv) return setQuestions([]);
                const parsed = Papa.parse(csv, { header: true });
                setQuestions(parsed.data.filter(q => !!q.Title || !!q.question || !!q.link));
            });
    }, [activeCompany]);

    const filteredCompanies = React.useMemo(() => {
        if (!companySearch) return companies;
        return companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));
    }, [companySearch]);

    const filteredQuestions = React.useMemo(() => {
        let arr = questions;
        if (search) {
            arr = arr.filter(q =>
                (q.Title || q.question || '').toLowerCase().includes(search.toLowerCase()) ||
                (q.Topics || q.topics || '').toLowerCase().includes(search.toLowerCase())
            );
        }
        if (difficultyFilter !== 'All') {
            arr = arr.filter(q => (q.Difficulty || q.difficulty) === difficultyFilter);
        }
        arr = arr.slice().sort((a, b) => {
            if (sortBy === 'Frequency')
                return parseInt(b.Frequency || b.frequency || "0") - parseInt(a.Frequency || a.frequency || "0");
            if (sortBy === 'Acceptance_Rate')
                return parseInt(b.Acceptance_Rate || b.acceptance || "0") - parseInt(a.Acceptance_Rate || a.acceptance || "0");
            if (sortBy === 'Difficulty') {
                const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                return order[(b.Difficulty || b.difficulty)] - order[(a.Difficulty || a.difficulty)];
            }
            return 0;
        });
        return arr;
    }, [questions, search, difficultyFilter, sortBy]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-400/15 border-green-400/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/15 border-yellow-400/20';
            case 'Hard': return 'text-red-400 bg-red-400/15 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/15 border-gray-400/20';
        }
    };

    const difficultyStats = React.useMemo(() => {
        const stats = { Easy: 0, Medium: 0, Hard: 0 };
        filteredQuestions.forEach(q => {
            const diff = q.Difficulty || q.difficulty;
            if (diff in stats) stats[diff]++;
        });
        return stats;
    }, [filteredQuestions]);

    return (
        <div className="min-h-screen bg-transparent pt-24 px-2 sm:px-6 lg:px-8 pb-6 select-none overflow-hidden">
            <div className="max-w-[1800px] mx-auto w-full flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">

                {/* SIDEBAR */}
                <aside
                    data-lenis-prevent
                    className="w-full lg:w-80 h-full flex flex-col bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                >
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-5 h-5 text-neon-cyan" />
                            <h3 className="text-white font-bold text-base">Companies</h3>
                            <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                {filteredCompanies.length}
              </span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                className="w-full bg-white/5 text-white rounded-lg pl-10 pr-3 py-2 border border-white/10 focus:border-neon-cyan focus:outline-none text-sm"
                                placeholder="Search companies..."
                                value={companySearch}
                                onChange={e => setCompanySearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Company Scroll Section */}
                    <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scroll px-2 py-3">
                        <div className="space-y-2 pr-2">
                            {filteredCompanies.map(company => (
                                <div
                                    key={company.name}
                                    onClick={() => setActiveCompany(company.name)}
                                    className={`group relative py-2.5 px-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                                        activeCompany === company.name
                                            ? `bg-gradient-to-r ${company.color} border-transparent shadow-lg`
                                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${company.color} ${activeCompany === company.name ? 'animate-pulse' : ''}`} />
                                            <span className={`font-medium text-sm ${activeCompany === company.name ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                        {company.name}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main
                    data-lenis-prevent
                    className="flex-1 min-w-0 h-full flex flex-col bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                >
                    <div className="flex-shrink-0 px-6 py-4 border-b border-white/10 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                    {activeCompany}
                                    <span className="text-sm font-normal text-gray-400">Interview Questions</span>
                                </h2>
                                <p className="text-gray-400 text-sm">{filteredQuestions.length} questions • Master the patterns that matter most</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="px-3 py-1.5 bg-green-400/10 border border-green-400/20 rounded-lg text-green-400 text-xs font-semibold">Easy: {difficultyStats.Easy}</div>
                                <div className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 text-xs font-semibold">Medium: {difficultyStats.Medium}</div>
                                <div className="px-3 py-1.5 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-xs font-semibold">Hard: {difficultyStats.Hard}</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    className="w-full bg-white/10 text-white rounded-lg pl-10 pr-4 py-2 border border-white/10 focus:border-neon-purple focus:outline-none text-sm"
                                    placeholder="Search by title or topic..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                <select
                                    value={difficultyFilter}
                                    onChange={e => setDifficultyFilter(e.target.value)}
                                    className="appearance-none bg-white/10 text-white rounded-lg pl-10 pr-9 py-2 border border-white/10 focus:border-neon-cyan focus:outline-none text-sm font-medium cursor-pointer hover:bg-white/15"
                                >
                                    <option value="All" className="bg-gray-900">All Difficulties</option>
                                    <option value="Easy" className="bg-gray-900">Easy</option>
                                    <option value="Medium" className="bg-gray-900">Medium</option>
                                    <option value="Hard" className="bg-gray-900">Hard</option>
                                </select>
                            </div>
                            <div className="relative">
                                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="appearance-none bg-white/10 text-white rounded-lg pl-10 pr-9 py-2 border border-white/10 focus:border-neon-cyan focus:outline-none text-sm font-medium cursor-pointer hover:bg-white/15"
                                >
                                    <option value="Frequency" className="bg-gray-900">By Frequency</option>
                                    <option value="Acceptance_Rate" className="bg-gray-900">By Acceptance</option>
                                    <option value="Difficulty" className="bg-gray-900">By Difficulty</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Questions Scroll Section */}
                    <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scroll p-6">
                        {filteredQuestions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-lg font-medium mb-2">No questions found</p>
                                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredQuestions.map((q, idx) => {
                                    const difficulty = q.Difficulty || q.difficulty;
                                    const title = q.Title || q.question;
                                    const topics = q.Topics || q.topics;
                                    const link = q.Link || q.link;
                                    const frequency = q.Frequency || q.frequency;
                                    const acceptance = q.Acceptance_Rate || q.acceptance;
                                    return (
                                        <div
                                            key={idx}
                                            className="group bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 hover:border-neon-cyan/30 transition-all cursor-pointer"
                                            onClick={() => window.open(link, "_blank")}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-lg flex items-center justify-center text-white font-bold text-xs">{idx + 1}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-base font-semibold text-white group-hover:text-neon-cyan transition-colors flex items-center gap-2">
                                                            {title}
                                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-80 transition-opacity" />
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(difficulty)}`}>
                              {difficulty}
                            </span>
                                                    </div>
                                                    {topics && (
                                                        <p className="text-gray-400 text-sm mb-2 line-clamp-1">{topics}</p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-4 text-xs">
                                                        {frequency && (
                                                            <div className="flex items-center gap-1.5 text-blue-400">
                                                                <TrendingUp size={14} />
                                                                <span className="font-medium">{frequency}% frequency</span>
                                                            </div>
                                                        )}
                                                        {acceptance && (
                                                            <div className="flex items-center gap-1.5 text-yellow-400">
                                                                <Star size={14} />
                                                                <span className="font-medium">{acceptance}% accepted</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Custom Scroll Styling */}
            <style jsx>{`
                .custom-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #7c3aedaa rgba(255, 255, 255, 0.05);
                    overscroll-behavior: contain;
                }
                .custom-scroll::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #7c3aedaa, #06b6d4aa) !important;
                    border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </div>
    );
}
