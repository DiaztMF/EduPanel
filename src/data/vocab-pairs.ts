export interface VocabPair {
  id: string;
  english: string;
  indonesian: string;
  emoji: string;
}

export const VOCAB_PAIRS: VocabPair[] = [
  // Alam
  { id: "v1", english: "Mountain", indonesian: "Gunung", emoji: "⛰️" },
  { id: "v2", english: "River", indonesian: "Sungai", emoji: "🏞️" },
  { id: "v3", english: "Forest", indonesian: "Hutan", emoji: "🌲" },
  { id: "v4", english: "Ocean", indonesian: "Samudra", emoji: "🌊" },
  { id: "v5", english: "Desert", indonesian: "Gurun", emoji: "🏜️" },
  { id: "v6", english: "Island", indonesian: "Pulau", emoji: "🏝️" },
  { id: "v7", english: "Waterfall", indonesian: "Air Terjun", emoji: "🌊" },
  { id: "v8", english: "Volcano", indonesian: "Gunung Berapi", emoji: "🌋" },
  // Hewan
  { id: "v9", english: "Elephant", indonesian: "Gajah", emoji: "🐘" },
  { id: "v10", english: "Tiger", indonesian: "Harimau", emoji: "🐯" },
  { id: "v11", english: "Eagle", indonesian: "Elang", emoji: "🦅" },
  { id: "v12", english: "Butterfly", indonesian: "Kupu-kupu", emoji: "🦋" },
  { id: "v13", english: "Crocodile", indonesian: "Buaya", emoji: "🐊" },
  { id: "v14", english: "Dolphin", indonesian: "Lumba-lumba", emoji: "🐬" },
  // Profesi
  { id: "v15", english: "Doctor", indonesian: "Dokter", emoji: "👨‍⚕️" },
  { id: "v16", english: "Teacher", indonesian: "Guru", emoji: "👨‍🏫" },
  { id: "v17", english: "Farmer", indonesian: "Petani", emoji: "👨‍🌾" },
  { id: "v18", english: "Pilot", indonesian: "Pilot", emoji: "👨‍✈️" },
  { id: "v19", english: "Engineer", indonesian: "Insinyur", emoji: "👷" },
  { id: "v20", english: "Scientist", indonesian: "Ilmuwan", emoji: "🧑‍🔬" },
  // Benda
  { id: "v21", english: "Telescope", indonesian: "Teleskop", emoji: "🔭" },
  { id: "v22", english: "Compass", indonesian: "Kompas", emoji: "🧭" },
  { id: "v23", english: "Microscope", indonesian: "Mikroskop", emoji: "🔬" },
  { id: "v24", english: "Library", indonesian: "Perpustakaan", emoji: "📚" },
  { id: "v25", english: "Bridge", indonesian: "Jembatan", emoji: "🌉" },
  { id: "v26", english: "Lighthouse", indonesian: "Mercusuar", emoji: "🗼" },
  // Sifat
  { id: "v27", english: "Brave", indonesian: "Berani", emoji: "💪" },
  { id: "v28", english: "Smart", indonesian: "Cerdas", emoji: "🧠" },
  { id: "v29", english: "Honest", indonesian: "Jujur", emoji: "✅" },
  { id: "v30", english: "Creative", indonesian: "Kreatif", emoji: "🎨" },
];

export function getRoundPairs(count = 5): VocabPair[] {
  const shuffled = [...VOCAB_PAIRS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
