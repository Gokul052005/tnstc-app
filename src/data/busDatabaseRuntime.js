import { db } from '../firebase';
import { ref, get, set, child } from "firebase/database";

const STOPS_STORE = 'stops';
const ROUTES_STORE = 'routes';

const DISTRICT_STOPS = {
    Ariyalur: ['Ariyalur Bus Stand', 'Jayankondam', 'Sendurai', 'Andimadam', 'Udayarpalayam'],
    Chengalpattu: ['Chengalpattu', 'Tambaram', 'Madurantakam', 'Guduvancheri', 'Thirukazhukundram'],
    Chennai: ['CMBT', 'Broadway', 'Tambaram', 'T. Nagar', 'Velachery'],
    Coimbatore: ['Coimbatore Gandhipuram', 'Mettupalayam', 'Pollachi', 'Avinashi', 'Sulur', 'Annur'],
    Cuddalore: ['Cuddalore', 'Panruti', 'Neyveli', 'Vriddhachalam', 'Chidambaram'],
    Dharmapuri: ['Dharmapuri', 'Harur', 'Palacode', 'Pennagaram', 'Pappireddipatti'],
    Dindigul: ['Dindigul', 'Palani', 'Oddanchatram', 'Natham', 'Vedasandur'],
    Erode: ['Pachampalayam', 'Padaiveedu', 'Erode Central', 'Erode Bus Stand', 'Gobichettipalayam', 'Sathyamangalam', 'Bhavani', 'Perundurai', 'Chithode'],
    Kallakurichi: ['Kallakurichi', 'Sankarapuram', 'Chinnasalem', 'Ulundurpet', 'Rishivandiyam'],
    Kancheepuram: ['Kancheepuram', 'Uthiramerur', 'Walajabad', 'Kundrathur', 'Sriperumbudur'],
    Kanyakumari: ['Nagercoil', 'Marthandam', 'Kanyakumari', 'Colachel', 'Kuzhithurai'],
    Karur: ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Paramathi'],
    Krishnagiri: ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Uthangarai', 'Bargur'],
    Madurai: ['Madurai Periyar', 'Melur', 'Usilampatti', 'Thirumangalam', 'Vadipatti'],
    Mayiladuthurai: ['Mayiladuthurai', 'Sirkazhi', 'Kuthalam', 'Tharangambadi', 'Vaitheeswarankoil'],
    Nagapattinam: ['Nagapattinam', 'Velankanni', 'Vedaranyam', 'Kilvelur', 'Thirukkuvalai'],
    Namakkal: ['Namakkal', 'Tiruchengode', 'Rajam Theatre', 'Muniyappan Kovil', 'Palmadai', 'Thiru Nagar', 'Court', 'RS', 'Rasipuram', 'Kumarapalayam', 'Kaundanur', 'Pachampalayam', 'ICL', 'Paramathi Velur', 'Mohanur', 'Senthamangalam'],
    Nilgiris: ['Udhagamandalam', 'Coonoor', 'Kotagiri', 'Gudalur', 'Pandalur'],
    Perambalur: ['Perambalur', 'Kunnam', 'Veppanthattai', 'Alathur', 'Labbaikudikadu'],
    Pudukkottai: ['Pudukkottai', 'Aranthangi', 'Alangudi', 'Iluppur', 'Keeranur'],
    Ramanathapuram: ['Ramanathapuram', 'Paramakudi', 'Rameswaram', 'Keelakarai', 'Mudukulathur'],
    Ranipet: ['Ranipet', 'Arcot', 'Arakkonam', 'Walajah', 'Sholinghur'],
    Salem: ['Salem Junction', 'Sankagiri', 'Post office', 'Mekadu', 'Theeran Chinna Malai', 'Mettur', 'Attur', 'Omalur', 'Edappadi', 'Yercaud Foothills'],
    Sivaganga: ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Tirupathur'],
    Tenkasi: ['Tenkasi', 'Sankarankovil', 'Courtallam', 'Shencottai', 'Kadayanallur'],
    Thanjavur: ['Thanjavur', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Orathanadu'],
    Theni: ['Theni', 'Periyakulam', 'Cumbum', 'Bodinayakanur', 'Andipatti'],
    Thoothukudi: ['Thoothukudi', 'Tiruchendur', 'Kovilpatti', 'Ettayapuram', 'Kayalpattinam'],
    Tiruchirappalli: ['Trichy Central', 'Srirangam', 'Lalgudi', 'Musiri', 'Thuraiyur'],
    Tirunelveli: ['Tirunelveli', 'Ambasamudram', 'Nanguneri', 'Cheranmahadevi', 'Palayamkottai'],
    Tirupathur: ['Tirupathur', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Jolarpettai'],
    Tiruppur: ['Tiruppur', 'Dharapuram', 'Kangeyam', 'Udumalaipettai', 'Palladam'],
    Tiruvallur: ['Tiruvallur', 'Ponneri', 'Avadi', 'Pattabiram', 'Tiruttani'],
    Tiruvannamalai: ['Tiruvannamalai', 'Arani', 'Polur', 'Chengam', 'Vandavasi'],
    Tiruvarur: ['Tiruvarur', 'Mannargudi', 'Kodavasal', 'Needamangalam', 'Thirukkuvalai'],
    Vellore: ['Vellore', 'Katpadi', 'Gudiyatham', 'Pernambut', 'Anaicut'],
    Viluppuram: ['Viluppuram', 'Tindivanam', 'Gingee', 'Kallakurichi', 'Marakkanam'],
    Virudhunagar: ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai', 'Sattur'],
};

const STOP_COORDS = {
    'Coimbatore:Coimbatore Gandhipuram': { lat: 11.0183, lng: 76.9634 },
    'Erode:Erode Bus Stand': { lat: 11.3400, lng: 77.7200 },
    'Madurai:Madurai Periyar': { lat: 9.9200, lng: 78.1100 },
    'Namakkal:Namakkal': { lat: 11.2200, lng: 78.1700 },
    'Namakkal:Tiruchengode': { lat: 11.3800, lng: 77.8900 },
    'Salem:Salem Junction': { lat: 11.6600, lng: 78.1500 },
    // Padaiveedu/Pachampalayam Area
    'Namakkal:Pachampalayam': { lat: 11.5186, lng: 77.8767 },
    'Namakkal:Padaiveedu': { lat: 11.5173, lng: 77.8800 },
    'Erode:Pachampalayam': { lat: 11.5200, lng: 77.8820 },
    'Erode:Bhavani': { lat: 11.4500, lng: 77.6800 },
    'Namakkal:Kumarapalayam': { lat: 11.4500, lng: 77.7000 },
    'Erode:Erode Central': { lat: 11.348, lng: 77.721 }
};

const STOP_TALUKS = {
    'Erode:Pachampalayam': 'Bhavani Taluk',
    'Namakkal:Pachampalayam': 'Kumarapalayam Taluk',
    'Namakkal:Kumarapalayam': 'Kumarapalayam Taluk',
    'Erode:Kumarapalayam': 'Kumarapalayam Circle',
    'Namakkal:Kaundanur': 'Namakkal Taluk',
    'Namakkal:ICL': 'Kumarapalayam Industrial Area',
    'Salem:Sankagiri': 'Sankagiri Taluk',
    'Erode:Bhavani': 'Bhavani Taluk',
};

const ROUTE_SEED = [
    {
        id: 'S2-F',
        from: 'Bhavani',
        to: 'Sankagiri',
        stops: ['Bhavani', 'Kumarapalayam', 'Muniyappan Kovil', 'Pachampalayam', 'Goundanur', 'ICL', 'Sankagiri'],
        buses: [
            { tripNo: '5370', serviceType: 'TNSTC Town Bus', depot: 'Sankagiri Branch', departure: '06:10 AM', arrival: '07:05 AM' },
        ],
    },
    {
        id: 'S2-R',
        from: 'Sankagiri',
        to: 'Bhavani',
        stops: ['Sankagiri', 'ICL', 'Goundanur', 'Pachampalayam', 'Muniyappan Kovil', 'Kumarapalayam', 'Bhavani'],
        buses: [
            { tripNo: '5371', serviceType: 'TNSTC Town Bus', depot: 'Sankagiri Branch', departure: '07:15 AM', arrival: '08:10 AM' },
        ],
    }
];

const STOP_NAME_ALIASES = {
    erode: 'erode',
    'erode central': 'erode',
    'erode bus stand': 'erode',
    salem: 'salem',
    'salem junction': 'salem',
    tiruchengode: 'tiruchengode',
    'tiruchengode bus stand': 'tiruchengode',
};

const stopSeed = Object.entries(DISTRICT_STOPS).flatMap(([district, stops]) =>
    stops.map((name) => {
        const id = `${district}:${name}`;
        const coords = STOP_COORDS[id] || { lat: 0, lng: 0 };
        return {
            id,
            name,
            district,
            taluk: STOP_TALUKS[id] ?? '',
            lat: coords.lat,
            lng: coords.lng
        };
    })
);

let isInitialized = false;

export const initializeBusDatabase = async () => {
    if (isInitialized) return;

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, STOPS_STORE));
        const routesSnapshot = await get(child(dbRef, ROUTES_STORE));
        
        // 1. Handle Stops Upserting
        let existingStops = snapshot.exists() ? snapshot.val() : {};
        let needsStopUpdate = false;
        
        stopSeed.forEach(stop => {
            const safeKey = stop.id.replace(/[.#$[\]]/g, '_');
            if (!existingStops[safeKey]) {
                existingStops[safeKey] = stop; 
                needsStopUpdate = true;
            } else if (existingStops[safeKey].district !== stop.district) {
                existingStops[safeKey].district = stop.district;
                needsStopUpdate = true;
            }
        });

        if (needsStopUpdate || !snapshot.exists()) {
            await set(ref(db, STOPS_STORE), existingStops);
        }

        // 2. Handle Routes initializing
        if (!routesSnapshot.exists()) {
            const routesObj = {};
            ROUTE_SEED.forEach(route => {
                routesObj[route.id.replace(/[.#$[\]]/g, '_')] = route;
            });
            await set(ref(db, ROUTES_STORE), routesObj);
        }
        
        isInitialized = true;
    } catch (e) {
        console.error("Firebase Initialization Error:", e);
    }
};

const getAllFromStore = async (storeName) => {
    await initializeBusDatabase();
    try {
        const snapshot = await get(ref(db, storeName));
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        }
    } catch (e) {
        console.error(`Error getting data from ${storeName}:`, e);
    }
    return [];
};

export const getAllStops = async () => {
    const baseStopsArr = await getAllFromStore(STOPS_STORE);
    const routes = await getAllFromStore(ROUTES_STORE);
    
    const stopMap = new Map();
    baseStopsArr.forEach((s) => {
        const stopName = typeof s?.name === 'string' ? s.name.trim() : '';
        if (!stopName) return;
        stopMap.set(stopName.toLowerCase(), { ...s, name: stopName });
    });
    
    routes.forEach(route => {
        if (route.stops) {
            route.stops.forEach((stopName) => {
                if (typeof stopName !== 'string') return;
                const trimmedStopName = stopName.trim();
                if (!trimmedStopName) return;
                const lower = trimmedStopName.toLowerCase();
                if (!stopMap.has(lower)) {
                    stopMap.set(lower, {
                        id: `AutoGend:${trimmedStopName}`, 
                        name: trimmedStopName,
                        district: 'No District', 
                        taluk: ''
                    });
                }
            });
        }
    });

    return Array.from(stopMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const getDistrictChoices = async () => {
    const stops = await getAllStops();
    return [...new Set(stops.map((stop) => stop.district).filter(d => d && d !== 'No District'))].sort();
};

export const getRoutes = async () => {
    const routes = await getAllFromStore(ROUTES_STORE);
    return routes.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
};

export const formatStopOption = (stop) => {
    const parts = [stop.name];
    if (stop.taluk) parts.push(stop.taluk);
    parts.push(stop.district);
    return parts.join(' • ');
};

const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let [ , h, m, ampm ] = match;
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
    if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
    return h * 60 + m;
};

const getCurrentISTMinutes = () => {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    return istTime.getHours() * 60 + istTime.getMinutes();
};

const normalizeStopName = (name) => {
    if (!name || typeof name !== 'string') return '';
    const normalized = name.trim().toLowerCase();
    return STOP_NAME_ALIASES[normalized] ?? normalized;
};

export const findRoutesBetweenStops = async (fromName, toName) => {
    const routes = await getRoutes();
    
    return routes
        .map((route) => {
            const forwardStops = route.stops || [];
            const forwardFromIndex = forwardStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(fromName));
            const forwardToIndex = forwardStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(toName));

            // Strict Forward Matching
            if (forwardFromIndex !== -1 && forwardToIndex !== -1 && forwardFromIndex < forwardToIndex) {
                return { 
                    ...route, 
                    direction: 'forward', 
                    orderedStops: forwardStops.slice(forwardFromIndex, forwardToIndex + 1) 
                };
            }

            return null;
        })
        .filter(Boolean);
};

export const findTrackingResult = async (fromName, toName, userStopName) => {
    const routes = await findRoutesBetweenStops(fromName, toName);
    const matchingRoute = routes.find((route) =>
        route.orderedStops.some((stop) => normalizeStopName(stop) === normalizeStopName(userStopName))
    ) ?? routes[0];

    if (!matchingRoute) {
        return null;
    }

    const routeStops = matchingRoute.orderedStops;
    const fromIndex = routeStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(fromName));
    const userIndex = routeStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(userStopName));
    const passedStops = userIndex > fromIndex
        ? routeStops.slice(fromIndex, userIndex)
        : routeStops.slice(fromIndex, Math.max(fromIndex + 1, routeStops.length - 1));
    const currentLocation = passedStops[passedStops.length - 1] ?? fromName;
    const hopsRemaining = userIndex > fromIndex ? userIndex - fromIndex : 1;
    const etaMinutes = hopsRemaining * 9;

    const now = getCurrentISTMinutes();
    const sortedTimings = [...matchingRoute.buses.map((bus) => bus.departure)].sort((a, b) => {
        const aMins = timeToMinutes(a);
        const bMins = timeToMinutes(b);
        const aDiff = aMins - now;
        const bDiff = bMins - now;
        
        if (aDiff >= 0 && bDiff < 0) return -1;
        if (bDiff >= 0 && aDiff < 0) return 1;
        if (aDiff >= 0 && bDiff >= 0) return aDiff - bDiff;
        return aMins - bMins;
    });

    return {
        busRoute: matchingRoute.id,
        timings: sortedTimings,
        passedStops,
        eta: `${etaMinutes} mins`,
        currentLocation,
    };
};
