// --- CONFIG & CONSTANTS ---
const DB_VERSION = '1.5.0'; // Updated version for hourly rates
const STORAGE_KEY = 'fullFluxDB';
const PLATFORM_COMMISSION = 0.20; // 20%
const REFERRAL_BONUS = 50.00; // ZAR 50
const SKILLS = {
    "Event Logistics & Setup": ["stagehand", "rigger", "security", "logistics-coordinator", "setup-crew"],
    "Event Staff & Services": ["bartender", "waitstaff", "registration", "brand-ambassador", "performer"],
    "Event Cleanup & Maintenance": ["cleaning-crew", "maintenance-tech", "landscaper", "waste-management"],
    "Additional Categories": ["merchandise", "driver", "it-support", "translator", "admin-staff"],
};
const AREA_COORDINATES = {
    "sandton": { lat: -26.1076, lng: 28.0567 },
    "rosebank": { lat: -26.1392, lng: 28.0428 },
    "braamfontein": { lat: -26.1952, lng: 28.0358 },
    "rivonia": { lat: -26.0345, lng: 28.0623 },
    "parkhurst": { lat: -26.148, lng: 28.032 },
    "default": { lat: -26.2041, lng: 28.0473 } // Johannesburg default
};
const MINIMUM_HOURLY_RATES = {
    "bartender": 80, "waitstaff": 65, "security": 70, "setup-crew": 75,
    "cleaning-crew": 60, "brand-ambassador": 85, "registration": 70, "stagehand": 80,
    "rigger": 90, "logistics-coordinator": 100, "performer": 120, "maintenance-tech": 75,
    "landscaper": 65, "waste-management": 60, "merchandise": 65, "driver": 70,
    "it-support": 90, "translator": 85, "admin-staff": 70,
};
const RATE_GUIDES = {
    "bartender": `R${MINIMUM_HOURLY_RATES.bartender} - R150 per hour`,
    "waitstaff": `R${MINIMUM_HOURLY_RATES.waitstaff} - R100 per hour`,
    "security": `R${MINIMUM_HOURLY_RATES.security} - R120 per hour`,
    "setup-crew": `R${MINIMUM_HOURLY_RATES['setup-crew']} - R130 per hour`,
    "cleaning-crew": `R${MINIMUM_HOURLY_RATES['cleaning-crew']} - R90 per hour`,
    "brand-ambassador": `R${MINIMUM_HOURLY_RATES['brand-ambassador']} - R160 per hour`,
    "registration": `R${MINIMUM_HOURLY_RATES.registration} - R110 per hour`,
    "stagehand": `R${MINIMUM_HOURLY_RATES.stagehand} - R140 per hour`,
    "rigger": `R${MINIMUM_HOURLY_RATES.rigger} - R180 per hour`,
    "logistics-coordinator": `R${MINIMUM_HOURLY_RATES['logistics-coordinator']} - R200 per hour`,
    "performer": `R${MINIMUM_HOURLY_RATES.performer} - R250 per hour`,
    "maintenance-tech": `R${MINIMUM_HOURLY_RATES['maintenance-tech']} - R150 per hour`,
    "landscaper": `R${MINIMUM_HOURLY_RATES.landscaper} - R100 per hour`,
    "waste-management": `R${MINIMUM_HOURLY_RATES['waste-management']} - R90 per hour`,
    "merchandise": `R${MINIMUM_HOURLY_RATES.merchandise} - R100 per hour`,
    "driver": `R${MINIMUM_HOURLY_RATES.driver} - R120 per hour`,
    "it-support": `R${MINIMUM_HOURLY_RATES['it-support']} - R180 per hour`,
    "translator": `R${MINIMUM_HOURLY_RATES.translator} - R170 per hour`,
    "admin-staff": `R${MINIMUM_HOURLY_RATES['admin-staff']} - R120 per hour`,
};

// --- STATE ---
let state = {
    currentUser: null,
    db: null,
    timers: [], // To keep track of setIntervals for countdowns
    currentView: 'dashboard', // To manage which view is active for a user
    confirmationCallback: null, // To store the action for the confirmation modal
};

// --- STORAGE MODULE ---
const storage = {
    getDB: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.version === DB_VERSION) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Error reading from localStorage", e);
        }
        return storage.initDB();
    },
    saveDB: (db) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        } catch (e) {
            console.error("Error saving to localStorage", e);
        }
    },
    initDB: () => {
        console.log("Initializing and seeding new database...");
        const db = {
            version: DB_VERSION,
            users: [],
            jobs: [],
            reviews: [],
            notifications: [],
            chats: [],
            disputes: [],
            cancellations: [], 
            platformWallet: 0,
            referrals: [],
            payoutRequests: [],
            depositRequests: [],
            platformSettings: {
                bankingDetails: {
                    bankName: 'FullFlux Standard Bank',
                    accountNumber: '123456789',
                    branchCode: '051001'
                }
            }
        };
        storage.seedData(db);
        storage.saveDB(db);
        return db;
    },
    seedData: (db) => {
        const now = new Date('2025-08-16T15:35:00+02:00');

        const freelancers = [
            { id: `user-f1`, role: "freelancer", username: "john_d", passwordHash: "a", displayName: "John Doe", photoDataURL: `https://placehold.co/100x100/EFEFEFF/333333?text=JD`, skills: ["waitstaff", "bartender"], avgRating: 4.8, ratingsCount: 12, wallet: 1250, availability: "available", lastKnownLocation: { lat: -26.1076, lng: 28.0567 }, bio: "Experienced bartender...", documents: [], backgroundCheckStatus: 'none', reliabilityScore: 110, jobsCompleted: 2, cancellationsCount: 0, referralCode: 'JOHN-REF-1', referredBy: null, firstJobCompleted: true, bankingDetails: null, portfolio: [], createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString() }, 
            { id: `user-f2`, role: "freelancer", username: "jane_s", passwordHash: "a", displayName: "Jane Smith", photoDataURL: `https://placehold.co/100x100/F9D4D4/333333?text=JS`, skills: ["registration", "setup-crew"], avgRating: 4.5, ratingsCount: 8, wallet: 800, availability: "available", lastKnownLocation: { lat: -26.1392, lng: 28.0428 }, bio: "Organized and efficient...", documents: [{id: 1, name: "ID Document", fileName: "id_scan.pdf", status: 'verified'}], backgroundCheckStatus: 'none', reliabilityScore: 125, jobsCompleted: 5, cancellationsCount: 0, referralCode: 'JANE-REF-2', referredBy: 'user-f1', firstJobCompleted: true, bankingDetails: { bankName: 'FNB', accountNumber: '123456789', branchCode: '250655'}, portfolio: [], createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `user-f3`, role: "freelancer", username: "mike_b", passwordHash: "a", displayName: "Mike Brown", photoDataURL: `https://placehold.co/100x100/D4F9E0/333333?text=MB`, skills: ["cleaning-crew"], avgRating: 5.0, ratingsCount: 20, wallet: 2500, availability: "away", lastKnownLocation: { lat: -26.1952, lng: 28.0358 }, bio: "Lead a small cleaning team...", documents: [], backgroundCheckStatus: 'none', reliabilityScore: 75, jobsCompleted: 10, cancellationsCount: 1, referralCode: 'MIKE-REF-3', referredBy: null, firstJobCompleted: true, bankingDetails: null, portfolio: [], createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `user-f4`, role: "freelancer", username: "sara_l", passwordHash: "a", displayName: "Sara Lee", photoDataURL: `https://placehold.co/100x100/D4E9F9/333333?text=SL`, skills: ["waitstaff", "brand-ambassador"], avgRating: 4.7, ratingsCount: 5, wallet: 450, availability: "available", lastKnownLocation: { lat: -26.1094, lng: 28.0596 }, bio: "Engaging brand ambassador...", documents: [], backgroundCheckStatus: 'none', reliabilityScore: 105, jobsCompleted: 1, cancellationsCount: 0, referralCode: 'SARA-REF-4', referredBy: 'user-f2', firstJobCompleted: false, bankingDetails: null, portfolio: [ {id: 1, title: 'Brand Activation', imageDataURL: 'https://placehold.co/400x300/F9D4D4/333333?text=Event+Photo+1'}], createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `user-f5`, role: "freelancer", username: "peter_j", passwordHash: "a", displayName: "Peter Jones", photoDataURL: `https://placehold.co/100x100/FFF9C4/333333?text=PJ`, skills: ["setup-crew", "cleaning-crew", "stagehand"], avgRating: 4.2, ratingsCount: 15, wallet: 1800, availability: "available", lastKnownLocation: { lat: -26.0345, lng: 28.0623 }, bio: "Hardworking and physically fit...", documents: [], backgroundCheckStatus: 'none', reliabilityScore: 90, jobsCompleted: 8, cancellationsCount: 2, referralCode: 'PETER-REF-5', referredBy: null, firstJobCompleted: true, bankingDetails: null, portfolio: [], createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `user-f6`, role: "freelancer", username: "linda_m", passwordHash: "a", displayName: "Linda M.", photoDataURL: `https://placehold.co/100x100/E1BEE7/333333?text=LM`, skills: ["bartender", "security"], avgRating: 4.9, ratingsCount: 25, wallet: 3200, availability: "available", lastKnownLocation: { lat: -26.148, lng: 28.032 }, bio: "Certified security personnel...", documents: [{id: 1, name: "Security License", fileName: "sec_cert.pdf", status: 'verified'}], backgroundCheckStatus: 'verified', reliabilityScore: 150, jobsCompleted: 10, cancellationsCount: 0, referralCode: 'LINDA-REF-6', referredBy: null, firstJobCompleted: true, bankingDetails: null, portfolio: [], createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        ];
        db.users.push(...freelancers);

        const clients = [
            { id: `user-c1`, role: "client", username: "eventco", passwordHash: "a", displayName: "Event Co.", wallet: 5000, avgRating: 4.9, ratingsCount: 15, referralCode: 'EVENTCO-REF-1', paymentReference: 'FF-EVCO-01', createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `user-c2`, role: "client", username: "gala_planner", passwordHash: "a", displayName: "Gala Planners Inc.", wallet: 10000, avgRating: 5.0, ratingsCount: 22, referralCode: 'GALA-REF-2', paymentReference: 'FF-GALA-02', createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `user-c3`, role: "client", username: "weddings_r_us", passwordHash: "a", displayName: "Weddings R Us", wallet: 7500, avgRating: 4.7, ratingsCount: 30, referralCode: 'WEDDINGS-REF-3', paymentReference: 'FF-WED-03', createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString() },
        ];
        db.users.push(...clients);

        // Add Admin User
        db.users.push({ id: 'user-admin', role: 'admin', username: 'admin', passwordHash: 'a', displayName: 'Admin', createdAt: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString() });

        const jobs = [
            { id: `job-1`, title: "Urgent Bartenders for Gala", briefing: "- Dress code: All black, formal.\n- Report to Maria at the main bar.\n- Familiarize yourself with our signature cocktail menu upon arrival.", positionsNeeded: 2, description: {responsibilities: "Serve high-end cocktails.", requirements: "3+ years experience.", contact: "Maria"}, category: "bartender", hourlyRate: 120, totalHours: 6.5, location: { lat: -26.1076, lng: 28.0567, areaName: "Sandton Sun Hotel" }, radiusKm: 5, createdAtISO: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), startTimeISO: new Date(now.getTime() + 1.5 * 60 * 60 * 1000).toISOString(), endTimeISO: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), status: "open", clientId: clients[1].id, applicants: [{freelancerId: freelancers[0].id, appliedAtISO: new Date(now.getTime() - 2 * 60 * 1000).toISOString()}], assignedFreelancers: [], acknowledgedBriefing: [], checkedIn: [], urgencyFee: 546, totalBudget: 2466 }, 
            { id: `job-2`, title: "3-Day Music Festival Setup", briefing: "", positionsNeeded: 10, description: {responsibilities: "Assist with stage and fencing setup.", requirements: "Physically fit.", contact: "Mike"}, category: "setup-crew", hourlyRate: 80, totalHours: 24, location: { lat: -26.1392, lng: 28.0428, areaName: "Rosebank" }, radiusKm: 15, createdAtISO: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), startTimeISO: new Date(now.getTime() + 14 * 60 * 60 * 1000).toISOString(), endTimeISO: new Date(now.getTime() + (14 + 48) * 60 * 60 * 1000).toISOString(), status: "open", clientId: clients[0].id, applicants: [], assignedFreelancers: [], acknowledgedBriefing: [], checkedIn: [], urgencyFee: 2880, totalBudget: 22080 },
            { id: `job-3`, title: "Corporate Event Greeters", briefing: "Meet Thabo at the registration desk 30 minutes prior to event start. Attire is business professional. Main duty is to check-in guests via the provided tablets.", positionsNeeded: 3, description: {responsibilities: "Welcome guests and check names.", requirements: "Professional attire.", contact: "Thabo"}, category: "registration", hourlyRate: 90, totalHours: 8, location: { lat: -26.1076, lng: 28.0567, areaName: "Sandton Convention Centre" }, radiusKm: 10, createdAtISO: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), startTimeISO: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), endTimeISO: new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString(), status: "assigned", clientId: clients[0].id, applicants: [], assignedFreelancers: [freelancers[1].id, freelancers[3].id, freelancers[4].id], acknowledgedBriefing: [freelancers[1].id], checkedIn: [], urgencyFee: 0, totalBudget: 2592 }, 
            { id: `job-4`, title: "Post-Wedding Cleanup", briefing: "", positionsNeeded: 4, description: {responsibilities: "General cleaning of venue.", requirements: "None", contact: "Susan"}, category: "cleaning-crew", hourlyRate: 70, totalHours: 4, location: { lat: -26.148, lng: 28.032, areaName: "Parkhurst" }, radiusKm: 15, createdAtISO: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), startTimeISO: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), endTimeISO: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), status: "completed", clientId: clients[2].id, applicants: [], assignedFreelancers: [freelancers[2].id, freelancers[4].id], acknowledgedBriefing: [], checkedIn: [], urgencyFee: 0, totalBudget: 1344 },
            { id: `job-5`, title: "Charity Fun Run Marshals", briefing: "", positionsNeeded: 2, description: {responsibilities: "Direct runners on the course.", requirements: "None", contact: "David"}, category: "brand-ambassador", hourlyRate: 85, totalHours: 6, location: { lat: -26.1392, lng: 28.0428, areaName: "Rosebank" }, radiusKm: 10, createdAtISO: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), startTimeISO: new Date(now.getTime() - (7 * 24 - 2) * 60 * 60 * 1000).toISOString(), endTimeISO: new Date(now.getTime() - (7 * 24 - 8) * 60 * 60 * 1000).toISOString(), status: "paid", clientId: clients[2].id, applicants: [], assignedFreelancers: [freelancers[0].id, freelancers[3].id], acknowledgedBriefing: [], checkedIn: [], urgencyFee: 0, totalBudget: 1224 },
            { id: `job-6`, title: "New Year's Eve Security", briefing: "Stationed at main entrance. Check IDs and wristbands. Radio contact is channel 3. Report any issues to the event manager on duty.", positionsNeeded: 1, description: {responsibilities: "Monitor entrance.", requirements: "Security cert.", contact: "Manager"}, category: "security", hourlyRate: 250, totalHours: 8, location: { lat: -26.1952, lng: 28.0358, areaName: "Braamfontein" }, radiusKm: 10, createdAtISO: new Date('2025-01-01T02:00:00+02:00').toISOString(), startTimeISO: new Date('2025-01-01T20:00:00+02:00').toISOString(), endTimeISO: new Date('2025-01-02T04:00:00+02:00').toISOString(), status: "completed", clientId: clients[1].id, applicants: [], assignedFreelancers: [freelancers[5].id], acknowledgedBriefing: [freelancers[5].id], checkedIn: [], urgencyFee: 0, totalBudget: 2400 },
        ];
        db.jobs.push(...jobs);

        const reviews = [
            { id: `review-1`, jobId: jobs[4].id, fromUserId: clients[2].id, toUserId: freelancers[0].id, fromRole: 'client', stars: 5, text: "Excellent work as always.", createdAtISO: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() },
            { id: `review-2`, jobId: jobs[4].id, fromUserId: freelancers[3].id, toUserId: clients[2].id, fromRole: 'freelancer', stars: 5, text: "Great organizer, very clear instructions.", createdAtISO: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() }
        ];
        db.reviews.push(...reviews);

        const disputes = [
            { id: `dispute-1`, jobId: jobs[3].id, reporterId: freelancers[2].id, issueText: "The client has not marked the job as complete and is now unreachable. We finished the cleanup hours ago.", createdAtISO: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), status: 'open', resolution: null }
        ];
        db.disputes.push(...disputes);

        const chats = [
            { id: `chat-${jobs[0].id}`, jobId: jobs[0].id, messages: [] },
            { id: `chat-${jobs[2].id}`, jobId: jobs[2].id, messages: [
                { senderId: clients[0].id, text: "Hi team, thanks for accepting. Please meet me at the main entrance tomorrow.", timestampISO: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString() },
                { senderId: freelancers[1].id, text: "Got it, see you then!", timestampISO: new Date(now.getTime() - 22 * 60 * 60 * 1000).toISOString() }
            ]},
            { id: `chat-${jobs[3].id}`, jobId: jobs[3].id, messages: [
                { senderId: clients[2].id, text: "Great work today everyone, thanks!", timestampISO: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
                { senderId: freelancers[2].id, text: "Thanks! When can we expect the job to be marked as complete?", timestampISO: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString() }
            ]},
        ];
        db.chats.push(...chats);
        
        db.payoutRequests.push({
            id: `payout-1`,
            userId: freelancers[1].id,
            amount: 250,
            status: 'pending',
            createdAtISO: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        });
    }
};

// --- AUTH MODULE ---
const auth = {
    login: (username, password) => {
        const user = state.db.users.find(u => u.username === username && u.passwordHash === password); // Simplified hash
        if (user) {
            state.currentUser = user;
            localStorage.setItem('fullFluxSession', user.id);
            return true;
        }
        return false;
    },
    register: (username, password, displayName, role, referralCode) => {
        if (state.db.users.some(u => u.username === username)) {
            return { success: false, message: "Username already exists." };
        }

        let referrerId = null;
        if (referralCode) {
            const referrer = state.db.users.find(u => u.referralCode === referralCode);
            if (referrer) {
                referrerId = referrer.id;
            } else {
                return { success: false, message: "Invalid referral code." };
            }
        }

        const newUser = {
            id: `user-${Date.now()}`,
            role,
            username,
            passwordHash: password, // Simplified hash for demo
            displayName,
            wallet: role === 'client' ? 1000 : 0, // Starting balance
            createdAt: new Date().toISOString(),
            avgRating: 0,
            ratingsCount: 0,
            referralCode: `${displayName.split(' ')[0].toUpperCase()}-REF-${Math.random().toString(36).substr(2, 4)}`,
            referredBy: referrerId,
        };
        if (role === 'freelancer') {
            newUser.skills = [];
            newUser.availability = "away";
            newUser.documents = [];
            newUser.backgroundCheckStatus = 'none'; // 'none', 'pending', 'verified', 'failed'
            newUser.reliabilityScore = 100;
            newUser.jobsCompleted = 0;
            newUser.cancellationsCount = 0;
            newUser.firstJobCompleted = false;
            newUser.bankingDetails = null;
            newUser.portfolio = [];
        } else if (role === 'client') {
            newUser.paymentReference = `FF-${displayName.split(' ')[0].toUpperCase().substring(0,4)}-${Math.floor(Math.random() * 100)}`;
        }
        state.db.users.push(newUser);
        storage.saveDB(state.db);
        return { success: true, user: newUser };
    },
    logout: () => {
        localStorage.removeItem('fullFluxSession');
        state.currentUser = null;
        state.currentView = 'dashboard'; // Reset view on logout
        ui.render();
    },
    updateUser: (userId, updates) => {
        const userIndex = state.db.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            state.db.users[userIndex] = { ...state.db.users[userIndex], ...updates };
            // If updating current user, update state object as well
            if (state.currentUser && state.currentUser.id === userId) {
                state.currentUser = { ...state.currentUser, ...updates };
            }
            storage.saveDB(state.db);
            return true;
        }
        return false;
    }
};

// --- GEOLOCATION & MATCHING MODULE ---
const geo = {
    // Haversine formula to calculate distance between two points in km
    getDistance: (loc1, loc2) => {
        if (!loc1 || !loc2) return Infinity;
        const R = 6371; // Radius of the Earth in km
        const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
        const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat)/2 +
            Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
            (1 - Math.cos(dLon)) / 2;
        return R * 2 * Math.asin(Math.sqrt(a));
    },
    requestLocation: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation is not supported by your browser.");
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }),
                    () => reject("Unable to retrieve your location.")
                );
            }
        });
    }
};

const matching = {
    findEligibleJobsFor: (freelancer) => {
        // A freelancer still needs to be "available" to see the job board.
        if (!freelancer || freelancer.availability !== 'available') {
            return [];
        }
        const now = new Date();
        return state.db.jobs.filter(job => {
            const isExpired = new Date(job.startTimeISO) < now;
            if (job.status !== 'open' || isExpired) {
                if (job.status === 'open' && isExpired) {
                    // Expire the job
                    const jobIndex = state.db.jobs.findIndex(j => j.id === job.id);
                    state.db.jobs[jobIndex].status = 'expired';
                    storage.saveDB(state.db);
                }
                return false;
            }
            // Show all open, unexpired jobs to any available freelancer
            return true; 
        });
    }
};

// --- NOTIFICATION MODULE ---
const notifications = {
    requestPermission: async () => {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                await Notification.requestPermission();
            }
        }
    },
    showToast: (message) => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10); // Trigger transition
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Remove after transition
        }, 3000);
    },
    showBrowserNotification: (title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
        } else {
            console.log(`Browser notification fallback: ${title} - ${body}`);
        }
    },
    create: (userId, message, type = 'general', relatedId = null) => {
        const notif = {
            id: `notif-${Date.now()}`,
            userId,
            message,
            createdAtISO: new Date().toISOString(),
            read: false,
            type, // 'general', 'chat'
            relatedId, // e.g., jobId for chat
        };
        state.db.notifications.push(notif);
        storage.saveDB(state.db);
        
        // If the notification is for the current user, show it
        if (state.currentUser && state.currentUser.id === userId) {
            notifications.showToast(message);
            if (type === 'general' && state.currentUser.role === 'freelancer') {
                 notifications.showBrowserNotification("New Job Alert!", message);
            } else if (type === 'chat') {
                notifications.showBrowserNotification("New Message", message);
            }
        }
    }
};

// --- UI MODULE ---
const ui = {
    render: () => {
        const root = document.getElementById('app-root');
        const nav = document.getElementById('main-nav');
        root.innerHTML = '';
        nav.innerHTML = '';
        
        // Clear all existing timers
        state.timers.forEach(timer => clearInterval(timer.intervalId));
        state.timers = [];

        if (state.currentUser) {
            ui.renderNav();
            const user = state.currentUser;
            if (user.role === 'admin' && state.currentView === 'adminSettings') {
                ui.renderAdminSettings();
            } else if (user.role === 'admin' && state.currentView === 'adminDisputes') {
                ui.renderAdminDisputes();
            } else if (user.role === 'admin' && state.currentView === 'adminUsers') {
                ui.renderAdminUsers();
            } else if (user.role === 'admin') {
                ui.renderAdminDashboard();
            } else if (user.role === 'freelancer' && state.currentView === 'history') {
                ui.renderFreelancerHistory();
            } else if (user.role === 'freelancer' && state.currentView === 'map') {
                ui.renderMapView();
            } else if (user.role === 'freelancer' && (!user.skills || user.skills.length === 0 || !user.lastKnownLocation)) {
                ui.renderFreelancerOnboarding();
            } else if (user.role === 'client') {
                ui.renderClientDashboard();
            } else {
                ui.renderFreelancerDashboard();
            }
        } else {
            ui.renderLandingPage();
        }
        ui.attachGlobalListeners();
    },
    renderLandingPage: () => {
        const root = document.getElementById('app-root');
        const template = document.getElementById('landing-page-template');
        root.innerHTML = template.innerHTML;

        document.getElementById('hero-cta-btn').addEventListener('click', ui.showAuthForm);
        document.getElementById('bottom-cta-btn').addEventListener('click', ui.showAuthForm);
        document.getElementById('main-nav').innerHTML = `
            <button id="login-nav-btn" class="btn btn-outline">Login / Register</button>
            <button id="theme-toggle-btn" class="theme-toggle">${document.body.classList.contains('dark-mode') ? '☀️' : '🌙'}</button>
        `;
        document.getElementById('login-nav-btn').addEventListener('click', ui.showAuthForm);
        document.getElementById('theme-toggle-btn').addEventListener('click', handlers.handleThemeToggle);
    },
    showAuthForm: () => {
        const authContainer = document.getElementById('auth-container');
        const template = document.getElementById('login-template');
        authContainer.innerHTML = template.innerHTML;
        authContainer.classList.remove('hidden');
        authContainer.scrollIntoView({ behavior: 'smooth' });
        ui.attachLoginListeners();
    },
    attachLoginListeners: () => {
         let isRegistering = false;

        const title = document.getElementById('auth-title');
        const form = document.getElementById('auth-form');
        const toggleLink = document.getElementById('auth-toggle-link');
        const submitBtn = document.getElementById('auth-submit-btn');
        const displayNameGroup = document.getElementById('display-name-group');
        const roleGroup = document.getElementById('role-group');
        const referralGroup = document.getElementById('referral-group');

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isRegistering = !isRegistering;
            title.textContent = isRegistering ? 'Register' : 'Login';
            submitBtn.textContent = isRegistering ? 'Register' : 'Login';
            toggleLink.textContent = isRegistering ? 'Already have an account? Login' : "Don't have an account? Register";
            displayNameGroup.classList.toggle('hidden', !isRegistering);
            roleGroup.classList.toggle('hidden', !isRegistering);
            referralGroup.classList.toggle('hidden', !isRegistering);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (isRegistering) {
                const displayName = document.getElementById('displayName').value;
                const role = document.getElementById('role').value;
                const referralCode = document.getElementById('referralCode').value;
                if (!displayName) {
                     notifications.showToast("Display name is required.");
                     return;
                }
                const result = auth.register(username, password, displayName, role, referralCode);
                if (result.success) {
                    auth.login(username, password);
                    ui.render();
                } else {
                    notifications.showToast(result.message);
                }
            } else {
                if (auth.login(username, password)) {
                    ui.render();
                } else {
                    notifications.showToast("Invalid username or password.");
                }
            }
        });
    },
    renderNav: () => {
        const nav = document.getElementById('main-nav');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        let navLinks = '';
        if (state.currentUser.role === 'admin') {
            navLinks = `<span><strong>Admin Panel</strong></span>`;
        } else {
            const walletBalance = state.currentUser.wallet.toFixed(2);
            let availabilityToggle = '';
            if (state.currentUser.role === 'freelancer') {
                const isAvailable = state.currentUser.availability === 'available';
                availabilityToggle = `<button id="availability-toggle" class="btn ${isAvailable ? 'btn-danger' : 'btn-success'}">${isAvailable ? 'Go Away' : 'Go Online'}</button>`;
            }
            let historyLink = '';
            if (state.currentUser.role === 'freelancer') {
                historyLink = state.currentView === 'history' ? `<a href="#" id="dashboard-link">Dashboard</a>` : `<a href="#" id="history-link">History</a>`;
            }
            navLinks = `
                <span>Welcome, <strong>${state.currentUser.displayName}</strong></span>
                <a href="#" id="wallet-link">Wallet: ZAR <span id="wallet-balance">${walletBalance}</span></a>
                ${availabilityToggle}
                ${historyLink}
                <a href="#" id="edit-profile-link">Profile</a>
                <a href="#" id="cancellation-policy-link">Policy</a>
            `;
        }


        nav.innerHTML = `
            ${navLinks}
            <a href="#" id="logout-link">Logout</a>
            <button id="reset-data-btn" class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">Reset Demo</button>
            <button id="theme-toggle-btn" class="theme-toggle">${isDarkMode ? '☀️' : '🌙'}</button>
        `;

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
        
        document.getElementById('edit-profile-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            ui.showModal('edit-profile-modal');
        });

        document.getElementById('wallet-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            ui.showModal('wallet-modal');
        });

        document.getElementById('cancellation-policy-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            ui.showModal('cancellation-policy-modal');
        });
        
        document.getElementById('availability-toggle')?.addEventListener('click', handlers.handleAvailabilityToggle);
        
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            localStorage.removeItem(STORAGE_KEY);
            state.currentUser = null;
            state.db = storage.initDB();
            ui.render();
            notifications.showToast("Demo data has been reset.");
        });

        document.getElementById('theme-toggle-btn').addEventListener('click', handlers.handleThemeToggle);

        document.getElementById('history-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            state.currentView = 'history';
            ui.render();
        });
        document.getElementById('dashboard-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            state.currentView = 'dashboard';
            ui.render();
        });
    },
    renderFreelancerOnboarding: () => {
        const root = document.getElementById('app-root');
        root.innerHTML = `
            <div class="card text-center">
                <h2>Welcome to FullFlux!</h2>
                <p class="text-muted">To start seeing available jobs, you need to set up your profile.</p>
                <br>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="setup-skills-btn" class="btn btn-primary">1. Add Your Skills</button>
                    <button id="setup-location-btn" class="btn btn-primary">2. Set Your Location</button>
                </div>
            </div>
        `;
        document.getElementById('setup-skills-btn').addEventListener('click', () => ui.showModal('edit-profile-modal'));
        document.getElementById('setup-location-btn').addEventListener('click', () => ui.showModal('set-location-modal'));
    },
    renderClientDashboard: () => {
        const root = document.getElementById('app-root');
        root.innerHTML = `
            <div class="dashboard-header">
                <h2>Client Dashboard</h2>
                <button id="post-job-btn" class="btn btn-primary">Post New Job</button>
            </div>
            
            <h3>Open Jobs</h3>
            <div id="open-jobs" class="job-grid"></div>
            <hr style="margin: 2rem 0; border-color: var(--border-color);">
            
            <h3>Assigned Jobs</h3>
            <div id="assigned-jobs" class="job-grid"></div>
            <hr style="margin: 2rem 0; border-color: var(--border-color);">
            
            <h3>Completed & Paid Jobs</h3>
            <div id="completed-jobs" class="job-grid"></div>
             <hr style="margin: 2rem 0; border-color: var(--border-color);">

            <h3>Archived (Cancelled/Expired)</h3>
            <div id="archived-jobs" class="job-grid"></div>
        `;
        
        const jobs = state.db.jobs.filter(j => j.clientId === state.currentUser.id);
        
        const openJobs = jobs.filter(j => j.status === 'open' && new Date(j.startTimeISO) > new Date());
        const assignedJobs = jobs.filter(j => j.status === 'assigned');
        const completedJobs = jobs.filter(j => ['completed', 'paid'].includes(j.status));
        const archivedJobs = jobs.filter(j => ['expired', 'cancelled'].includes(j.status));


        ui.renderJobCards('open-jobs', openJobs);
        ui.renderJobCards('assigned-jobs', assignedJobs);
        ui.renderJobCards('completed-jobs', completedJobs);
        ui.renderJobCards('archived-jobs', archivedJobs);


        document.getElementById('post-job-btn').addEventListener('click', () => {
            // Reset form for new job entry
            document.getElementById('post-job-form').reset();
            document.getElementById('job-id').value = '';
            document.querySelector('#post-job-modal .modal-title').textContent = 'Post a New Job';
            document.getElementById('save-job-btn').textContent = 'Post Job & Escrow Funds';
            ui.showModal('post-job-modal');
        });
    },
    renderFreelancerDashboard: () => {
        const root = document.getElementById('app-root');
        root.innerHTML = `
            <div class="dashboard-header">
                <h2>Freelancer Dashboard</h2>
                <button id="map-view-btn" class="btn btn-secondary">Map View</button>
            </div>
            
            <h3>Available Jobs</h3>
            <div id="available-jobs" class="job-grid"></div>
            <hr style="margin: 2rem 0; border-color: var(--border-color);">
            
            <h3>My Assigned Jobs</h3>
            <div id="assigned-jobs" class="job-grid"></div>
            <hr style="margin: 2rem 0; border-color: var(--border-color);">
            
            <h3>My Past Jobs</h3>
            <div id="completed-jobs" class="job-grid"></div>
        `;

        document.getElementById('map-view-btn').addEventListener('click', () => {
            state.currentView = 'map';
            ui.render();
        });

        const eligibleJobs = matching.findEligibleJobsFor(state.currentUser);
        ui.renderJobCards('available-jobs', eligibleJobs);
        
        const myJobs = state.db.jobs.filter(j => j.assignedFreelancers.includes(state.currentUser.id) || j.applicants.some(a => a.freelancerId === state.currentUser.id));
        ui.renderJobCards('assigned-jobs', myJobs.filter(j => j.status === 'assigned'));
        ui.renderJobCards('completed-jobs', myJobs.filter(j => ['completed', 'paid', 'cancelled'].includes(j.status)));

        if (state.currentUser.availability === 'available' && eligibleJobs.length === 0) {
            document.getElementById('available-jobs').innerHTML = '<p>No available jobs right now. Stay tuned!</p>';
        } else if (state.currentUser.availability === 'away') {
             document.getElementById('available-jobs').innerHTML = '<p>You are currently offline. <a href="#" id="go-online-link">Go online</a> to see available jobs.</p>';
             document.getElementById('go-online-link').addEventListener('click', handlers.handleAvailabilityToggle);
        }
    },
    renderFreelancerHistory: () => {
        const root = document.getElementById('app-root');
        const template = document.getElementById('history-template').content.cloneNode(true);
        root.innerHTML = ''; // Clear the root
        root.appendChild(template);

        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => {
            state.currentView = 'dashboard';
            ui.render();
        });

        const myJobs = state.db.jobs.filter(j => 
            j.assignedFreelancers.includes(state.currentUser.id) && 
            ['completed', 'paid'].includes(j.status)
        );

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let totalEarnings = 0;
        let monthEarnings = 0;
        let yearEarnings = 0;

        myJobs.forEach(job => {
            const earnings = job.hourlyRate * job.totalHours;
            totalEarnings += earnings;
            const jobDate = new Date(job.createdAtISO);
            if (jobDate.getFullYear() === currentYear) {
                yearEarnings += earnings;
                if (jobDate.getMonth() === currentMonth) {
                    monthEarnings += earnings;
                }
            }
        });

        document.getElementById('total-earnings').textContent = `ZAR ${totalEarnings.toFixed(2)}`;
        document.getElementById('month-earnings').textContent = `ZAR ${monthEarnings.toFixed(2)}`;
        document.getElementById('year-earnings').textContent = `ZAR ${yearEarnings.toFixed(2)}`;

        const jobListContainer = document.getElementById('history-job-list');
        if (myJobs.length === 0) {
            jobListContainer.innerHTML = '<p class="text-muted">You have no completed jobs yet.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'form-control'; // Re-using some styling for the container
        table.style.width = '100%';
        table.innerHTML = `
            <thead style="border-bottom: 1px solid var(--border-color);">
                <tr>
                    <th style="padding: 0.5rem; text-align: left;">Date</th>
                    <th style="padding: 0.5rem; text-align: left;">Job Title</th>
                    <th style="padding: 0.5rem; text-align: left;">Client</th>
                    <th style="padding: 0.5rem; text-align: right;">Earnings</th>
                    <th style="padding: 0.5rem; text-align: center;">Status</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');
        myJobs.sort((a, b) => new Date(b.createdAtISO) - new Date(a.createdAtISO));

        myJobs.forEach(job => {
            const client = state.db.users.find(u => u.id === job.clientId);
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--border-color)';
            row.innerHTML = `
                <td style="padding: 0.5rem;">${new Date(job.createdAtISO).toLocaleDateString()}</td>
                <td style="padding: 0.5rem;">${job.title}</td>
                <td style="padding: 0.5rem;">${client ? client.displayName : 'N/A'}</td>
                <td style="padding: 0.5rem; text-align: right;">ZAR ${(job.hourlyRate * job.totalHours).toFixed(2)}</td>
                <td style="padding: 0.5rem; text-align: center;"><span class="badge badge-${job.status === 'paid' ? 'success' : 'warning'}">${job.status}</span></td>
            `;
            tbody.appendChild(row);
        });

        jobListContainer.appendChild(table);
    },
    renderMapView: () => {
        const root = document.getElementById('app-root');
        const template = document.getElementById('map-view-template').content.cloneNode(true);
        root.appendChild(template);

        document.getElementById('list-view-btn').addEventListener('click', () => {
            state.currentView = 'dashboard';
            ui.render();
        });

        const map = L.map('map').setView([-26.15, 28.05], 11); // Centered on Johannesburg
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const eligibleJobs = matching.findEligibleJobsFor(state.currentUser);
        eligibleJobs.forEach(job => {
            L.marker([job.location.lat, job.location.lng])
                .addTo(map)
                .bindPopup(`<b>${job.title}</b><br>${job.location.areaName}<br>Rate: R${job.hourlyRate}/hr`);
        });

        if (state.currentUser.lastKnownLocation) {
            L.circle([state.currentUser.lastKnownLocation.lat, state.currentUser.lastKnownLocation.lng], {
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.2,
                radius: 500
            }).addTo(map).bindPopup('Your Location');
        }
    },
    renderAdminDashboard: () => {
        const root = document.getElementById('app-root');
        const pendingPayouts = state.db.payoutRequests.filter(p => p.status === 'pending');
        const pendingDeposits = state.db.depositRequests.filter(d => d.status === 'pending');
        const openDisputes = state.db.disputes.filter(d => d.status === 'open');

        let payoutListHtml = '<p class="text-muted">No pending payout requests.</p>';
        if (pendingPayouts.length > 0) {
            payoutListHtml = pendingPayouts.map(payout => {
                const user = state.db.users.find(u => u.id === payout.userId);
                if (!user) return '';
                return `
                    <div class="card">
                        <p><strong>User:</strong> ${user.displayName} (${user.username})</p>
                        <p><strong>Amount:</strong> ZAR ${payout.amount.toFixed(2)}</p>
                        <p><strong>Bank:</strong> ${user.bankingDetails.bankName}</p>
                        <p><strong>Account:</strong> ${user.bankingDetails.accountNumber}</p>
                        <p><strong>Branch Code:</strong> ${user.bankingDetails.branchCode}</p>
                        <p><strong>Requested At:</strong> ${new Date(payout.createdAtISO).toLocaleString()}</p>
                        <button class="btn btn-success btn-block" style="margin-top: 1rem;" data-payout-id="${payout.id}">Mark as Paid</button>
                    </div>
                `;
            }).join('');
        }

        let depositListHtml = '<p class="text-muted">No pending deposit requests.</p>';
        if (pendingDeposits.length > 0) {
            depositListHtml = pendingDeposits.map(deposit => {
                const user = state.db.users.find(u => u.id === deposit.userId);
                if (!user) return '';
                return `
                    <div class="card">
                        <p><strong>User:</strong> ${user.displayName} (${user.username})</p>
                        <p><strong>Amount:</strong> ZAR ${deposit.amount.toFixed(2)}</p>
                        <p><strong>Reference:</strong> ${user.paymentReference}</p>
                        <p><strong>Requested At:</strong> ${new Date(deposit.createdAtISO).toLocaleString()}</p>
                        <button class="btn btn-success btn-block" style="margin-top: 1rem;" data-deposit-id="${deposit.id}">Approve Deposit</button>
                    </div>
                `;
            }).join('');
        }

        root.innerHTML = `
            <div class="dashboard-header">
                <h2>Admin Dashboard</h2>
                <div>
                    <button id="admin-users-btn" class="btn btn-info">Manage Users</button>
                    <button id="admin-disputes-btn" class="btn btn-warning" style="position: relative;">
                        Manage Disputes
                        ${openDisputes.length > 0 ? `<span class="notification-badge">${openDisputes.length}</span>` : ''}
                    </button>
                    <button id="admin-settings-btn" class="btn btn-secondary">Settings</button>
                </div>
            </div>
            <div class="card">
                <h3>Pending Deposit Requests</h3>
                <div id="deposit-list">${depositListHtml}</div>
            </div>
            <div class="card">
                <h3>Pending Payout Requests</h3>
                <div id="payout-list">${payoutListHtml}</div>
            </div>
        `;

        document.getElementById('admin-users-btn').addEventListener('click', () => {
            state.currentView = 'adminUsers';
            ui.render();
        });
        document.getElementById('admin-settings-btn').addEventListener('click', () => {
            state.currentView = 'adminSettings';
            ui.render();
        });
         document.getElementById('admin-disputes-btn').addEventListener('click', () => {
            state.currentView = 'adminDisputes';
            ui.render();
        });

        document.querySelectorAll('#payout-list button').forEach(button => {
            button.addEventListener('click', (e) => {
                handlers.handleMarkAsPaid(e.target.dataset.payoutId);
            });
        });

        document.querySelectorAll('#deposit-list button').forEach(button => {
            button.addEventListener('click', (e) => {
                handlers.handleApproveDeposit(e.target.dataset.depositId);
            });
        });
    },
    renderAdminUsers: () => {
        const root = document.getElementById('app-root');
        const users = state.db.users.filter(u => u.role !== 'admin'); // Exclude admin

        let tableRows = users.map(user => {
            const registeredDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
            return `
                <tr>
                    <td>${user.displayName}</td>
                    <td>${user.username}</td>
                    <td><span class="badge badge-${user.role === 'client' ? 'info' : 'success'}">${user.role}</span></td>
                    <td class="text-success">ZAR ${user.wallet.toFixed(2)}</td>
                    <td>${user.role === 'freelancer' ? user.reliabilityScore : 'N/A'}</td>
                    <td>${registeredDate}</td>
                </tr>
            `;
        }).join('');

        root.innerHTML = `
            <div class="dashboard-header">
                <h2>User Management</h2>
                <button id="admin-dashboard-btn" class="btn btn-outline">Back to Dashboard</button>
            </div>
            <div class="card">
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Display Name</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Wallet</th>
                                <th>Reliability</th>
                                <th>Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

         document.getElementById('admin-dashboard-btn').addEventListener('click', () => {
            state.currentView = 'dashboard';
            ui.render();
        });
    },
    renderAdminSettings: () => {
        const root = document.getElementById('app-root');
        const details = state.db.platformSettings.bankingDetails;
        root.innerHTML = `
            <div class="dashboard-header">
                <h2>Platform Settings</h2>
                <button id="admin-dashboard-btn" class="btn btn-outline">Back to Dashboard</button>
            </div>
            <div class="card">
                <h3>Banking Details for Deposits</h3>
                <form id="banking-details-form">
                    <div class="form-group">
                        <label for="platform-bank-name">Bank Name</label>
                        <input type="text" id="platform-bank-name" class="form-control" value="${details.bankName}" required>
                    </div>
                    <div class="form-group">
                        <label for="platform-account-number">Account Number</label>
                        <input type="text" id="platform-account-number" class="form-control" value="${details.accountNumber}" required>
                    </div>
                    <div class="form-group">
                        <label for="platform-branch-code">Branch Code</label>
                        <input type="text" id="platform-branch-code" class="form-control" value="${details.branchCode}" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
                </form>
            </div>
        `;

        document.getElementById('admin-dashboard-btn').addEventListener('click', () => {
            state.currentView = 'dashboard';
            ui.render();
        });
        document.getElementById('banking-details-form').addEventListener('submit', handlers.handleUpdatePlatformSettings);
    },
    renderAdminDisputes: () => {
        const root = document.getElementById('app-root');
        const openDisputes = state.db.disputes.filter(d => d.status === 'open');
        const resolvedDisputes = state.db.disputes.filter(d => d.status !== 'open');

        let openDisputesHtml = '<p class="text-muted">No open disputes.</p>';
        if (openDisputes.length > 0) {
            openDisputesHtml = openDisputes.map(dispute => {
                const job = state.db.jobs.find(j => j.id === dispute.jobId);
                const reporter = state.db.users.find(u => u.id === dispute.reporterId);
                return `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p><strong>Job:</strong> ${job ? job.title : 'N/A'}</p>
                                <p><strong>Reported by:</strong> ${reporter ? reporter.displayName : 'N/A'} (${reporter ? reporter.role : ''})</p>
                                <p><strong>Date:</strong> ${new Date(dispute.createdAtISO).toLocaleString()}</p>
                            </div>
                            <button class="btn btn-primary" data-dispute-id="${dispute.id}">View Details</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        root.innerHTML = `
            <div class="dashboard-header">
                <h2>Manage Disputes</h2>
                <button id="admin-dashboard-btn" class="btn btn-outline">Back to Dashboard</button>
            </div>
            <div class="card">
                <h3>Open Disputes</h3>
                <div id="open-disputes-list">${openDisputesHtml}</div>
            </div>
        `;

        document.getElementById('admin-dashboard-btn').addEventListener('click', () => {
            state.currentView = 'dashboard';
            ui.render();
        });

        document.querySelectorAll('#open-disputes-list button').forEach(button => {
            button.addEventListener('click', (e) => {
                handlers.handleShowDisputeModal(e.target.dataset.disputeId);
            });
        });
    },
    renderJobCards: (containerId, jobs) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (jobs.length === 0) {
            container.innerHTML = '<p>No jobs in this category.</p>';
            return;
        }
        
        container.innerHTML = '';
        jobs.forEach(job => {
            const card = ui.createJobCard(job);
            container.appendChild(card);
        });
    },
    createJobCard: (job) => {
        const template = document.getElementById('job-card-template');
        const card = template.content.cloneNode(true).firstElementChild;
        card.dataset.jobId = job.id;

        const userRole = state.currentUser.role;
        const distance = userRole === 'freelancer' && state.currentUser.lastKnownLocation ?
            geo.getDistance(state.currentUser.lastKnownLocation, job.location).toFixed(1) : 'N/A';

        card.querySelector('.job-title').textContent = job.title;
        card.querySelector('.job-category').textContent = job.category.replace(/-/g, ' ');
        card.querySelector('.job-category').classList.add(`badge-primary`);
        
        const descContainer = card.querySelector('.job-description');
        descContainer.innerHTML = `
            <p><strong>Responsibilities:</strong> ${job.description.responsibilities || 'Not specified'}</p>
            <p><strong>Requirements:</strong> ${job.description.requirements || 'Not specified'}</p>
        `;

        card.querySelector('.job-rate').textContent = job.hourlyRate.toFixed(2);
        card.querySelector('.job-pay-rate').textContent = `(per hour)`;
        card.querySelector('.job-dates').textContent = `${new Date(job.startTimeISO).toLocaleDateString()}`;
        card.querySelector('.job-duration').textContent = job.totalHours.toFixed(1);

        card.querySelector('.job-location').textContent = job.location.areaName;
        card.querySelector('.job-distance').textContent = distance;
        card.querySelector('.job-positions').textContent = `${job.assignedFreelancers.length} / ${job.positionsNeeded}`;

        const statusEl = card.querySelector('.job-status');
        statusEl.textContent = job.status;
        const statusColors = { open: 'success', assigned: 'info', completed: 'warning', paid: 'primary', expired: 'secondary', cancelled: 'danger' };
        statusEl.className = `badge job-status badge-${statusColors[job.status] || 'secondary'}`;

        const actionsContainer = card.querySelector('.job-actions');
        actionsContainer.innerHTML = ''; // Clear previous actions

        // Countdown Timer
        const timerWrapper = card.querySelector('.job-timer-wrapper');
        const timerEl = card.querySelector('.countdown-timer');
        if (job.status === 'open') {
            const updateTimer = () => {
                const timeLeft = new Date(job.startTimeISO) - new Date();
                if (timeLeft <= 0) {
                    timerEl.textContent = 'Expired';
                    card.querySelector('.job-status').textContent = 'expired';
                    card.querySelector('.job-status').className = 'badge job-status badge-secondary';
                    actionsContainer.innerHTML = '';
                    const timerIndex = state.timers.findIndex(t => t.jobId === job.id);
                    if (timerIndex > -1) {
                        clearInterval(state.timers[timerIndex].intervalId);
                        state.timers.splice(timerIndex, 1);
                    }
                } else {
                    const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
                    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
                    timerEl.textContent = `${hours}h ${minutes}m`;
                }
            };
            updateTimer();
            const intervalId = setInterval(updateTimer, 1000);
            state.timers.push({ jobId: job.id, intervalId: intervalId });
            timerWrapper.classList.remove('hidden');
        } else {
            timerWrapper.classList.add('hidden');
        }

        // Action Buttons
        if (userRole === 'freelancer') {
            if (job.status === 'open') {
                const applyBtn = document.createElement('button');
                applyBtn.className = 'btn btn-success';
                const hasApplied = job.applicants.some(app => app.freelancerId === state.currentUser.id);
                if (hasApplied) {
                    applyBtn.textContent = 'Applied';
                    applyBtn.disabled = true;
                } else {
                    applyBtn.textContent = 'Apply for Job';
                    applyBtn.onclick = () => handlers.handleApplyForJob(job.id);
                }
                actionsContainer.appendChild(applyBtn);

                const referBtn = document.createElement('button');
                referBtn.className = 'btn btn-info';
                referBtn.textContent = 'Refer a Friend';
                referBtn.onclick = () => handlers.handleReferJob(job.id);
                actionsContainer.appendChild(referBtn);

            } else if (job.status === 'assigned' && job.assignedFreelancers.includes(state.currentUser.id)) {
                const hasAcknowledged = job.acknowledgedBriefing.includes(state.currentUser.id);
                const hasBriefing = job.briefing && job.briefing.trim() !== '';

                if (hasBriefing && !hasAcknowledged) {
                    const ackBtn = document.createElement('button');
                    ackBtn.className = 'btn btn-warning';
                    ackBtn.textContent = 'Acknowledge Briefing';
                    ackBtn.onclick = () => handlers.handleShowBriefingModal(job.id);
                    actionsContainer.appendChild(ackBtn);
                }

                const checkInBtn = document.createElement('button');
                checkInBtn.className = 'btn btn-success';
                checkInBtn.textContent = 'Check-in';
                checkInBtn.disabled = hasBriefing && !hasAcknowledged;
                checkInBtn.onclick = () => handlers.handleShowCheckInModal(job.id);
                actionsContainer.appendChild(checkInBtn);

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn btn-danger';
                cancelBtn.textContent = 'Cancel Assignment';
                cancelBtn.onclick = () => handlers.promptForCancellation(job.id);
                actionsContainer.appendChild(cancelBtn);

            } else if (['completed', 'paid'].includes(job.status) && job.assignedFreelancers.includes(state.currentUser.id)) {
                const hasRated = state.db.reviews.some(r => r.jobId === job.id && r.fromUserId === state.currentUser.id);
                if (!hasRated) {
                    const rateBtn = document.createElement('button');
                    rateBtn.className = 'btn btn-warning';
                    rateBtn.textContent = 'Rate Organizer';
                    rateBtn.onclick = () => handlers.handleShowRateOrganizerModal(job.id, job.clientId);
                    actionsContainer.appendChild(rateBtn);
                }
            }
        } else if (userRole === 'client') {
            if (job.status === 'open') {
                const viewApplicantsBtn = document.createElement('button');
                viewApplicantsBtn.className = 'btn btn-primary';
                viewApplicantsBtn.textContent = `View Applicants (${job.applicants.length})`;
                viewApplicantsBtn.onclick = () => ui.renderApplicantsModal(job.id);
                actionsContainer.appendChild(viewApplicantsBtn);

                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-secondary';
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => handlers.handleShowEditJobModal(job.id);
                actionsContainer.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-danger';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => handlers.handleDeleteJob(job.id);
                actionsContainer.appendChild(deleteBtn);

            } else if (job.status === 'assigned') {
                const cancelJobBtn = document.createElement('button');
                cancelJobBtn.className = 'btn btn-danger';
                cancelJobBtn.textContent = 'Cancel Job';
                cancelJobBtn.onclick = () => handlers.promptForCancellation(job.id);
                actionsContainer.appendChild(cancelJobBtn);
                
                const completeBtn = document.createElement('button');
                completeBtn.className = 'btn btn-primary';
                completeBtn.textContent = 'Mark as Completed';
                completeBtn.onclick = () => handlers.handleCompleteJob(job.id);
                actionsContainer.appendChild(completeBtn);
            } else if (job.status === 'completed') {
                const payBtn = document.createElement('button');
                payBtn.className = 'btn btn-success';
                payBtn.textContent = 'Pay All Staff';
                payBtn.onclick = () => handlers.handlePayment(job.id);
                actionsContainer.appendChild(payBtn);
            }
        }

        // Chat button for assigned/completed/paid jobs
        if (['assigned', 'completed', 'paid'].includes(job.status) && (job.clientId === state.currentUser.id || job.assignedFreelancers.includes(state.currentUser.id))) {
            const chatBtn = document.createElement('button');
            chatBtn.className = 'btn btn-info chat-btn';
            chatBtn.textContent = 'Chat';
            chatBtn.dataset.jobId = job.id;
            chatBtn.dataset.jobTitle = job.title;
            actionsContainer.appendChild(chatBtn);
        }

        // Report Issue Button for both roles on assigned/completed jobs
        if (['assigned', 'completed'].includes(job.status) && (job.clientId === state.currentUser.id || job.assignedFreelancers.includes(state.currentUser.id))) {
            const hasReported = state.db.disputes.some(d => d.jobId === job.id && d.reporterId === state.currentUser.id);
            const reportBtn = document.createElement('button');
            reportBtn.className = 'btn btn-danger btn-outline';
            reportBtn.style.borderColor = 'var(--danger-color)';
            reportBtn.style.color = 'var(--danger-color)';
            if (hasReported) {
                reportBtn.textContent = 'Issue Reported';
                reportBtn.disabled = true;
            } else {
                reportBtn.textContent = 'Report Issue';
                reportBtn.onclick = () => handlers.handleShowReportIssueModal(job.id);
            }
            actionsContainer.appendChild(reportBtn);
        }
        
        return card;
    },
    showModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (modalId === 'edit-profile-modal') {
                const user = state.currentUser;
                document.getElementById('profile-displayName').value = user.displayName;
                document.getElementById('profile-bio').value = user.bio || '';
                document.getElementById('profile-photo-preview').src = user.photoDataURL || '';
                document.getElementById('profile-photo-preview').classList.toggle('hidden', !user.photoDataURL);
                
                const freelancerFields = document.getElementById('freelancer-fields');
                if (user.role === 'freelancer') {
                    freelancerFields.classList.remove('hidden');
                    ui.renderReliabilityScore();
                    ui.renderReferralCode();
                    const skillsContainer = document.getElementById('profile-skills-checklist');
                    skillsContainer.innerHTML = ''; // Clear old skills
                    for (const category in SKILLS) {
                        let categoryHtml = `
                            <details class="skills-category">
                                <summary>${category}</summary>
                        `;
                        categoryHtml += SKILLS[category].map(skill => `
                            <div class="skill-item">
                                <input type="checkbox" id="skill-${skill}" name="skills" value="${skill}" ${user.skills && user.skills.includes(skill) ? 'checked' : ''}>
                                <label for="skill-${skill}">${skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                            </div>
                        `).join('');
                        categoryHtml += `</details>`;
                        skillsContainer.innerHTML += categoryHtml;
                    }
                    ui.renderDocumentList();
                    ui.renderBackgroundCheckStatus();
                    ui.renderPortfolioList();
                } else {
                    freelancerFields.classList.add('hidden');
                }
            } else if (modalId === 'wallet-modal') {
                document.getElementById('modal-wallet-balance').textContent = `ZAR ${state.currentUser.wallet.toFixed(2)}`;
                const loadFundsSection = document.getElementById('load-funds-section');
                const payoutFundsSection = document.getElementById('payout-funds-section');
                if (state.currentUser.role === 'client') {
                    loadFundsSection.classList.remove('hidden');
                    payoutFundsSection.classList.add('hidden');
                    ui.renderLoadFundsForm();
                } else {
                    loadFundsSection.classList.add('hidden');
                    payoutFundsSection.classList.remove('hidden');
                    ui.renderBankingDetailsForm();
                }
            } else if (modalId === 'post-job-modal') {
                const categorySelect = document.getElementById('job-category');
                categorySelect.innerHTML = ''; // Clear old options
                for (const category in SKILLS) {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = category;
                    SKILLS[category].forEach(skill => {
                        const option = document.createElement('option');
                        option.value = skill;
                        option.textContent = skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        optgroup.appendChild(option);
                    });
                    categorySelect.appendChild(optgroup);
                }
                // Add listeners for dynamic fee calculation
                document.getElementById('job-hourly-rate').addEventListener('input', ui.updateFeeCalculation);
                document.getElementById('job-start-time').addEventListener('input', ui.updateFeeCalculation);
                document.getElementById('job-end-time').addEventListener('input', ui.updateFeeCalculation);
                document.getElementById('job-positions').addEventListener('input', ui.updateFeeCalculation);
                document.getElementById('job-category').addEventListener('change', ui.updateRateGuide);
                ui.updateFeeCalculation(); // Initial calculation
                ui.updateRateGuide();
            }
            modal.classList.remove('hidden');
        }
    },
    updateFeeCalculation: () => {
        const container = document.getElementById('fee-calculation');
        if (!container) return;

        const hourlyRateInput = document.getElementById('job-hourly-rate');
        const startTimeInput = document.getElementById('job-start-time');
        const endTimeInput = document.getElementById('job-end-time');
        const positionsInput = document.getElementById('job-positions');

        const hourlyRate = parseFloat(hourlyRateInput.value) || 0;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const positions = parseInt(positionsInput.value) || 1;

        if (hourlyRate <= 0 || !startTime || !endTime) {
            container.innerHTML = '<p class="text-muted">Enter rate and dates to see the cost breakdown.</p>';
            return;
        }

        const feeDetails = handlers.calculateUrgencyFee(startTime, hourlyRate, positions, endTime);

        container.innerHTML = `
            <h4>Cost Breakdown (${feeDetails.totalHours.toFixed(1)} hours)</h4>
            <p>Base Pay: ZAR ${feeDetails.baseBudget.toFixed(2)}</p>
            <p>Urgency Fee (${feeDetails.feePercentage}%): <span class="${feeDetails.feeAmount > 0 ? 'text-warning' : ''}">ZAR ${feeDetails.feeAmount.toFixed(2)}</span></p>
            <p>Platform Commission (20%): ZAR ${feeDetails.commission.toFixed(2)}</p>
            <hr style="margin: 0.5rem 0;">
            <p><strong>Total Escrow Amount: ZAR ${feeDetails.totalAmount.toFixed(2)}</strong></p>
        `;
    },
    updateRateGuide: () => {
        const category = document.getElementById('job-category').value;
        const guideContainer = document.getElementById('rate-guide');
        const rate = RATE_GUIDES[category];
        const minRate = MINIMUM_HOURLY_RATES[category];

        let content = '';
        if (rate) {
            content += `<p class="text-muted"><strong>Suggested Rate Guide:</strong> ${rate}</p>`;
        }
        if (minRate) {
            content += `<p class="text-danger" style="font-weight: bold;">Minimum Hourly Rate: ZAR ${minRate.toFixed(2)}</p>`;
        }

        if (content) {
            guideContainer.innerHTML = content;
            guideContainer.classList.remove('hidden');
        } else {
            guideContainer.classList.add('hidden');
        }
    },
    renderApplicantsModal: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        if (!job) return;

        const container = document.getElementById('applicants-list-container');
        container.innerHTML = '';

        if (job.applicants.length === 0) {
            container.innerHTML = '<p class="text-muted">No applicants yet.</p>';
        } else {
            // Sort applicants by reliability score (descending)
            const sortedApplicants = [...job.applicants].sort((a, b) => {
                const freelancerA = state.db.users.find(u => u.id === a.freelancerId);
                const freelancerB = state.db.users.find(u => u.id === b.freelancerId);
                return (freelancerB.reliabilityScore || 0) - (freelancerA.reliabilityScore || 0);
            });

            sortedApplicants.forEach(applicant => {
                const freelancer = state.db.users.find(u => u.id === applicant.freelancerId);
                if (!freelancer) return;

                const applicantEl = document.createElement('div');
                applicantEl.className = 'card';
                applicantEl.style.padding = '1rem';
                
                const isVerified = freelancer.documents && freelancer.documents.some(d => d.status === 'verified');
                const isBgChecked = freelancer.backgroundCheckStatus === 'verified';
                
                let badges = '';
                if (isVerified) {
                     badges += `<span class="badge badge-success" style="margin-left: 5px;">ID Verified</span>`;
                }
                 if (isBgChecked) {
                     badges += `<span class="badge badge-primary" style="margin-left: 5px;">BG Checked</span>`;
                }


                applicantEl.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${freelancer.displayName}</strong> ${badges}<br>
                            <small class="text-muted">Rating: ${freelancer.avgRating} ★ | Reliability: ${freelancer.reliabilityScore}</small>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            ${(freelancer.portfolio && freelancer.portfolio.length > 0) ? `<button class="btn btn-outline" data-freelancer-id="${freelancer.id}">Portfolio</button>` : ''}
                            <button class="btn btn-success" data-freelancer-id="${freelancer.id}">Hire</button>
                        </div>
                    </div>
                `;
                
                const hireBtn = applicantEl.querySelector('.btn-success');
                hireBtn.onclick = () => handlers.handleHireFreelancer(jobId, freelancer.id);
                
                const portfolioBtn = applicantEl.querySelector('.btn-outline');
                if (portfolioBtn) {
                    portfolioBtn.onclick = () => handlers.handleShowPortfolioModal(freelancer.id);
                }

                if(job.assignedFreelancers.includes(freelancer.id)) {
                    hireBtn.disabled = true;
                    hireBtn.textContent = 'Hired';
                }
                
                container.appendChild(applicantEl);
            });
        }

        ui.showModal('view-applicants-modal');
    },
    renderDocumentList: () => {
        const user = state.currentUser;
        const listEl = document.getElementById('documents-list');
        listEl.innerHTML = '';
        if (user.documents && user.documents.length > 0) {
            user.documents.forEach(doc => {
                const docEl = document.createElement('div');
                docEl.style.display = 'flex';
                docEl.style.justifyContent = 'space-between';
                docEl.style.alignItems = 'center';
                docEl.style.marginBottom = '0.5rem';
                docEl.style.padding = '0.5rem';
                docEl.style.borderRadius = '8px';
                docEl.style.backgroundColor = 'rgba(0,0,0,0.05)';

                const statusColors = { pending: 'warning', verified: 'success', rejected: 'danger' };
                const statusBadge = `<span class="badge badge-${statusColors[doc.status] || 'secondary'}">${doc.status}</span>`;

                docEl.innerHTML = `
                    <div>
                        <strong>${doc.name}</strong> (${doc.fileName})
                        ${statusBadge}
                    </div>
                    <div>
                        <button class="btn btn-secondary btn-sm" data-doc-id="${doc.id}" title="Simulate Admin Verification">Verify</button>
                        <button class="btn btn-danger btn-sm" data-doc-id="${doc.id}" title="Delete Document">&times;</button>
                    </div>
                `;
                docEl.querySelector('.btn-danger').addEventListener('click', (e) => {
                    const docId = parseInt(e.currentTarget.dataset.docId, 10);
                    handlers.handleDeleteDocument(docId);
                });
                 docEl.querySelector('.btn-secondary').addEventListener('click', (e) => {
                    const docId = parseInt(e.currentTarget.dataset.docId, 10);
                    handlers.handleAdminVerifyDocument(docId);
                });
                listEl.appendChild(docEl);
            });
        } else {
            listEl.innerHTML = '<p class="text-muted">No documents uploaded.</p>';
        }
    },
    renderPortfolioList: () => {
        const user = state.currentUser;
        const gridEl = document.getElementById('portfolio-grid');
        gridEl.innerHTML = '';
        if (user.portfolio && user.portfolio.length > 0) {
            user.portfolio.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'portfolio-item-card';
                itemEl.innerHTML = `
                    <img src="${item.imageDataURL}" alt="${item.title}">
                    <button class="delete-portfolio-btn" data-item-id="${item.id}">&times;</button>
                `;
                itemEl.querySelector('.delete-portfolio-btn').addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
                    handlers.handleDeletePortfolioItem(itemId);
                });
                gridEl.appendChild(itemEl);
            });
        } else {
            gridEl.innerHTML = '<p class="text-muted">No portfolio items uploaded yet.</p>';
        }
    },
    renderBackgroundCheckStatus: () => {
        const user = state.currentUser;
        const container = document.getElementById('background-check-status');
        let content = '';

        switch(user.backgroundCheckStatus) {
            case 'verified':
                content = `<p class="text-success"><strong>Status: Verified.</strong> Your background check is complete and approved.</p>`;
                break;
            case 'pending':
                content = `<p class="text-warning"><strong>Status: Pending.</strong> Your background check is being processed.</p>`;
                break;
             case 'failed':
                content = `<p class="text-danger"><strong>Status: Failed.</strong> Please contact support for more information.</p>`;
                break;
            case 'none':
            default:
                content = `
                    <p class="text-muted">Gain more trust and access to sensitive jobs by completing a background check.</p>
                    <button id="start-bg-check-btn" class="btn btn-primary btn-block" style="margin-top: 10px;">Start Background Check (Paid)</button>
                `;
                break;
        }
        container.innerHTML = content;
        document.getElementById('start-bg-check-btn')?.addEventListener('click', handlers.handleStartBackgroundCheck);
    },
    renderReliabilityScore: () => {
        const user = state.currentUser;
        const container = document.getElementById('reliability-score-section');
        container.innerHTML = `
            <h4>My Reliability</h4>
            <p style="font-size: 2rem; font-weight: bold;" class="text-primary">${user.reliabilityScore}</p>
            <div style="display: flex; justify-content: space-around; font-size: 0.9rem;">
                <span><strong class="text-success">${user.jobsCompleted}</strong> Completed</span>
                <span><strong class="text-danger">${user.cancellationsCount}</strong> Cancelled</span>
            </div>
        `;
    },
    renderReferralCode: () => {
        const user = state.currentUser;
        const container = document.getElementById('referral-code-section');
        container.innerHTML = `
            <h4>Your Referral Code</h4>
            <p class="text-muted">Share this code with friends! When they complete their first job, you both get a ZAR ${REFERRAL_BONUS.toFixed(2)} bonus.</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                <input type="text" id="referral-code-input" class="form-control" value="${user.referralCode}" readonly>
                <button id="copy-referral-btn" class="btn btn-secondary">Copy</button>
            </div>
        `;
        document.getElementById('copy-referral-btn').addEventListener('click', handlers.handleCopyReferralCode);
    },
    renderChatMessages: (jobId) => {
        const chat = state.db.chats.find(c => c.jobId === jobId);
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';

        if (!chat || chat.messages.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No messages yet. Start the conversation!</p>';
            return;
        }

        chat.messages.forEach(msg => {
            const msgEl = document.createElement('div');
            const sender = state.db.users.find(u => u.id === msg.senderId);
            const isSent = msg.senderId === state.currentUser.id;
            
            msgEl.className = `chat-message ${isSent ? 'sent' : 'received'}`;
            msgEl.innerHTML = `
                <strong>${isSent ? 'You' : sender.displayName}</strong>
                <p>${msg.text}</p>
                <span class="timestamp">${new Date(msg.timestampISO).toLocaleTimeString()}</span>
            `;
            container.appendChild(msgEl);
        });
        container.scrollTop = container.scrollHeight;
    },
    renderBankingDetailsForm: () => {
        const user = state.currentUser;
        const container = document.getElementById('banking-details-group');
        if (!user.bankingDetails) {
            container.innerHTML = `
                <p class="text-muted">Please add your banking details to request a payout.</p>
                <div class="form-group">
                    <label for="bank-name">Bank Name</label>
                    <input type="text" id="bank-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="account-number">Account Number</label>
                    <input type="text" id="account-number" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="branch-code">Branch Code</label>
                    <input type="text" id="branch-code" class="form-control" required>
                </div>
            `;
        } else {
            container.innerHTML = `
                <p><strong>Payout to:</strong> ${user.bankingDetails.bankName} - ****${user.bankingDetails.accountNumber.slice(-4)}</p>
                <a href="#" id="edit-banking-details-link">Edit Banking Details</a>
            `;
            document.getElementById('edit-banking-details-link').addEventListener('click', (e) => {
                e.preventDefault();
                user.bankingDetails = null; // Clear to show the form
                ui.renderBankingDetailsForm();
            });
        }
    },
    renderLoadFundsForm: () => {
        const container = document.getElementById('load-funds-section');
        const user = state.currentUser;
        container.innerHTML = `
            <hr style="margin: 1rem 0;">
            <h4>Load Funds via EFT</h4>
            <p class="text-muted">1. Make an EFT to the following account using your unique reference.</p>
            <div class="card" style="background-color: rgba(0,0,0,0.05);">
                <p><strong>Bank:</strong> ${state.db.platformSettings.bankingDetails.bankName}</p>
                <p><strong>Account Number:</strong> ${state.db.platformSettings.bankingDetails.accountNumber}</p>
                <p><strong>Branch Code:</strong> ${state.db.platformSettings.bankingDetails.branchCode}</p>
                <p><strong>Reference:</strong> <strong class="text-danger">${user.paymentReference}</strong></p>
            </div>
            <p class="text-muted">2. After paying, confirm the amount below to submit your deposit for verification.</p>
            <form id="load-funds-form">
                <div class="form-group">
                    <label for="load-amount">Amount Deposited (ZAR)</label>
                    <input type="number" id="load-amount" class="form-control" min="100" required>
                </div>
                <button type="submit" class="btn btn-success btn-block">I have made the payment</button>
            </form>
        `;
        document.getElementById('load-funds-form').addEventListener('submit', handlers.handleConfirmDeposit);
    },
    hideModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    },
    attachGlobalListeners: () => {
        // Close modals
        document.querySelectorAll('.modal .close-button').forEach(btn => {
            btn.onclick = () => btn.closest('.modal').classList.add('hidden');
        });
        document.querySelectorAll('.modal').forEach(modal => {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            };
        });
        
        // Attach form handlers
        document.getElementById('post-job-form')?.addEventListener('submit', handlers.handleSaveJob);
        document.getElementById('edit-profile-form')?.addEventListener('submit', handlers.handleEditProfile);
        document.getElementById('rate-freelancer-form')?.addEventListener('submit', handlers.handleRateFreelancer);
        document.getElementById('rate-organizer-form')?.addEventListener('submit', handlers.handleRateOrganizer);
        document.getElementById('report-issue-form')?.addEventListener('submit', handlers.handleReportIssue);
        document.getElementById('load-funds-form')?.addEventListener('submit', handlers.handleConfirmDeposit);
        document.getElementById('payout-funds-form')?.addEventListener('submit', handlers.handlePayoutFunds);
        document.getElementById('auto-detect-location-btn')?.addEventListener('click', handlers.handleAutoDetectLocation);
        document.getElementById('manual-location-form')?.addEventListener('submit', handlers.handleManualLocation);
        document.getElementById('add-document-form')?.addEventListener('submit', handlers.handleAddDocument);
        document.getElementById('add-portfolio-form')?.addEventListener('submit', handlers.handleAddPortfolioItem);
        document.getElementById('chat-form')?.addEventListener('submit', handlers.handleSendMessage);
        document.getElementById('acknowledge-briefing-btn')?.addEventListener('click', handlers.handleAcknowledgeBriefing);

        // Event delegation for chat buttons on job cards
        document.getElementById('app-root').addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('chat-btn')) {
                const jobId = e.target.dataset.jobId;
                const jobTitle = e.target.dataset.jobTitle;
                handlers.handleShowChatModal(jobId, jobTitle);
            }
        });


        // Confirmation Modal Handlers
        document.getElementById('cancel-action-btn').onclick = () => ui.hideModal('confirmation-modal');
        document.getElementById('confirm-action-btn').onclick = () => {
            if (state.confirmationCallback) {
                state.confirmationCallback();
            }
            ui.hideModal('confirmation-modal');
        };

        // Rating stars interaction
        document.querySelectorAll('.rating-stars .star').forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                star.parentElement.dataset.rating = value;
                star.parentElement.querySelectorAll('.star').forEach(s => {
                    s.classList.toggle('selected', s.dataset.value <= value);
                });
            });
        });
    }
};

// --- HANDLERS MODULE ---
const handlers = {
    handleThemeToggle: () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('swiftStaffTheme', isDarkMode ? 'dark' : 'light');
        document.getElementById('theme-toggle-btn').innerHTML = isDarkMode ? '☀️' : '🌙'
    },
    calculateUrgencyFee: (startTime, hourlyRate, positions, endTime) => {
        const now = new Date();
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
        
        const totalHours = Math.max(0, (endDate - startDate) / (1000 * 60 * 60));

        let feePercentage = 0;
        if (hoursUntilStart < 2) {
            feePercentage = 35; // 35% crisis fee
        } else if (hoursUntilStart < 12) {
            feePercentage = 25; // 25% fee
        } else if (hoursUntilStart < 24) {
            feePercentage = 15; // 15% fee
        }

        const baseBudget = hourlyRate * totalHours * positions;
        const feeAmount = baseBudget * (feePercentage / 100);
        const commission = baseBudget * PLATFORM_COMMISSION;
        const totalAmount = baseBudget + feeAmount + commission;

        return { baseBudget, feePercentage, feeAmount, commission, totalAmount, totalHours };
    },
    handleSaveJob: (e) => {
        e.preventDefault();
        
        const hourlyRate = parseFloat(document.getElementById('job-hourly-rate').value);
        const category = document.getElementById('job-category').value;
        const minRate = MINIMUM_HOURLY_RATES[category] || 0;

        if (hourlyRate < minRate) {
            notifications.showToast(`The hourly rate for '${category.replace(/-/g, ' ')}' must be at least ZAR ${minRate.toFixed(2)}.`);
            return; 
        }

        const jobId = document.getElementById('job-id').value;
        if (jobId) {
            // It's an edit
            const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
            if (jobIndex === -1) return;

            const originalJob = state.db.jobs[jobIndex];
            const originalTotal = originalJob.totalBudget;

            const startTime = document.getElementById('job-start-time').value;
            const endTime = document.getElementById('job-end-time').value;
            const positions = parseInt(document.getElementById('job-positions').value, 10);
            
            const newDetails = handlers.calculateUrgencyFee(startTime, hourlyRate, positions, endTime);
            const newTotal = newDetails.totalAmount;
            const costDifference = newTotal - originalTotal;

            if (costDifference > state.currentUser.wallet) {
                notifications.showToast(`Insufficient funds for this change. You need an additional ZAR ${costDifference.toFixed(2)}.`);
                return;
            }

            auth.updateUser(state.currentUser.id, { wallet: state.currentUser.wallet - costDifference });
            
            state.db.jobs[jobIndex] = {
                ...originalJob,
                title: document.getElementById('job-title').value,
                briefing: document.getElementById('job-briefing').value,
                positionsNeeded: positions,
                description: {
                    responsibilities: document.getElementById('job-responsibilities').value,
                    requirements: document.getElementById('job-requirements').value,
                    contact: document.getElementById('job-contact-person').value,
                },
                category: document.getElementById('job-category').value,
                hourlyRate: hourlyRate,
                totalHours: newDetails.totalHours,
                urgencyFee: newDetails.feeAmount,
                totalBudget: newDetails.totalAmount,
                location: {
                    ...originalJob.location,
                    areaName: document.getElementById('job-location-name').value,
                },
                radiusKm: parseInt(document.getElementById('job-radius').value, 10),
                startTimeISO: new Date(startTime).toISOString(),
                endTimeISO: new Date(endTime).toISOString(),
            };
            
            notifications.showToast("Job updated successfully!");

        } else {
            // It's a new job
            handlers.handlePostJob(e);
        }

        storage.saveDB(state.db);
        ui.hideModal('post-job-modal');
        ui.render();
    },
    handlePostJob: (e) => {
        const hourlyRate = parseFloat(document.getElementById('job-hourly-rate').value);
        const startTime = document.getElementById('job-start-time').value;
        const endTime = document.getElementById('job-end-time').value;
        const positions = parseInt(document.getElementById('job-positions').value, 10);

        if (!startTime || !endTime) {
            notifications.showToast("Please select a valid start and end time.");
            return;
        }
        if (new Date(endTime) <= new Date(startTime)) {
            notifications.showToast("End time must be after the start time.");
            return;
        }

        const feeDetails = handlers.calculateUrgencyFee(startTime, hourlyRate, positions, endTime);

        if (state.currentUser.wallet < feeDetails.totalAmount) {
            notifications.showToast(`Insufficient funds. You need ZAR ${feeDetails.totalAmount.toFixed(2)} but only have ZAR ${state.currentUser.wallet.toFixed(2)}.`);
            return;
        }

        const areaName = document.getElementById('job-location-name').value.toLowerCase().trim();
        const coords = AREA_COORDINATES[areaName] || AREA_COORDINATES['default'];

        const newJob = {
            id: `job-${Date.now()}`,
            title: document.getElementById('job-title').value,
            briefing: document.getElementById('job-briefing').value,
            positionsNeeded: positions,
            description: {
                responsibilities: document.getElementById('job-responsibilities').value,
                requirements: document.getElementById('job-requirements').value,
                contact: document.getElementById('job-contact-person').value,
            },
            category: document.getElementById('job-category').value,
            hourlyRate: hourlyRate,
            totalHours: feeDetails.totalHours,
            urgencyFee: feeDetails.feeAmount,
            totalBudget: feeDetails.totalAmount,
            location: {
                lat: coords.lat,
                lng: coords.lng,
                areaName: document.getElementById('job-location-name').value,
            },
            radiusKm: parseInt(document.getElementById('job-radius').value, 10),
            createdAtISO: new Date().toISOString(),
            startTimeISO: new Date(startTime).toISOString(),
            endTimeISO: new Date(endTime).toISOString(),
            status: 'open',
            clientId: state.currentUser.id,
            applicants: [],
            assignedFreelancers: [],
            acknowledgedBriefing: [],
            checkedIn: [],
        };
        state.db.jobs.push(newJob);

        // Deduct from client wallet
        auth.updateUser(state.currentUser.id, { wallet: state.currentUser.wallet - feeDetails.totalAmount });
        
        const eligibleFreelancers = state.db.users.filter(u => 
            u.role === 'freelancer' && 
            u.availability === 'available' &&
            u.skills.includes(newJob.category) &&
            geo.getDistance(u.lastKnownLocation, newJob.location) <= newJob.radiusKm
        );
        
        eligibleFreelancers.forEach(f => {
            notifications.create(f.id, `New '${newJob.category}' job posted near you: "${newJob.title}"`);
        });

        notifications.showToast("Job posted successfully! Funds are now in escrow.");
    },
    handleShowEditJobModal: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        if (!job) return;

        // --- Reset and populate the form ---
        const form = document.getElementById('post-job-form');
        form.reset(); // Clear previous entries

        document.getElementById('job-id').value = job.id;
        document.getElementById('job-title').value = job.title;
        document.getElementById('job-responsibilities').value = job.description.responsibilities;
        document.getElementById('job-requirements').value = job.description.requirements;
        document.getElementById('job-briefing').value = job.briefing || '';
        document.getElementById('job-contact-person').value = job.description.contact;
        document.getElementById('job-category').value = job.category;
        document.getElementById('job-hourly-rate').value = job.hourlyRate;
        document.getElementById('job-positions').value = job.positionsNeeded;

        // Helper function to format date for datetime-local input
        const toLocalISOString = (isoString) => {
            const date = new Date(isoString);
            const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
            return localISOTime.substring(0, 16); // YYYY-MM-DDTHH:MM
        };

        document.getElementById('job-start-time').value = toLocalISOString(job.startTimeISO);
        document.getElementById('job-end-time').value = toLocalISOString(job.endTimeISO);

        document.getElementById('job-location-name').value = job.location.areaName;
        document.getElementById('job-radius').value = job.radiusKm;

        // Update modal title and button text
        document.querySelector('#post-job-modal .modal-title').textContent = 'Edit Job';
        document.getElementById('save-job-btn').textContent = 'Save Changes';

        ui.showModal('post-job-modal');
    },
    handleDeleteJob: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        if (!job) return;

        if (job.status !== 'open' || job.assignedFreelancers.length > 0) {
            notifications.showToast("Cannot delete a job that is assigned or no longer open.");
            return;
        }

        document.getElementById('confirmation-title').textContent = 'Confirm Deletion';
        document.getElementById('confirmation-message').textContent = `Are you sure you want to delete the job "${job.title}"? The escrowed amount of ZAR ${job.totalBudget.toFixed(2)} will be refunded to your wallet.`;
        state.confirmationCallback = () => {
            const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
            if (jobIndex > -1) {
                // Refund client
                const client = state.db.users.find(u => u.id === job.clientId);
                if (client) {
                    auth.updateUser(client.id, { wallet: client.wallet + job.totalBudget });
                }

                // Remove job
                state.db.jobs.splice(jobIndex, 1);
                storage.saveDB(state.db);
                notifications.showToast("Job deleted and funds refunded.");
                ui.render();
            }
        };
        ui.showModal('confirmation-modal');
    },
    handleEditProfile: async (e) => {
        e.preventDefault();
        const updates = {
            displayName: document.getElementById('profile-displayName').value,
        };
        
        const photoFile = document.getElementById('profile-photo').files[0];
        if (photoFile) {
            updates.photoDataURL = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(photoFile);
            });
        }

        if (state.currentUser.role === 'freelancer') {
            updates.skills = Array.from(document.querySelectorAll('#profile-skills-checklist input:checked')).map(el => el.value);
            updates.bio = document.getElementById('profile-bio').value;
        }
        
        auth.updateUser(state.currentUser.id, updates);
        ui.hideModal('edit-profile-modal');
        ui.render();
        notifications.showToast("Profile updated successfully!");
    },
    handleAddDocument: async (e) => {
        e.preventDefault();
        const docName = document.getElementById('document-name').value;
        const docFile = document.getElementById('document-file').files[0];

        if (!docName || !docFile) {
            notifications.showToast("Please provide both a name and a file.");
            return;
        }

        const newDoc = {
            id: Date.now(),
            name: docName,
            fileName: docFile.name,
            status: 'pending', // Initial status
            dataURL: await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(docFile);
            })
        };

        const user = state.currentUser;
        if (!user.documents) {
            user.documents = [];
        }
        user.documents.push(newDoc);
        auth.updateUser(user.id, { documents: user.documents });

        document.getElementById('add-document-form').reset();
        ui.renderDocumentList();
        notifications.showToast("Document uploaded for verification.");
    },
    handleDeleteDocument: (docId) => {
        const user = state.currentUser;
        const docIndex = user.documents.findIndex(d => d.id === docId);
        if (docIndex > -1) {
            user.documents.splice(docIndex, 1);
            auth.updateUser(user.id, { documents: user.documents });
            ui.renderDocumentList();
            notifications.showToast("Document removed.");
        }
    },
    handleAddPortfolioItem: async (e) => {
        e.preventDefault();
        const title = document.getElementById('portfolio-title').value;
        const file = document.getElementById('portfolio-file').files[0];

        if (!title || !file) {
            notifications.showToast("Please provide both a title and an image file.");
            return;
        }

        const newItem = {
            id: Date.now(),
            title: title,
            imageDataURL: await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            })
        };

        const user = state.currentUser;
        if (!user.portfolio) {
            user.portfolio = [];
        }
        user.portfolio.push(newItem);
        auth.updateUser(user.id, { portfolio: user.portfolio });

        document.getElementById('add-portfolio-form').reset();
        ui.renderPortfolioList();
        notifications.showToast("Portfolio item added.");
    },
    handleDeletePortfolioItem: (itemId) => {
        const user = state.currentUser;
        const itemIndex = user.portfolio.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
            user.portfolio.splice(itemIndex, 1);
            auth.updateUser(user.id, { portfolio: user.portfolio });
            ui.renderPortfolioList();
            notifications.showToast("Portfolio item removed.");
        }
    },
    handleAdminVerifyDocument: (docId) => {
        // This is a simulation of an admin action
        const user = state.currentUser;
        const docIndex = user.documents.findIndex(d => d.id === docId);
         if (docIndex > -1) {
            user.documents[docIndex].status = 'verified';
            auth.updateUser(user.id, { documents: user.documents });
            ui.renderDocumentList();
            notifications.showToast(`${user.documents[docIndex].name} has been verified!`);
        }
    },
    handleStartBackgroundCheck: () => {
        // This is a simulation
        notifications.showToast("Redirecting to our trusted partner for background check...");
        setTimeout(() => {
            auth.updateUser(state.currentUser.id, { backgroundCheckStatus: 'pending' });
            notifications.showToast("Your background check is now pending.");
            ui.renderBackgroundCheckStatus();
            
            // Simulate completion after a delay
            setTimeout(() => {
                 auth.updateUser(state.currentUser.id, { backgroundCheckStatus: 'verified' });
                 notifications.showToast("Your background check has been successfully verified!");
                 ui.renderBackgroundCheckStatus();
            }, 10000); // 10 seconds for demo
        }, 2000);
    },
    handleAvailabilityToggle: async (e) => {
        e.preventDefault();
        const user = state.currentUser;
        const isGoingOnline = user.availability === 'away';

        if (isGoingOnline) {
            await notifications.requestPermission();
            if (!user.lastKnownLocation) {
                ui.showModal('set-location-modal');
                return;
            }
        }
        
        const newStatus = isGoingOnline ? 'available' : 'away';
        auth.updateUser(user.id, { availability: newStatus });
        ui.render();
        notifications.showToast(isGoingOnline ? "You are now online and visible for jobs." : "You are now offline.");
    },
    handleAutoDetectLocation: async () => {
        try {
            const location = await geo.requestLocation();
            auth.updateUser(state.currentUser.id, { lastKnownLocation: location });
            ui.hideModal('set-location-modal');
            auth.updateUser(state.currentUser.id, { availability: 'available' });
            ui.render();
            notifications.showToast("Location updated and you are now online!");
        } catch (error) {
            notifications.showToast(error);
        }
    },
    handleManualLocation: (e) => {
        e.preventDefault();
        const areaName = document.getElementById('manual-area-name').value.toLowerCase().trim();
        const location = AREA_COORDINATES[areaName] || AREA_COORDINATES['default'];
        
        auth.updateUser(state.currentUser.id, { lastKnownLocation: location });
        ui.hideModal('set-location-modal');
        auth.updateUser(state.currentUser.id, { availability: 'available' });
        ui.render();
        notifications.showToast("Location updated and you are now online!");
    },
    handleApplyForJob: (jobId) => {
        const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return;
        
        const job = state.db.jobs[jobIndex];
        const alreadyApplied = job.applicants.some(app => app.freelancerId === state.currentUser.id);

        if (job.status !== 'open' || alreadyApplied) {
            notifications.showToast(alreadyApplied ? "You have already applied for this job." : "This job is no longer available.");
            return;
        }
        
        job.applicants.push({
            freelancerId: state.currentUser.id,
            appliedAtISO: new Date().toISOString()
        });
        storage.saveDB(state.db);
        
        notifications.create(job.clientId, `${state.currentUser.displayName} has applied for your job: "${job.title}".`);
        notifications.showToast("Application submitted!");
        ui.render();
    },
    handleReferJob: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        const user = state.currentUser;

        if (!job || !user.referralCode) {
            notifications.showToast("Could not generate referral link.");
            return;
        }

        const referralMessage = `Hey! Check out this job on FullFlux: "${job.title}". Sign up with my referral code to get a bonus: ${user.referralCode}`;

        const textArea = document.createElement("textarea");
        textArea.value = referralMessage;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            notifications.showToast("Referral message copied to clipboard!");
        } catch (err) {
            notifications.showToast("Failed to copy referral message.");
        }
        document.body.removeChild(textArea);
    },
    handleHireFreelancer: (jobId, freelancerId) => {
        const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return;
        
        const job = state.db.jobs[jobIndex];
        if (job.assignedFreelancers.length >= job.positionsNeeded) {
            notifications.showToast("All positions for this job are filled.");
            return;
        }

        // Create chat on first hire
        const chatExists = state.db.chats.some(c => c.jobId === jobId);
        if (!chatExists) {
            state.db.chats.push({ id: `chat-${jobId}`, jobId: jobId, messages: [] });
        }

        job.assignedFreelancers.push(freelancerId);
        
        if (job.assignedFreelancers.length >= job.positionsNeeded) {
            job.status = 'assigned';
            // Notify unsuccessful applicants
            const hiredIds = new Set(job.assignedFreelancers);
            const unsuccessfulApplicants = job.applicants.filter(app => !hiredIds.has(app.freelancerId));

            unsuccessfulApplicants.forEach(applicant => {
                notifications.create(
                    applicant.freelancerId, 
                    `The job "${job.title}" you applied for has now been filled.`,
                    'general'
                );
            });
        }
        
        storage.saveDB(state.db);
        
        notifications.create(freelancerId, `You have been hired for the job: "${job.title}"!`);
        notifications.showToast("Freelancer hired!");
        
        ui.renderApplicantsModal(jobId);
        ui.render();
    },
    handleCompleteJob: (jobId) => {
        const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return;

        state.db.jobs[jobIndex].status = 'completed';
        storage.saveDB(state.db);
        
        state.db.jobs[jobIndex].assignedFreelancers.forEach(fId => {
            notifications.create(fId, `Your job "${state.db.jobs[jobIndex].title}" has been marked as completed by the client.`);
        });
        notifications.showToast("Job marked as complete. You can now rate and pay the staff.");
        ui.render();
    },
    handleShowRateModal: (jobId, freelancerId) => {
        document.getElementById('rate-job-id').value = jobId;
        document.getElementById('rate-freelancer-id').value = freelancerId;
        ui.showModal('rate-freelancer-modal');
    },
    handleRateFreelancer: (e) => {
        e.preventDefault();
        const jobId = document.getElementById('rate-job-id').value;
        const freelancerId = document.getElementById('rate-freelancer-id').value;
        const stars = parseInt(document.querySelector('#rate-freelancer-modal .rating-stars').dataset.rating, 10);
        const text = document.getElementById('review-text').value;

        if (stars === 0) {
            notifications.showToast("Please select a star rating.");
            return;
        }

        const newReview = {
            id: `review-${Date.now()}`,
            jobId,
            fromUserId: state.currentUser.id,
            toUserId: freelancerId,
            fromRole: 'client',
            stars,
            text,
            createdAtISO: new Date().toISOString(),
        };
        state.db.reviews.push(newReview);
        
        const freelancer = state.db.users.find(u => u.id === freelancerId);
        const totalStars = (freelancer.avgRating * freelancer.ratingsCount) + stars;
        const newRatingsCount = freelancer.ratingsCount + 1;
        const newAvgRating = totalStars / newRatingsCount;
        
        auth.updateUser(freelancerId, {
            avgRating: parseFloat(newAvgRating.toFixed(2)),
            ratingsCount: newRatingsCount,
        });
        
        storage.saveDB(state.db);
        ui.hideModal('rate-freelancer-modal');
        ui.render();
        notifications.showToast("Review submitted. Thank you!");
    },
    handleShowRateOrganizerModal: (jobId, organizerId) => {
        document.getElementById('rate-organizer-job-id').value = jobId;
        document.getElementById('rate-organizer-id').value = organizerId;
        ui.showModal('rate-organizer-modal');
    },
    handleRateOrganizer: (e) => {
        e.preventDefault();
        const jobId = document.getElementById('rate-organizer-job-id').value;
        const organizerId = document.getElementById('rate-organizer-id').value;
        const stars = parseInt(document.querySelector('#rate-organizer-modal .rating-stars').dataset.rating, 10);
        const text = document.getElementById('organizer-review-text').value;

        if (stars === 0) {
            notifications.showToast("Please select a star rating.");
            return;
        }

        const newReview = {
            id: `review-${Date.now()}`,
            jobId,
            fromUserId: state.currentUser.id,
            toUserId: organizerId,
            fromRole: 'freelancer',
            stars,
            text,
            createdAtISO: new Date().toISOString(),
        };
        state.db.reviews.push(newReview);
        
        const organizer = state.db.users.find(u => u.id === organizerId);
        const totalStars = (organizer.avgRating * organizer.ratingsCount) + stars;
        const newRatingsCount = organizer.ratingsCount + 1;
        const newAvgRating = totalStars / newRatingsCount;
        
        auth.updateUser(organizerId, {
            avgRating: parseFloat(newAvgRating.toFixed(2)),
            ratingsCount: newRatingsCount,
        });
        
        storage.saveDB(state.db);
        ui.hideModal('rate-organizer-modal');
        ui.render();
        notifications.showToast("Review for organizer submitted. Thank you!");
    },
    handleShowReportIssueModal: (jobId) => {
        document.getElementById('report-job-id').value = jobId;
        ui.showModal('report-issue-modal');
    },
    handleReportIssue: (e) => {
        e.preventDefault();
        const jobId = document.getElementById('report-job-id').value;
        const issueText = document.getElementById('issue-text').value;

        const newDispute = {
            id: `dispute-${Date.now()}`,
            jobId,
            reporterId: state.currentUser.id,
            issueText,
            createdAtISO: new Date().toISOString(),
            status: 'open',
            resolution: null
        };
        state.db.disputes.push(newDispute);
        storage.saveDB(state.db);
        
        ui.hideModal('report-issue-modal');
        ui.render();
        notifications.showToast("Issue reported. An admin will review it shortly.");
    },
    handlePayment: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        
        // Pay freelancers and update their reliability score
        job.assignedFreelancers.forEach(fId => {
            const freelancer = state.db.users.find(u => u.id === fId);
            if (freelancer) {
                const payoutAmount = job.hourlyRate * job.totalHours;
                const updates = {
                    wallet: freelancer.wallet + payoutAmount,
                    reliabilityScore: (freelancer.reliabilityScore || 100) + 5,
                    jobsCompleted: (freelancer.jobsCompleted || 0) + 1,
                };

                // Check for referral bonus on first job completion
                if (!freelancer.firstJobCompleted && freelancer.referredBy) {
                    const referrer = state.db.users.find(u => u.id === freelancer.referredBy);
                    if (referrer) {
                        updates.wallet += REFERRAL_BONUS;
                        auth.updateUser(referrer.id, { wallet: referrer.wallet + REFERRAL_BONUS });
                        notifications.create(referrer.id, `You earned a ZAR ${REFERRAL_BONUS.toFixed(2)} bonus! Your referral, ${freelancer.displayName}, completed their first job.`);
                        notifications.create(freelancer.id, `You earned a ZAR ${REFERRAL_BONUS.toFixed(2)} referral bonus for completing your first job!`);
                    }
                    updates.firstJobCompleted = true;
                }

                auth.updateUser(fId, updates);
                notifications.create(fId, `You have been paid ZAR ${payoutAmount.toFixed(2)} for the job "${job.title}".`);
            }
        });

        // Pay platform
        const totalFreelancerCost = job.hourlyRate * job.totalHours * job.assignedFreelancers.length;
        const platformCommission = totalFreelancerCost * PLATFORM_COMMISSION;
        const platformTotalEarnings = platformCommission + job.urgencyFee;
        state.db.platformWallet += platformTotalEarnings;
        
        const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
        state.db.jobs[jobIndex].status = 'paid';
        storage.saveDB(state.db);

        notifications.showToast("Payment successful! All staff have been paid.");
        ui.render();
    },
    handleConfirmDeposit: (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('load-amount').value);
        if (amount > 0) {
            const newRequest = {
                id: `deposit-${Date.now()}`,
                userId: state.currentUser.id,
                amount: amount,
                status: 'pending',
                createdAtISO: new Date().toISOString(),
            };
            state.db.depositRequests.push(newRequest);
            storage.saveDB(state.db);
            ui.hideModal('wallet-modal');
            notifications.showToast(`Deposit of ZAR ${amount.toFixed(2)} submitted for verification.`);
        }
    },
    handlePayoutFunds: (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('payout-amount').value);
        const user = state.currentUser;

        if (amount <= 0) {
            notifications.showToast("Please enter a valid amount.");
            return;
        }
        if (amount > user.wallet) {
            notifications.showToast("Insufficient funds for this payout.");
            return;
        }

        // Save banking details if they are new
        const bankName = document.getElementById('bank-name')?.value;
        if (bankName) { // If the form is present, details are being updated
            const newBankingDetails = {
                bankName: bankName,
                accountNumber: document.getElementById('account-number').value,
                branchCode: document.getElementById('branch-code').value,
            };
            auth.updateUser(user.id, { bankingDetails: newBankingDetails });
        }

        const newRequest = {
            id: `payout-${Date.now()}`,
            userId: user.id,
            amount: amount,
            status: 'pending',
            createdAtISO: new Date().toISOString()
        };
        state.db.payoutRequests.push(newRequest);
        storage.saveDB(state.db);

        ui.hideModal('wallet-modal');
        ui.render();
        notifications.showToast(`Payout request for ZAR ${amount.toFixed(2)} submitted for manual processing.`);
    },
    handleShowChatModal: (jobId, jobTitle) => {
        const chatForm = document.getElementById('chat-form');
        chatForm.dataset.jobId = jobId;
        document.getElementById('chat-title').textContent = `Chat: ${jobTitle}`;
        ui.renderChatMessages(jobId);
        ui.showModal('chat-modal');
    },
    handleSendMessage: (e) => {
        e.preventDefault();
        const jobId = e.target.dataset.jobId;
        const messageInput = document.getElementById('chat-message-input');
        const text = messageInput.value.trim();

        if (!text || !jobId) return;

        const chat = state.db.chats.find(c => c.jobId === jobId);
        const job = state.db.jobs.find(j => j.id === jobId);
        if (!chat || !job) return;

        const newMessage = {
            senderId: state.currentUser.id,
            text,
            timestampISO: new Date().toISOString()
        };

        chat.messages.push(newMessage);
        storage.saveDB(state.db);
        messageInput.value = '';
        ui.renderChatMessages(jobId);

        // Notify other participants
        const participants = [job.clientId, ...job.assignedFreelancers];
        const otherParticipants = participants.filter(id => id !== state.currentUser.id);
        
        otherParticipants.forEach(userId => {
            notifications.create(userId, `New message from ${state.currentUser.displayName} in "${job.title}" chat.`, 'chat', jobId);
        });
    },
    handleShowBriefingModal: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        if (!job) return;
        document.getElementById('briefing-title').textContent = `Briefing: ${job.title}`;
        document.getElementById('briefing-content').textContent = job.briefing;
        document.getElementById('acknowledge-briefing-btn').dataset.jobId = jobId;
        ui.showModal('briefing-modal');
    },
    handleAcknowledgeBriefing: (e) => {
        const jobId = e.target.dataset.jobId;
        const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return;

        state.db.jobs[jobIndex].acknowledgedBriefing.push(state.currentUser.id);
        storage.saveDB(state.db);
        ui.hideModal('briefing-modal');
        notifications.showToast("Briefing acknowledged!");
        ui.render();
    },
    handleShowCheckInModal: (jobId) => {
        // In a real app, this would generate a unique QR code.
        // For now, we'll just show the modal.
        ui.showModal('check-in-modal');
    },
    handleCopyReferralCode: () => {
        const codeInput = document.getElementById('referral-code-input');
        codeInput.select();
        codeInput.setSelectionRange(0, 99999); // For mobile devices
        try {
            document.execCommand('copy');
            notifications.showToast("Referral code copied!");
        } catch (err) {
            notifications.showToast("Failed to copy code.");
        }
    },
    promptForCancellation: (jobId) => {
        const job = state.db.jobs.find(j => j.id === jobId);
        const user = state.currentUser;
        let message = '';
        const totalJobValue = job.hourlyRate * job.totalHours;

        if (user.role === 'freelancer') {
            const penalty = (totalJobValue * 0.25).toFixed(2);
            message = `You will be charged a ZAR ${penalty} penalty and your Reliability Score will decrease. Do you wish to proceed?`;
        } else if (user.role === 'client') {
            const penaltyPerPerson = (totalJobValue * 0.50).toFixed(2);
            const totalPenalty = (penaltyPerPerson * job.assignedFreelancers.length).toFixed(2);
            message = `You will pay a ZAR ${penaltyPerPerson} fee to each of the ${job.assignedFreelancers.length} hired freelancer(s), for a total of ZAR ${totalPenalty}. Do you wish to proceed?`;
        }

        document.getElementById('confirmation-title').textContent = 'Confirm Cancellation';
        document.getElementById('confirmation-message').textContent = message;
        state.confirmationCallback = () => handlers.confirmCancellation(jobId);
        ui.showModal('confirmation-modal');
    },
    confirmCancellation: (jobId) => {
        const jobIndex = state.db.jobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) return;
        const job = state.db.jobs[jobIndex];
        const user = state.currentUser;
        const totalJobValue = job.hourlyRate * job.totalHours;

        if (user.role === 'freelancer') {
            // Freelancer cancels their own assignment
            const penalty = totalJobValue * 0.25;
            auth.updateUser(user.id, { 
                wallet: user.wallet - penalty,
                reliabilityScore: (user.reliabilityScore || 100) - 25,
                cancellationsCount: (user.cancellationsCount || 0) + 1,
            });

            // Remove freelancer from job
            job.assignedFreelancers = job.assignedFreelancers.filter(id => id !== user.id);
            job.status = 'open'; // Re-open the job for others

            state.db.cancellations.push({ jobId, userId: user.id, role: 'freelancer', penalty, timestampISO: new Date().toISOString() });
            notifications.create(job.clientId, `${user.displayName} has cancelled their assignment for "${job.title}". The position is now open again.`);
            notifications.showToast('You have cancelled your assignment. A penalty has been applied.');

        } else if (user.role === 'client') {
            // Client cancels the entire job
            const penaltyPerPerson = totalJobValue * 0.50;
            const totalPenalty = penaltyPerPerson * job.assignedFreelancers.length;

            if (user.wallet < totalPenalty) {
                notifications.showToast("Insufficient funds to cover cancellation fees.");
                return;
            }

            auth.updateUser(user.id, { wallet: user.wallet - totalPenalty });

            job.assignedFreelancers.forEach(freelancerId => {
                const freelancer = state.db.users.find(u => u.id === freelancerId);
                if (freelancer) {
                    auth.updateUser(freelancerId, { wallet: freelancer.wallet + penaltyPerPerson });
                    notifications.create(freelancerId, `The job "${job.title}" was cancelled by the client. You have been compensated ZAR ${penaltyPerPerson.toFixed(2)}.`);
                }
            });

            job.status = 'cancelled';
            state.db.cancellations.push({ jobId, userId: user.id, role: 'client', penalty: totalPenalty, timestampISO: new Date().toISOString() });
            notifications.showToast('Job cancelled. Freelancers have been compensated.');
        }
        
        storage.saveDB(state.db);
        ui.render();
    },
    handleMarkAsPaid: (payoutId) => {
        const payoutIndex = state.db.payoutRequests.findIndex(p => p.id === payoutId);
        if (payoutIndex === -1) return;

        const payout = state.db.payoutRequests[payoutIndex];
        const user = state.db.users.find(u => u.id === payout.userId);

        if (user) {
            auth.updateUser(user.id, { wallet: user.wallet - payout.amount });
            notifications.create(user.id, `Your payout of ZAR ${payout.amount.toFixed(2)} has been processed.`);
        }

        state.db.payoutRequests[payoutIndex].status = 'paid';
        storage.saveDB(state.db);
        ui.render();
        notifications.showToast("Payout marked as paid.");
    },
    handleApproveDeposit: (depositId) => {
        const depositIndex = state.db.depositRequests.findIndex(d => d.id === depositId);
        if (depositIndex === -1) return;

        const deposit = state.db.depositRequests[depositIndex];
        const user = state.db.users.find(u => u.id === deposit.userId);

        if (user) {
            auth.updateUser(user.id, { wallet: user.wallet + deposit.amount });
            notifications.create(user.id, `Your deposit of ZAR ${deposit.amount.toFixed(2)} has been approved and added to your wallet.`);
        }

        state.db.depositRequests[depositIndex].status = 'approved';
        storage.saveDB(state.db);
        ui.render();
        notifications.showToast("Deposit approved.");
    },
    handleUpdatePlatformSettings: (e) => {
        e.preventDefault();
        const newSettings = {
            bankName: document.getElementById('platform-bank-name').value,
            accountNumber: document.getElementById('platform-account-number').value,
            branchCode: document.getElementById('platform-branch-code').value,
        };
        state.db.platformSettings.bankingDetails = newSettings;
        storage.saveDB(state.db);
        notifications.showToast("Banking details updated successfully!");
        state.currentView = 'dashboard';
        ui.render();
    },
    handleShowDisputeModal: (disputeId) => {
        const dispute = state.db.disputes.find(d => d.id === disputeId);
        if (!dispute) return;

        const job = state.db.jobs.find(j => j.id === dispute.jobId);
        const reporter = state.db.users.find(u => u.id === dispute.reporterId);
        const client = state.db.users.find(u => u.id === job.clientId);
        const freelancers = job.assignedFreelancers.map(id => state.db.users.find(u => u.id === id));
        const chat = state.db.chats.find(c => c.jobId === dispute.jobId);

        const container = document.getElementById('dispute-details-content');
        
        let chatHtml = '<p class="text-muted">No chat history for this job.</p>';
        if (chat && chat.messages.length > 0) {
            chatHtml = chat.messages.map(msg => {
                const sender = state.db.users.find(u => u.id === msg.senderId);
                return `<p><small>${new Date(msg.timestampISO).toLocaleString()}</small> <strong>${sender.displayName}:</strong> ${msg.text}</p>`;
            }).join('');
        }

        container.innerHTML = `
            <div class="job-grid" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="card">
                    <h4>Job Details</h4>
                    <p><strong>Title:</strong> ${job.title}</p>
                    <p><strong>Status:</strong> ${job.status}</p>
                    <p><strong>Rate:</strong> ZAR ${job.hourlyRate.toFixed(2)}/hr for ${job.totalHours.toFixed(1)} hours</p>
                </div>
                <div class="card">
                    <h4>Participants</h4>
                    <p><strong>Client:</strong> ${client.displayName}</p>
                    <p><strong>Freelancer(s):</strong> ${freelancers.map(f => f.displayName).join(', ')}</p>
                </div>
            </div>

            <div class="card">
                <h4>Dispute Details</h4>
                <p><strong>Reported by:</strong> ${reporter.displayName} (${reporter.role})</p>
                <p><strong>Complaint:</strong></p>
                <p style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 8px;">${dispute.issueText}</p>
            </div>

            <div class="card">
                <h4>Chat History</h4>
                <div class="chat-messages" style="max-height: 200px;">${chatHtml}</div>
            </div>

            <div class="card">
                <h4>Admin Actions</h4>
                <p class="text-muted">Select a resolution. This action is final.</p>
                <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                     <button class="btn btn-success" onclick="handlers.handleResolveDispute('${dispute.id}', 'favor_freelancer')">Rule in Favor of Freelancer</button>
                     <button class="btn btn-primary" onclick="handlers.handleResolveDispute('${dispute.id}', 'favor_client')">Rule in Favor of Client</button>
                     <button class="btn btn-secondary" onclick="handlers.handleResolveDispute('${dispute.id}', 'dismiss')">Dismiss Case</button>
                </div>
            </div>
        `;
        ui.showModal('dispute-resolution-modal');
    },
    handleResolveDispute: (disputeId, resolution) => {
        const disputeIndex = state.db.disputes.findIndex(d => d.id === disputeId);
        if (disputeIndex === -1) return;

        const dispute = state.db.disputes[disputeIndex];
        const job = state.db.jobs.find(j => j.id === dispute.jobId);
        const reporter = state.db.users.find(u => u.id === dispute.reporterId);
        const client = state.db.users.find(u => u.id === job.clientId);
        const freelancers = job.assignedFreelancers.map(id => state.db.users.find(u => u.id === id));
        
        let resolutionMessage = '';

        switch(resolution) {
            case 'favor_freelancer':
                // For simplicity, we'll assume a full payout if in favor of freelancer
                handlers.handlePayment(job.id); // Re-use payment logic
                resolutionMessage = `Resolved in favor of the freelancer. Payment of ZAR ${(job.hourlyRate * job.totalHours).toFixed(2)} processed.`;
                dispute.status = 'resolved_freelancer';
                break;
            case 'favor_client':
                // Refund the client the total escrowed amount for the job
                auth.updateUser(client.id, { wallet: client.wallet + job.totalBudget });
                resolutionMessage = `Resolved in favor of the client. A full refund of ZAR ${job.totalBudget.toFixed(2)} has been issued.`;
                dispute.status = 'resolved_client';
                break;
            case 'dismiss':
                // No financial action, just close the case
                resolutionMessage = 'Case dismissed with no further action.';
                dispute.status = 'dismissed';
                break;
        }
        
        dispute.resolution = {
            adminId: state.currentUser.id,
            message: resolutionMessage,
            resolvedAtISO: new Date().toISOString()
        };

        storage.saveDB(state.db);
        notifications.showToast(`Dispute resolved: ${resolutionMessage}`);
        
        // Notify all parties
        const allParties = [client, ...freelancers];
        allParties.forEach(party => {
            if (party) {
                notifications.create(party.id, `The dispute for job "${job.title}" has been resolved. Resolution: ${resolutionMessage}`);
            }
        });

        ui.hideModal('dispute-resolution-modal');
        ui.render();
    },
    handleShowPortfolioModal: (freelancerId) => {
        const freelancer = state.db.users.find(u => u.id === freelancerId);
        if (!freelancer || !freelancer.portfolio || freelancer.portfolio.length === 0) {
            notifications.showToast("This user has no portfolio to display.");
            return;
        }
        
        document.getElementById('portfolio-view-title').textContent = `${freelancer.displayName}'s Portfolio`;
        const contentEl = document.getElementById('portfolio-view-content');
        contentEl.innerHTML = '';

        freelancer.portfolio.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'portfolio-view-item';
            itemEl.innerHTML = `
                <img src="${item.imageDataURL}" alt="${item.title}">
                <p>${item.title}</p>
            `;
            contentEl.appendChild(itemEl);
        });

        ui.showModal('portfolio-view-modal');
    }
};

// --- APP INITIALIZATION ---
function init() {
    const savedTheme = localStorage.getItem('swiftStaffTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    state.db = storage.getDB();
    
    const savedUserId = localStorage.getItem('fullFluxSession');
    if (savedUserId) {
        const user = state.db.users.find(u => u.id === savedUserId);
        if (user) {
            state.currentUser = user;
        }
    }

    console.log("FullFlux App Initializing...");
    ui.render();
}

// --- START THE APP ---
document.addEventListener('DOMContentLoaded', init);
window.handlers = handlers; // Make handlers accessible for inline onclick
