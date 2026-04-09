import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    // You will need to get the apiKey and appId by adding a "Web App" to your project
    apiKey: "AIzaSyAUFvy1foK1RPqT-7L2ns-5zNluVu9DlfY",
    authDomain: "tnstc-live-tracking.firebaseapp.com",
    projectId: "tnstc-live-tracking",
    storageBucket: "tnstc-live-tracking.appspot.com",
    messagingSenderId: "632015860643",
    appId: "1:632015860643:web:df63c674f840966895a016",
    // This is the default format for Firebase Realtime Database URLs
    databaseURL: "https://tnstc-live-tracking-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
export const DISTRICT_STOPS = {
    Ariyalur: ['Ariyalur Bus Stand', 'Jayankondam', 'Sendurai', 'Andimadam', 'Udayarpalayam'],
    Chengalpattu: ['Chengalpattu', 'Tambaram', 'Madurantakam', 'Guduvancheri', 'Thirukazhukundram'],
    Chennai: ['CMBT', 'Broadway', 'Tambaram', 'T. Nagar', 'Velachery'],
    Coimbatore: ['Coimbatore Gandhipuram', 'Mettupalayam', 'Pollachi', 'Avinashi', 'Sulur', 'Annur'],
    Cuddalore: ['Cuddalore', 'Panruti', 'Neyveli', 'Vriddhachalam', 'Chidambaram'],
    Dharmapuri: ['Dharmapuri', 'Harur', 'Palacode', 'Pennagaram', 'Pappireddipatti'],
    Dindigul: ['Dindigul', 'Palani', 'Oddanchatram', 'Natham', 'Vedasandur'],
    Erode: ['Pachampalayam', 'Padaiveedu', 'Erode Central', 'Gobichettipalayam', 'Sathyamangalam', 'Bhavani', 'Perundurai'],
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
    Tiruvarur: ['Tiruvarur', 'Mannargudi', 'Kodavasal', 'Needamangalam', 'Thiruthuraipoondi'],
    Vellore: ['Vellore', 'Katpadi', 'Gudiyatham', 'Pernambut', 'Anaicut'],
    Viluppuram: ['Viluppuram', 'Tindivanam', 'Gingee', 'Kallakurichi', 'Marakkanam'],
    Virudhunagar: ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai', 'Sattur'],
};
