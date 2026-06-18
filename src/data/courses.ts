export type CategoryKey =
    | 'turnen'
    | 'schwimmen'
    | 'fussball'
    | 'tanzen'
    | 'kampfsport'
    | 'leichtathletik'
    | 'basketball'

export interface Course {
    id: string
    title: string
    club: string
    category: CategoryKey
    address: string
    price: string
    time: string
    ageGroup: string
    spotsLeft: number
    position: { lat: number; lng: number }
    includedInPlan?: 'aktiv' | 'familie'
}

// Volle Klassennamen – Tailwind erkennt dynamische Strings nicht.
export const categories: Record<CategoryKey, { label: string; icon: string; badge: string }> = {
    turnen: { label: 'Turnen', icon: '🤸', badge: 'bg-violet-100 text-violet-700' },
    schwimmen: { label: 'Schwimmen', icon: '🏊', badge: 'bg-sky-100 text-sky-700' },
    fussball: { label: 'Fußball', icon: '⚽', badge: 'bg-emerald-100 text-emerald-700' },
    tanzen: { label: 'Tanzen', icon: '💃', badge: 'bg-pink-100 text-pink-700' },
    kampfsport: { label: 'Kampfsport', icon: '🥋', badge: 'bg-amber-100 text-amber-700' },
    leichtathletik: { label: 'Leichtathletik', icon: '🏃', badge: 'bg-orange-100 text-orange-700' },
    basketball: { label: 'Basketball', icon: '🏀', badge: 'bg-red-100 text-red-700' },
}

export const courses: Course[] = [
    // ── Haar & Umgebung ───────────────────────────────────────────────
    { id: '1', title: 'Kinderturnen spielerisch', club: 'TSV Haar e.V.', category: 'turnen', address: 'Kirchenplatz 1, Haar', price: 'Gratis', time: 'Fr. 15:00 Uhr', ageGroup: '4–6 Jahre', spotsLeft: 5, position: { lat: 48.1112, lng: 11.7325 } },
    { id: '2', title: 'Geräteturnen für Schulkinder', club: 'TSV Haar e.V.', category: 'turnen', address: 'Höglweg 3, Haar', price: '12 € / Monat', time: 'Mi. 16:30 Uhr', ageGroup: '7–10 Jahre', spotsLeft: 0, includedInPlan: 'aktiv', position: { lat: 48.1090, lng: 11.7250 } },
    { id: '3', title: 'Schwimmkurs Seepferdchen', club: 'Schwimmschule Haar', category: 'schwimmen', address: 'Freibadstraße 3, Haar', price: '16 € / Monat', time: 'Sa. 10:30 Uhr', ageGroup: '5–7 Jahre', spotsLeft: 3, includedInPlan: 'aktiv', position: { lat: 48.1154, lng: 11.7289 } },
    { id: '5', title: 'Bambini Fußball-Training', club: 'TSV Haar e.V.', category: 'fussball', address: 'Am Sportpark 2, Haar', price: 'Gratis', time: 'Di. 15:30 Uhr', ageGroup: '4–6 Jahre', spotsLeft: 8, position: { lat: 48.1140, lng: 11.7410 } },
    { id: '6', title: 'Fussi-Junioren Training', club: 'FC Gronsdorf', category: 'fussball', address: 'Peter-Wolf-Platz, Gronsdorf', price: '10 € / Monat', time: 'Mo. 17:30 Uhr', ageGroup: '8–12 Jahre', spotsLeft: 0, includedInPlan: 'aktiv', position: { lat: 48.1235, lng: 11.7142 } },
    { id: '7', title: 'Kindertanzen & Ballett', club: 'Tanzstudio Haar', category: 'tanzen', address: 'Bahnhofstraße 12, Haar', price: '25 € / Monat', time: 'Mi. 15:00 Uhr', ageGroup: '5–8 Jahre', spotsLeft: 2, includedInPlan: 'aktiv', position: { lat: 48.1105, lng: 11.7302 } },
    { id: '9', title: 'Judo Anfängertraining', club: 'Budo-Club Haar e.V.', category: 'kampfsport', address: 'Münchener Str. 3, Haar', price: '11 € / Monat', time: 'Di. 16:30 Uhr', ageGroup: '6–10 Jahre', spotsLeft: 4, includedInPlan: 'aktiv', position: { lat: 48.1119, lng: 11.7220 } },
    { id: 'b1', title: 'Jugend-Basketball Training', club: 'TSV Haar e.V.', category: 'basketball', address: 'Am Sportpark 2, Haar', price: '10 € / Monat', time: 'Mo. 18:00 Uhr', ageGroup: '10–14 Jahre', spotsLeft: 6, includedInPlan: 'aktiv', position: { lat: 48.1141, lng: 11.7412 } },

    // ── München – Maxvorstadt / Lothstraße ────────────────────────────
    { id: '10', title: 'Eltern-Kind-Turnen', club: 'MTV München von 1879', category: 'turnen', address: 'Lothstraße 36, Maxvorstadt', price: '8 € / Monat', time: 'Mo. 09:30 Uhr', ageGroup: '1–3 Jahre', spotsLeft: 6, includedInPlan: 'aktiv', position: { lat: 48.1545, lng: 11.5550 } },
    { id: '11', title: 'Mini-Kickers Fußballschule', club: 'SV Maxvorstadt', category: 'fussball', address: 'Dachauer Str. 110, Maxvorstadt', price: 'Gratis', time: 'Do. 16:00 Uhr', ageGroup: '4–6 Jahre', spotsLeft: 10, position: { lat: 48.1530, lng: 11.5600 } },
    { id: '12', title: 'Kreativer Kindertanz', club: 'Tanzraum Maxvorstadt', category: 'tanzen', address: 'Augustenstraße 90, Maxvorstadt', price: '20 € / Monat', time: 'Di. 14:30 Uhr', ageGroup: '3–5 Jahre', spotsLeft: 0, includedInPlan: 'aktiv', position: { lat: 48.1500, lng: 11.5630 } },
    { id: '18', title: 'Kinder-Leichtathletik', club: 'Münchner TV', category: 'leichtathletik', address: 'Schwere-Reiter-Str. 35, Maxvorstadt', price: '9 € / Monat', time: 'Fr. 16:00 Uhr', ageGroup: '6–9 Jahre', spotsLeft: 7, includedInPlan: 'aktiv', position: { lat: 48.1690, lng: 11.5650 } },
    { id: 'b2', title: 'Mini-Basketball', club: 'MTV München von 1879', category: 'basketball', address: 'Häberlstraße 11, Maxvorstadt', price: '11 € / Monat', time: 'Mi. 16:00 Uhr', ageGroup: '8–12 Jahre', spotsLeft: 4, includedInPlan: 'aktiv', position: { lat: 48.1320, lng: 11.5630 } },

    // ── München – Schwabing / Neuhausen ───────────────────────────────
    { id: '13', title: 'Karate für Kinder', club: 'Budokan München e.V.', category: 'kampfsport', address: 'Hohenzollernstr. 21, Schwabing', price: '14 € / Monat', time: 'Mi. 17:00 Uhr', ageGroup: 'ab 6 Jahre', spotsLeft: 7, includedInPlan: 'aktiv', position: { lat: 48.1610, lng: 11.5800 } },
    { id: '14', title: 'Anfängerschwimmen Kids', club: 'SC Prinz-Eugen München', category: 'schwimmen', address: 'Helene-Mayer-Ring 4, Neuhausen', price: '15 € / Monat', time: 'Sa. 09:00 Uhr', ageGroup: '5–8 Jahre', spotsLeft: 1, includedInPlan: 'aktiv', position: { lat: 48.1760, lng: 11.5530 } },
    { id: '19', title: 'Ballett & Tanz für Kids', club: 'Tanzschule Schwabing', category: 'tanzen', address: 'Leopoldstraße 50, Schwabing', price: '22 € / Monat', time: 'Do. 15:30 Uhr', ageGroup: '5–9 Jahre', spotsLeft: 3, includedInPlan: 'aktiv', position: { lat: 48.1590, lng: 11.5860 } },
    { id: '20', title: 'Kinderturnen', club: 'ESV München', category: 'turnen', address: 'Georg-Brauchle-Ring 28, Neuhausen', price: '8 € / Monat', time: 'Mo. 16:00 Uhr', ageGroup: '4–7 Jahre', spotsLeft: 5, includedInPlan: 'aktiv', position: { lat: 48.1740, lng: 11.5400 } },

    // ── München – Innenstadt / Ludwigs- & Isarvorstadt ────────────────
    { id: '16', title: 'Gerätturnen Grundschule', club: 'TSV München-Mitte', category: 'turnen', address: 'Lindwurmstr. 88, Ludwigsvorstadt', price: '10 € / Monat', time: 'Do. 15:30 Uhr', ageGroup: '6–9 Jahre', spotsLeft: 0, includedInPlan: 'aktiv', position: { lat: 48.1290, lng: 11.5560 } },
    { id: '17', title: 'Ballschule für die Kleinsten', club: 'Post SV München', category: 'fussball', address: 'Bavariaring 6, Ludwigsvorstadt', price: 'Gratis', time: 'Mo. 15:00 Uhr', ageGroup: '3–5 Jahre', spotsLeft: 12, position: { lat: 48.1310, lng: 11.5500 } },
    { id: '21', title: 'Kinderschwimmen Grundkurs', club: 'SWM Bäder München', category: 'schwimmen', address: 'Müllerstraße 29, Isarvorstadt', price: '12 € / Monat', time: 'Sa. 11:00 Uhr', ageGroup: '5–8 Jahre', spotsLeft: 2, includedInPlan: 'aktiv', position: { lat: 48.1300, lng: 11.5720 } },

    // ── München – Sendling / Giesing / Au-Haidhausen ──────────────────
    { id: '22', title: 'Mädchenfußball Bambini', club: 'SV Sendling', category: 'fussball', address: 'Plinganserstr. 20, Sendling', price: 'Gratis', time: 'Mi. 16:00 Uhr', ageGroup: '5–8 Jahre', spotsLeft: 9, position: { lat: 48.1130, lng: 11.5430 } },
    { id: '23', title: 'Taekwondo Kids', club: 'TKD-Zentrum Giesing', category: 'kampfsport', address: 'Tegernseer Landstr. 75, Giesing', price: '13 € / Monat', time: 'Di. 17:00 Uhr', ageGroup: '6–11 Jahre', spotsLeft: 4, includedInPlan: 'aktiv', position: { lat: 48.1070, lng: 11.5870 } },
    { id: '24', title: 'Kinderturnen & Bewegung', club: 'TSV Haidhausen', category: 'turnen', address: 'Wörthstraße 12, Au-Haidhausen', price: '9 € / Monat', time: 'Fr. 15:00 Uhr', ageGroup: '3–6 Jahre', spotsLeft: 6, includedInPlan: 'aktiv', position: { lat: 48.1290, lng: 11.5950 } },

    // ── München – West / Pasing / Laim ────────────────────────────────
    { id: '25', title: 'Schwimmkurs Anfänger', club: 'SV Pasing', category: 'schwimmen', address: 'Bäckerstraße 10, Pasing', price: '15 € / Monat', time: 'Sa. 10:00 Uhr', ageGroup: '5–9 Jahre', spotsLeft: 0, includedInPlan: 'aktiv', position: { lat: 48.1470, lng: 11.4600 } },
    { id: '26', title: 'HipHop für Kids', club: 'Dance Factory Laim', category: 'tanzen', address: 'Fürstenrieder Str. 60, Laim', price: '18 € / Monat', time: 'Mi. 16:30 Uhr', ageGroup: '7–12 Jahre', spotsLeft: 5, includedInPlan: 'aktiv', position: { lat: 48.1370, lng: 11.5030 } },
    { id: '27', title: 'Bambini Fußball-Training', club: 'FT München Gern', category: 'fussball', address: 'Hanebergstraße 14, Gern', price: 'Gratis', time: 'Mo. 16:00 Uhr', ageGroup: '4–6 Jahre', spotsLeft: 8, position: { lat: 48.1650, lng: 11.5200 } },

    // ── München – Ost / Berg am Laim / Bogenhausen ────────────────────
    { id: '28', title: 'Kinder-Leichtathletik', club: 'LG München-Ost', category: 'leichtathletik', address: 'Bad-Schachener-Str. 30, Berg am Laim', price: '8 € / Monat', time: 'Do. 16:30 Uhr', ageGroup: '7–11 Jahre', spotsLeft: 9, includedInPlan: 'aktiv', position: { lat: 48.1240, lng: 11.6250 } },
    { id: '29', title: 'Judo für Anfänger', club: 'Budokan Bogenhausen', category: 'kampfsport', address: 'Englschalkinger Str. 100, Bogenhausen', price: '12 € / Monat', time: 'Di. 16:00 Uhr', ageGroup: '6–10 Jahre', spotsLeft: 0, includedInPlan: 'aktiv', position: { lat: 48.1560, lng: 11.6300 } },
    { id: '30', title: 'Eltern-Kind-Schwimmen', club: 'SC München-Ost', category: 'schwimmen', address: 'Friedenspromenade 8, Trudering', price: '10 € / Monat', time: 'Sa. 09:30 Uhr', ageGroup: '1–3 Jahre', spotsLeft: 4, includedInPlan: 'aktiv', position: { lat: 48.1290, lng: 11.6450 } },
]