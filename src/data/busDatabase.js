import { db, DISTRICT_STOPS } from '../firebase';
import { ref, get, set, child } from "firebase/database";

const STOPS_STORE = 'stops';
const ROUTES_STORE = 'routes';

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
        id: 'S2',
        from: 'Bhavani',
        to: 'Sankagiri',
        stops: ['Bhavani', 'Kumarapalayam', 'Muniyappan Kovil', 'Pachampalayam', 'Goundanur', 'ICL', 'Sankagiri'],
        buses: [
            { tripNo: '5370', serviceType: 'TNSTC Town Bus', depot: 'Sankagiri Branch', departure: '06:10 AM', arrival: '07:05 AM' },
            { tripNo: '5583', serviceType: 'TNSTC Town Bus', depot: 'Sankagiri Branch', departure: '08:45 AM', arrival: '09:40 AM' },
            { tripNo: '5366', serviceType: 'TNSTC Town Bus', depot: 'Sankagiri Branch', departure: '12:30 PM', arrival: '01:25 PM' },
            { tripNo: '5585', serviceType: 'TNSTC Town Bus', depot: 'Sankagiri Branch', departure: '05:40 PM', arrival: '06:35 PM' },
        ],
    },
    {
        id: 'E12',
        from: 'Bhavani',
        to: 'Erode Central',
        stops: ['Bhavani', 'Pachampalayam', 'Chithode', 'Erode Central'],
        buses: [
            { tripNo: '4012', serviceType: 'TNSTC Town Bus', depot: 'Bhavani Branch', departure: '06:35 AM', arrival: '07:20 AM' },
            { tripNo: '4018', serviceType: 'TNSTC Town Bus', depot: 'Bhavani Branch', departure: '11:10 AM', arrival: '11:55 AM' },
            { tripNo: '4024', serviceType: 'TNSTC Town Bus', depot: 'Bhavani Branch', departure: '04:20 PM', arrival: '05:05 PM' },
        ],
    },
    {
        id: 'E14',
        from: 'Bhavani',
        to: 'Erode Bus Stand',
        stops: ['Bhavani', 'Pachampalayam', 'Chithode', 'Erode Bus Stand'],
        buses: [
            { tripNo: '4112', serviceType: 'TNSTC Town Bus', depot: 'Bhavani Branch', departure: '07:00 AM', arrival: '08:35 AM' },
            { tripNo: '4118', serviceType: 'TNSTC Town Bus', depot: 'Bhavani Branch', departure: '10:20 AM', arrival: '11:55 AM' },
            { tripNo: '4124', serviceType: 'TNSTC Town Bus', depot: 'Bhavani Branch', departure: '02:15 PM', arrival: '03:50 PM' },
        ],
    },
    {
        id: 'S5',
        from: 'Sankagiri',
        to: 'Tiruchengode Bus Stand',
        stops: ['Sankagiri', 'RS', 'Palmadai', 'Thiru Nagar', 'Court', 'Tiruchengode Bus Stand'],
        buses: [
            { tripNo: '2871', serviceType: 'TNSTC Town Bus', depot: 'Erode Central Branch', departure: '05:55 AM', arrival: '07:20 AM' },
            { tripNo: '2874', serviceType: 'TNSTC Town Bus', depot: 'Erode Central Branch', departure: '09:10 AM', arrival: '10:35 AM' },
            { tripNo: '2880', serviceType: 'TNSTC Town Bus', depot: 'Erode Central Branch', departure: '06:05 PM', arrival: '07:30 PM' },
        ],
    },
    {
        id: 'C11',
        from: 'Coimbatore Gandhipuram',
        to: 'Salem Junction',
        stops: ['Coimbatore Gandhipuram', 'Avinashi', 'Sankagiri', 'Salem Junction'],
        buses: [
            { tripNo: '6210', serviceType: 'TNSTC EXPRESS', depot: 'Coimbatore Branch', departure: '06:30 AM', arrival: '09:10 AM' },
            { tripNo: '6218', serviceType: 'TNSTC EXPRESS', depot: 'Coimbatore Branch', departure: '11:15 AM', arrival: '01:55 PM' },
            { tripNo: '6226', serviceType: 'TNSTC EXPRESS', depot: 'Coimbatore Branch', departure: '04:45 PM', arrival: '07:25 PM' },
        ],
    },
    {
        id: 'N5',
        from: 'Namakkal',
        to: 'Salem Junction',
        stops: ['Namakkal', 'Rasipuram', 'Salem Junction'],
        buses: [
            { tripNo: '3451', serviceType: 'TNSTC TOWN', depot: 'Namakkal Branch', departure: '07:40 AM', arrival: '08:45 AM' },
            { tripNo: '3458', serviceType: 'TNSTC TOWN', depot: 'Namakkal Branch', departure: '01:00 PM', arrival: '02:05 PM' },
            { tripNo: '3464', serviceType: 'TNSTC TOWN', depot: 'Namakkal Branch', departure: '07:10 PM', arrival: '08:15 PM' },
        ],
    },
];

const stopSeed = Object.entries(DISTRICT_STOPS).flatMap(([district, stops]) =>
    stops.map((name) => ({
        id: `${district}:${name}`,
        name,
        district,
        taluk: STOP_TALUKS[`${district}:${name}`] ?? '',
    }))
);

let isInitialized = false;

export const initializeBusDatabase = async () => {
    if (isInitialized) return;

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, STOPS_STORE));

        if (!snapshot.exists()) {
            console.log("No data found in Firebase! Seeding database...");

            // Firebase object keys cannot contain '.', '#', '$', '[', or ']'
            const stopsObj = {};
            stopSeed.forEach(stop => {
                stopsObj[stop.id.replace(/[.#$[\]]/g, '_')] = stop;
            });

            const routesObj = {};
            ROUTE_SEED.forEach(route => {
                routesObj[route.id.replace(/[.#$[\]]/g, '_')] = route;
            });

            await set(ref(db, STOPS_STORE), stopsObj);
            await set(ref(db, ROUTES_STORE), routesObj);
            console.log("Database seeded successfully!");
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
    const stops = await getAllFromStore(STOPS_STORE);
    return stops.sort((a, b) => a.name.localeCompare(b.name));
};

export const getDistrictChoices = async () => {
    const stops = await getAllStops();
    return [...new Set(stops.map((stop) => stop.district))];
};

export const getRoutes = async () => {
    const routes = await getAllFromStore(ROUTES_STORE);
    return routes.sort((a, b) => a.id.localeCompare(b.id));
};

const formatDuration = (totalMinutes) => {
    const mins = Math.round(totalMinutes);
    if (mins < 1) return "Arriving Soon";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) {
        return `${h}h ${m}m`;
    }
    return `${m} mins`;
};

export const formatStopOption = (stop) => {
    const parts = [stop.name];
    if (stop.taluk) parts.push(stop.taluk);
    parts.push(stop.district);
    return parts.join(' • ');
};

export const findRoutesBetweenStops = async (fromName, toName) => {
    const routes = await getRoutes();

    return routes.filter((route) => {
        const fromIndex = route.stops.indexOf(fromName);
        const toIndex = route.stops.indexOf(toName);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });
};

export const findTrackingResult = async (fromName, toName, userStopName) => {
    const routes = await findRoutesBetweenStops(fromName, toName);
    const matchingRoute = routes.find((route) => route.stops.includes(userStopName)) ?? routes[0];

    if (!matchingRoute) {
        return null;
    }

    const routeStops = matchingRoute.stops;
    const fromIndex = routeStops.indexOf(fromName);
    const userIndex = routeStops.indexOf(userStopName);
    const passedStops = userIndex > fromIndex
        ? routeStops.slice(fromIndex, userIndex)
        : routeStops.slice(fromIndex, Math.max(fromIndex + 1, routeStops.length - 1));
    const currentLocation = passedStops[passedStops.length - 1] ?? fromName;
    const hopsRemaining = userIndex > fromIndex ? userIndex - fromIndex : 1;
    const etaMinutes = hopsRemaining * 9;

    return {
        busRoute: matchingRoute.id,
        timings: matchingRoute.buses.map((bus) => bus.departure),
        passedStops,
        eta: formatDuration(etaMinutes),
        currentLocation,
    };
};
