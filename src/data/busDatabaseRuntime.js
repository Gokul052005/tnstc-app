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
    Karur: ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishrayapuram', 'Paramathi'],
    Krishnagiri: ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Uthangarai', 'Bargur'],
    Madurai: ['Madurai Periyar', 'Melur', 'Usilampatti', 'Thirumangalam', 'Vadipatti'],
    Mayiladuthurai: ['Mayiladuthurai', 'Sirkazhi', 'Kuthalam', 'Tharangambadi', 'Vaitheeswarankoil'],
    Nagapattinam: ['Nagapattinam', 'Velankanni', 'Vedaranyam', 'Kilvelur', 'Thirukkuvalai'],
    Namakkal: ['Namakkal', 'Tiruchengode', 'Rajam Theatre', 'Muniyappan Kovil', 'Palmadai', 'Thiru Nagar', 'Court', 'RS', 'Rasipuram', 'Kumarapalayam', 'Goundanur', 'Pachampalayam', 'ICL', 'Paramathi Velur', 'Mohanur', 'Senthamangalam'],
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
    'Namakkal:Goundanur': 'Namakkal Taluk',
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

// New internal helper to guess district by stop name
const guessDistrictForStop = (stopName) => {
    const lowerName = stopName.trim().toLowerCase();
    for (const [district, stops] of Object.entries(DISTRICT_STOPS)) {
        if (stops.some(s => s.toLowerCase() === lowerName)) {
            return district;
        }
    }
    return 'No District';
};

export const getAllStops = async () => {
    const baseStopsArr = await getAllFromStore(STOPS_STORE);
    const routes = await getAllFromStore(ROUTES_STORE);
    
    const stopMap = new Map();
    const namesWithDistricts = new Set();
    
    baseStopsArr.forEach((s) => {
        const stopName = typeof s?.name === 'string' ? s.name.trim() : '';
        if (!stopName) return;
        
        let district = s.district;
        if (!district || district === 'No District') {
            district = guessDistrictForStop(stopName);
        }
        
        if (district && district !== 'No District') {
            namesWithDistricts.add(stopName.toLowerCase());
        }
        
        // Use ID as key to prevent overwriting duplicate names in different districts
        stopMap.set(s.id?.toLowerCase() || `${district}:${stopName}`.toLowerCase(), { ...s, name: stopName, district });
    });
    
    routes.forEach(route => {
        if (route.stops) {
            route.stops.forEach((stopName) => {
                if (typeof stopName !== 'string') return;
                const trimmedStopName = stopName.trim();
                if (!trimmedStopName) return;
                
                const lower = trimmedStopName.toLowerCase();
                
                // Only add "No District" if this name hasn't been seen in ANY district yet
                // and it's not already in the map as a specific ID
                const alreadyHasDistrict = namesWithDistricts.has(lower);
                
                if (!alreadyHasDistrict) {
                    const id = `AutoGend:${trimmedStopName}`;
                    if (!stopMap.has(id.toLowerCase())) {
                        stopMap.set(id.toLowerCase(), {
                            id, 
                            name: trimmedStopName,
                            district: 'No District', 
                            taluk: ''
                        });
                    }
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
    return istTime.getHours() * 60 + istTime.getMinutes() + istTime.getSeconds() / 60;
};

const formatDuration = (totalMinutes, lang = 'ENG') => {
    const mins = Math.round(totalMinutes);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    
    if (lang === 'TAM') {
        if (mins < 1) return "விரைவில் வருகிறது!";
        if (h > 0) {
            return `${h} மணி ${m} நிமி`;
        }
        return `${m} நிமிடம்`;
    }

    if (mins < 1) return "Arriving Soon";
    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m} mins`;
};

const normalizeStopName = (name) => {
    if (!name || typeof name !== 'string') return '';
    const normalized = name.trim().toLowerCase();
    return STOP_NAME_ALIASES[normalized] ?? normalized;
};

export const findRoutesBetweenStops = async (fromName, toName, fromDistrict = null, toDistrict = null, fromTaluk = null, toTaluk = null) => {
    const routes = await getRoutes();
    
    return routes
        .map((route) => {
            const forwardStops = route.stops || [];
            const forwardFromIndex = forwardStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(fromName));
            const forwardToIndex = forwardStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(toName));

            if (forwardFromIndex !== -1 && forwardToIndex !== -1 && forwardFromIndex < forwardToIndex) {
                // If districts are provided, verify if this route actually matches those districts
                if (fromDistrict && toDistrict) {
                   const routeStops = route.stops || [];
                   const isFromMatch = districtHasStop(fromDistrict, fromName);
                   const isToMatch = districtHasStop(toDistrict, toName);
                   
                   if (!isFromMatch || !isToMatch) return null;
                   
                   // WIN-BY-MAJORITY Logic for Ambiguous Stops
                   // Calculate affinity scores for all potential identities of the stop
                   const stopIdentities = getStopIdentities(toName);
                   if (stopIdentities.length > 1) {
                       let targetScore = 0;
                       let maxCompetingScore = 0;
                       let bestDistrict = '';

                       stopIdentities.forEach(identity => {
                           const score = getRouteAffinityScoreForDistrict(routeStops, identity.district);
                           if (identity.district === toDistrict) {
                               targetScore = score;
                           } else if (score > maxCompetingScore) {
                               maxCompetingScore = score;
                           }
                           if (score > (getRouteAffinityScoreForDistrict(routeStops, bestDistrict))) {
                               bestDistrict = identity.district;
                           }
                       });

                       // If S2 has 4 stops in Namakkal and only 1 in Erode, 
                       // and the user wants Erode, we filter S2 out because it's a "Namakkal route"
                       if (maxCompetingScore > targetScore) {
                           return null;
                       }
                   }

                   const fromNameAmbiguous = isStopAmbiguous(fromName);
                   if (fromNameAmbiguous && fromDistrict !== 'No District') {
                       const hasOtherStopInFromDist = routeStops.some(s => 
                           normalizeStopName(s) !== normalizeStopName(fromName) && 
                           districtHasStop(fromDistrict, s)
                       );
                       if (!hasOtherStopInFromDist) return null;
                   }
                }

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

// Internal helper for district-stop validation
const districtHasStop = (district, stopName) => {
    if (!district || district === 'No District') return true;
    const stopsInDist = DISTRICT_STOPS[district] || [];
    const normalizedTarget = normalizeStopName(stopName);
    return stopsInDist.some(s => normalizeStopName(s) === normalizedTarget);
};

// Returns all {district, taluk} pairs for a stop name
const getStopIdentities = (stopName) => {
    const normalized = normalizeStopName(stopName);
    const identities = [];
    for (const district in DISTRICT_STOPS) {
        if (DISTRICT_STOPS[district].some(s => normalizeStopName(s) === normalized)) {
            identities.push({ district, taluk: STOP_TALUKS[`${district}:${stopName}`] || '' });
        }
    }
    return identities;
};

// Scores a route based on how many of its stops belong to a district
const getRouteAffinityScoreForDistrict = (routeStops, district) => {
    if (!district) return 0;
    return routeStops.reduce((score, stop) => {
        return score + (districtHasStop(district, stop) ? 1 : 0);
    }, 0);
};

// Check if a stop name exists in more than one district
const isStopAmbiguous = (stopName) => {
    return getStopIdentities(stopName).length > 1;
};

// Internal helper for taluk lookup
const getStopTaluk = (district, stopName) => {
    const id = `${district}:${stopName}`;
    return STOP_TALUKS[id] || '';
};

export const findTrackingResult = async (fromName, toName, userStopName, fromDistrict = null, toDistrict = null, userStopDistrict = null, fromTaluk = null, toTaluk = null, userStopTaluk = null, lang = 'ENG') => {
    const routes = await findRoutesBetweenStops(fromName, toName, fromDistrict, toDistrict, fromTaluk, toTaluk);
    const now = getCurrentISTMinutes();

    let bestMatch = null;

    const routeScored = routes.map(route => {
        const routeStops = route.orderedStops;
        const userIndex = routeStops.findIndex((stop) => normalizeStopName(stop) === normalizeStopName(userStopName));
        if (userIndex === -1) return null;

        let activeBus = null;
        let upcomingBus = null;
        let minFutureDiff = Infinity;

        route.buses.forEach(bus => {
            const depMins = timeToMinutes(bus.departure);
            const arrivalMins = timeToMinutes(bus.arrival);
            if (now >= depMins && now <= arrivalMins) {
                activeBus = bus;
            }
            const diff = depMins - now;
            if (diff > 0 && diff < minFutureDiff) {
                minFutureDiff = diff;
                upcomingBus = bus;
            }
        });

        const selectedBus = activeBus || upcomingBus || (route.buses.length > 0 ? route.buses[route.buses.length - 1] : null);
        if (!selectedBus) return null;

        const isLive = activeBus === selectedBus && activeBus !== null;
        const isUpcoming = !isLive && upcomingBus === selectedBus && upcomingBus !== null;

        return {
            route,
            selectedBus,
            isLive,
            isUpcoming,
            userIndex,
            score: isLive ? 100 : (isUpcoming ? 50 : 0)
        };
    }).filter(Boolean).sort((a,b) => b.score - a.score);

    bestMatch = routeScored[0];

    if (!bestMatch) return null;

    const { route: matchingRoute, selectedBus: activeBus, isLive, isUpcoming, userIndex } = bestMatch;
    const routeStops = matchingRoute.orderedStops;
    const tripDepMins = timeToMinutes(activeBus.departure);
    const tripArrMins = timeToMinutes(activeBus.arrival);
    
    // Helper to get exact minutes for a stop
    const getStopArrivalMins = (stop, idx) => {
        if (idx === 0) return tripDepMins;
        if (idx === routeStops.length - 1) return tripArrMins;
        if (activeBus.stopTimings && activeBus.stopTimings[stop]) {
            return timeToMinutes(activeBus.stopTimings[stop]);
        }
        let prevAnchorIdx = 0, nextAnchorIdx = routeStops.length - 1;
        for (let i = idx - 1; i >= 0; i--) {
            if (activeBus.stopTimings && activeBus.stopTimings[routeStops[i]]) { prevAnchorIdx = i; break; }
        }
        for (let i = idx + 1; i < routeStops.length; i++) {
            if (activeBus.stopTimings && activeBus.stopTimings[routeStops[i]]) { nextAnchorIdx = i; break; }
        }
        const prevTime = prevAnchorIdx === 0 ? tripDepMins : timeToMinutes(activeBus.stopTimings[routeStops[prevAnchorIdx]]);
        const nextTime = nextAnchorIdx === routeStops.length - 1 ? tripArrMins : timeToMinutes(activeBus.stopTimings[routeStops[nextAnchorIdx]]);
        const idxDiff = nextAnchorIdx - prevAnchorIdx;
        const timeDiff = nextTime - prevTime;
        return prevTime + ((idx - prevAnchorIdx) / idxDiff) * timeDiff;
    };
    
    const passedStops = [];
    let currentLocation = routeStops[0];
    let locationStatus = "At Station";

    routeStops.forEach((stop, idx) => {
        const stopArrivalMins = getStopArrivalMins(stop, idx);
        if (now >= stopArrivalMins) {
            passedStops.push(stop);
            currentLocation = stop;
            if (now > stopArrivalMins + 1) {
                locationStatus = "Departed";
            } else {
                locationStatus = "At Station";
            }
        }
    });

    const targetStopName = routeStops[userIndex];
    const userArrivalMins = getStopArrivalMins(targetStopName, userIndex);
    const etaMinutes = (isLive || isUpcoming) ? Math.max(0, userArrivalMins - now) : 0;

    const sortedTimings = [...matchingRoute.buses.map((bus) => bus.departure)].sort((a, b) => {
        const aMins = timeToMinutes(a);
        const bMins = timeToMinutes(b);
        const aDiff = aMins - now;
        const bDiff = bMins - now;
        if (aDiff > 0 && bDiff <= 0) return -1;
        if (bDiff > 0 && aDiff <= 0) return 1;
        if (aDiff > 0 && bDiff > 0) return aDiff - bDiff;
        return aMins - bMins;
    });

    const formatTimeMins = (mins) => {
        const h = Math.floor(mins / 60) % 24;
        const m = Math.floor(mins % 60);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${(h % 12 || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const stopwatchTimes = routeStops.map((stop, idx) => ({
        stop,
        time: formatTimeMins(getStopArrivalMins(stop, idx))
    }));

    return {
        busRoute: matchingRoute.id,
        timings: sortedTimings,
        passedStops, 
        eta: (isLive || isUpcoming) ? (etaMinutes > 0 ? (etaMinutes < 1 ? (lang === 'TAM' ? "விரைவில் வருகிறது!" : "Arriving Soon") : formatDuration(etaMinutes, lang)) : (lang === 'TAM' ? "வந்தது" : "Arrived")) : (lang === 'TAM' ? "முடிந்தது" : "Finished"),
        estimatedArrivalTime: formatTimeMins(userArrivalMins),
        stopwatchTimes,
        currentLocation,
        locationStatus,
        userStopIndex: userIndex,
        activeTrip: activeBus.departure,
        status: isLive ? 'live' : (isUpcoming ? 'upcoming' : 'finished'),
        orderedStops: routeStops,
        gpsId: activeBus.gpsId || null
    };
};
