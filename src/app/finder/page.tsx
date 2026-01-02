'use client';

import { useState, useEffect, useMemo } from 'react';

import { supabase } from '../lib/supabase';

import Link from 'next/link';



// Helper to calculate "Modern" vs "Vintage"

const isModern = (dateStr: string) => {

if (!dateStr) return false;

const year = parseInt(dateStr.split(' ')[1] || dateStr.split('-')[0]); // Handle "Sep 2024" or "2024-09-01"

return year >= 2021; // Last 5 years

};



export default function FinderPage() {

const [items, setItems] = useState<any[]>([]);

const [loading, setLoading] = useState(true);


// 1. MAIN NAVIGATION

const [category, setCategory] = useState('iPhone');

const mainCategories = ['iPhone', 'iPad', 'Mac', 'Watch', 'Others'];



// 2. ADVANCED FILTERS STATE

const [filters, setFilters] = useState({

era: 'All', // All, Modern, Vintage

size: 'All', // All, Compact, Standard, Max

port: 'All', // All, USB-C, Lightning

features: {

ai: false,

fiveG: false,

aod: false, // Always On Display

wifi6: false,

},

subType: 'All' // For "Others" category (Audio/Spatial/Home)

});



// Reset filters when category changes

useEffect(() => {

setFilters({

era: 'All',

size: 'All',

port: 'All',

features: { ai: false, fiveG: false, aod: false, wifi6: false },

subType: 'All'

});

}, [category]);



// 3. DATA FETCHING (Aggregating "Others" if selected)

useEffect(() => {

async function fetchData() {

setLoading(true);

setItems([]);



let data: any[] = [];


if (category === 'Others') {

// Fetch all 4 tables for "Others"

const [spatial, audio, home, acc] = await Promise.all([

supabase.from('spatial_computers').select('*').order('release_date', { ascending: false }),

supabase.from('audio_devices').select('*').order('release_date', { ascending: false }),

supabase.from('home_entertainment').select('*').order('release_date', { ascending: false }),

supabase.from('Accessories').select('*').order('release_date', { ascending: false })

]);


// Tag them so we can filter later

const s = (spatial.data || []).map(i => ({ ...i, type: 'Spatial' }));

const a = (audio.data || []).map(i => ({ ...i, type: 'Audio' }));

const h = (home.data || []).map(i => ({ ...i, type: 'Home' }));

const c = (acc.data || []).map(i => ({ ...i, type: 'Accessory' }));


data = [...s, ...a, ...h, ...c];



} else {

// Standard Fetch

const tableName = category === 'iPhone' ? 'iPhones' :

category === 'iPad' ? 'iPads' :

category === 'Mac' ? 'Macs' :

category === 'Watch' ? 'Watches' : null;


if (tableName) {

const res = await supabase.from(tableName).select('*').order('release_date', { ascending: false });

data = res.data || [];

}

}



setItems(data);

setLoading(false);

}

fetchData();

}, [category]);



// 4. THE FILTER ENGINE

const filteredItems = useMemo(() => {

return items.filter(item => {

// A. "Others" Sub-Type Filter

if (category === 'Others' && filters.subType !== 'All') {

if (item.type !== filters.subType) return false;

}



// B. Era Filter

if (filters.era === 'Modern' && !isModern(item.release_date)) return false;

if (filters.era === 'Vintage' && isModern(item.release_date)) return false;



// C. Feature Toggles

if (filters.features.ai) {

// Check for specific AI columns or M-series/A17+ chips

const hasAI = item.apple_intelligence === 'Yes' ||

item.chip_name?.includes('M') ||

item.chip_name?.includes('A17') ||

item.chip_name?.includes('A18');

if (!hasAI) return false;

}

if (filters.features.fiveG && item.five_g_support !== 'Yes') return false;

if (filters.features.aod && (item.always_on_display !== 'Yes' && item.always_on !== 'Yes')) return false;


// D. Port Filter

if (filters.port !== 'All') {

// Check port_type column or connector_type

const p = item.port_type || item.connection_type || '';

if (filters.port === 'USB-C' && !p.toLowerCase().includes('usb-c')) return false;

if (filters.port === 'Lightning' && !p.toLowerCase().includes('lightning')) return false;

}



// E. Size Logic (Heuristic based on Category)

if (filters.size !== 'All') {

let sizeVal = 0;

// Normalize size value

if (category === 'iPhone') sizeVal = parseFloat(item.display_size_inches);

if (category === 'iPad') sizeVal = parseFloat(item.display_size_inches);

if (category === 'Mac') sizeVal = parseFloat(item.screen_size);

if (category === 'Watch') sizeVal = parseFloat(item.case_size_mm);



if (!sizeVal) return true; // Skip if no size data



if (category === 'iPhone') {

if (filters.size === 'Compact' && sizeVal >= 6.1) return false;

if (filters.size === 'Standard' && (sizeVal < 6.1 || sizeVal > 6.6)) return false;

if (filters.size === 'Max' && sizeVal <= 6.6) return false;

}

else if (category === 'iPad') {

if (filters.size === 'Compact' && sizeVal >= 10) return false; // mini

if (filters.size === 'Standard' && (sizeVal < 10 || sizeVal > 12)) return false; // Air/Pro 11

if (filters.size === 'Max' && sizeVal <= 12) return false; // Pro 12.9

}

else if (category === 'Watch') {

if (filters.size === 'Compact' && sizeVal > 41) return false;

if (filters.size === 'Standard' && (sizeVal <= 41 || sizeVal > 45)) return false;

if (filters.size === 'Max' && sizeVal <= 45) return false; // Ultra

}

}



return true;

});

}, [items, filters, category]);



// UI Helper for Filter Buttons

const FilterButton = ({ label, active, onClick }: any) => (

<button

onClick={onClick}

className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${

active

? 'bg-black text-white border-black'

: 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'

}`}

>

{label}

</button>

);



return (

<main className="min-h-screen pt-40 pb-40 px-6 max-w-[1600px] mx-auto font-sans">


{/* 1. TOP LEVEL NAVIGATION */}

<header className="mb-8 flex justify-center">

<div className="inline-flex bg-[#E8E8ED] p-1.5 rounded-full">

{mainCategories.map((cat) => (

<button

key={cat}

onClick={() => setCategory(cat)}

className={`px-6 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 ${

category === cat

? 'bg-white text-black shadow-sm'

: 'text-gray-500 hover:text-black'

}`}

>

{cat}

</button>

))}

</div>

</header>



{/* 2. THE CONTROL CENTER (Filter Bar) */}

<section className="mb-16 bg-white/50 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-4 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between">


{/* GROUP A: DROPDOWNS */}

<div className="flex flex-wrap gap-4 justify-center">


{/* Others Sub-Category Switcher */}

{category === 'Others' ? (

<select

className="bg-gray-100 text-sm font-bold px-4 py-2 rounded-lg outline-none cursor-pointer hover:bg-gray-200 transition-colors"

value={filters.subType}

onChange={(e) => setFilters({...filters, subType: e.target.value})}

>

<option value="All">All Types</option>

<option value="Spatial">Vision</option>

<option value="Audio">Audio</option>

<option value="Home">Home</option>

<option value="Accessory">Accessories</option>

</select>

) : (

<>

{/* Era Selector */}

<select

className="bg-gray-100 text-sm font-bold px-4 py-2 rounded-lg outline-none cursor-pointer"

value={filters.era}

onChange={(e) => setFilters({...filters, era: e.target.value})}

>

<option value="All">Any Era</option>

<option value="Modern">Modern (&lt;5y)</option>

<option value="Vintage">Vintage (&gt;5y)</option>

</select>



{/* Size Selector */}

{['iPhone', 'iPad', 'Watch'].includes(category) && (

<select

className="bg-gray-100 text-sm font-bold px-4 py-2 rounded-lg outline-none cursor-pointer"

value={filters.size}

onChange={(e) => setFilters({...filters, size: e.target.value})}

>

<option value="All">Any Size</option>

<option value="Compact">Compact</option>

<option value="Standard">Standard</option>

<option value="Max">Max / Ultra</option>

</select>

)}



{/* Port Selector (iPhone/iPad) */}

{['iPhone', 'iPad'].includes(category) && (

<select

className="bg-gray-100 text-sm font-bold px-4 py-2 rounded-lg outline-none cursor-pointer"

value={filters.port}

onChange={(e) => setFilters({...filters, port: e.target.value})}

>

<option value="All">Any Port</option>

<option value="USB-C">USB-C</option>

<option value="Lightning">Lightning</option>

</select>

)}

</>

)}

</div>



{/* GROUP B: TOGGLES (Feature Pills) */}

{category !== 'Others' && (

<div className="flex flex-wrap gap-2 justify-center">

<FilterButton

label="AI Ready"

active={filters.features.ai}

onClick={() => setFilters({...filters, features: {...filters.features, ai: !filters.features.ai}})}

/>

<FilterButton

label="5G"

active={filters.features.fiveG}

onClick={() => setFilters({...filters, features: {...filters.features, fiveG: !filters.features.fiveG}})}

/>

<FilterButton

label="Always On"

active={filters.features.aod}

onClick={() => setFilters({...filters, features: {...filters.features, aod: !filters.features.aod}})}

/>

</div>

)}

</section>



{/* 3. RESULTS GRID */}

{loading && (

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">

{[1,2,3,4].map(i => <div key={i} className="h-[400px] bg-gray-200 rounded-[2rem]"></div>)}

</div>

)}



{!loading && filteredItems.length > 0 && (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

{filteredItems.map((item) => (

<Link

href={`/device/${item.slug}`}

key={item.id}

className="group relative bg-white rounded-[2rem] p-8 h-[440px] flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-100"

>

<div>

<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 block">

{item.type || item.series || category}

</span>

<h2 className="text-2xl font-bold text-gray-900 leading-tight">

{item.model_name}

</h2>


<div className="mt-8 space-y-3">

{/* Smart Specs based on Device */}

<div className="flex justify-between text-xs border-b border-gray-100 pb-2">

<span className="text-gray-400 font-bold">Released</span>

<span className="font-bold text-gray-800">{item.release_date}</span>

</div>


{/* Show AI Badge if applicable */}

{(item.apple_intelligence === 'Yes' || item.chip_name?.includes('M')) && (

<div className="flex justify-between text-xs border-b border-gray-100 pb-2">

<span className="text-gray-400 font-bold">Intelligence</span>

<span className="font-bold text-blue-600">Supported</span>

</div>

)}



{/* Show Port if iPhone/iPad */}

{(category === 'iPhone' || category === 'iPad') && (

<div className="flex justify-between text-xs border-b border-gray-100 pb-2">

<span className="text-gray-400 font-bold">Port</span>

<span className="font-bold text-gray-800">{item.port_type}</span>

</div>

)}

</div>

</div>



{/* Status Indicator */}

<div className="flex items-center gap-2">

<div className={`w-2 h-2 rounded-full ${isModern(item.release_date) ? 'bg-green-500' : 'bg-orange-400'}`}></div>

<span className="text-[10px] font-bold uppercase text-gray-400">

{isModern(item.release_date) ? 'Modern' : 'Vintage'}

</span>

</div>

</Link>

))}

</div>

)}



{!loading && filteredItems.length === 0 && (

<div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">

<h3 className="text-xl font-bold text-gray-400">No Match Found</h3>

<p className="text-gray-400 text-sm mt-2">Try adjusting your filters (e.g. Vintage vs Modern)</p>

</div>

)}



</main>

);

}