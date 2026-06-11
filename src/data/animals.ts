export type AnimalClass = "mamalia" | "reptil" | "burung" | "amfibi" | "ikan" | "serangga";

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  class: AnimalClass;
  fact: string; // fun fact for feedback
}

export const ANIMALS: Animal[] = [
  // MAMALIA
  { id: "a1", name: "Singa", emoji: "🦁", class: "mamalia", fact: "Mamalia — menyusui anaknya" },
  { id: "a2", name: "Lumba-lumba", emoji: "🐬", class: "mamalia", fact: "Mamalia — bernapas dengan paru-paru" },
  { id: "a3", name: "Kelelawar", emoji: "🦇", class: "mamalia", fact: "Mamalia terbang satu-satunya" },
  { id: "a4", name: "Gajah", emoji: "🐘", class: "mamalia", fact: "Mamalia darat terbesar" },
  { id: "a5", name: "Kanguru", emoji: "🦘", class: "mamalia", fact: "Mamalia berkantung" },
  { id: "a6", name: "Panda", emoji: "🐼", class: "mamalia", fact: "Mamalia karnivora pemakan bambu" },

  // REPTIL
  { id: "r1", name: "Buaya", emoji: "🐊", class: "reptil", fact: "Reptil — berdarah dingin, bersisik" },
  { id: "r2", name: "Ular", emoji: "🐍", class: "reptil", fact: "Reptil tanpa kaki" },
  { id: "r3", name: "Kadal", emoji: "🦎", class: "reptil", fact: "Reptil — regenerasi ekor" },
  { id: "r4", name: "Kura-kura", emoji: "🐢", class: "reptil", fact: "Reptil dengan cangkang tulang" },
  { id: "r5", name: "Bunglon", emoji: "🦎", class: "reptil", fact: "Reptil — bisa ganti warna" },

  // BURUNG
  { id: "b1", name: "Elang", emoji: "🦅", class: "burung", fact: "Burung — berdarah panas, berbulu" },
  { id: "b2", name: "Pinguin", emoji: "🐧", class: "burung", fact: "Burung tidak bisa terbang" },
  { id: "b3", name: "Merak", emoji: "🦚", class: "burung", fact: "Burung dengan bulu ekor indah" },
  { id: "b4", name: "Bebek", emoji: "🦆", class: "burung", fact: "Burung air dengan paruh pipih" },
  { id: "b5", name: "Kakatua", emoji: "🦜", class: "burung", fact: "Burung yang bisa meniru suara" },

  // AMFIBI
  { id: "f1", name: "Katak", emoji: "🐸", class: "amfibi", fact: "Amfibi — hidup di darat & air" },
  { id: "f2", name: "Salamander", emoji: "🦎", class: "amfibi", fact: "Amfibi yang bisa regenerasi" },
  { id: "f3", name: "Kodok", emoji: "🐸", class: "amfibi", fact: "Amfibi — kulit selalu lembab" },

  // IKAN
  { id: "i1", name: "Hiu", emoji: "🦈", class: "ikan", fact: "Ikan — bernapas dengan insang" },
  { id: "i2", name: "Gurita", emoji: "🐙", class: "ikan", fact: "Ikan cephalopoda" },
  { id: "i3", name: "Ikan Mas", emoji: "🐠", class: "ikan", fact: "Ikan air tawar populer" },
  { id: "i4", name: "Clownfish", emoji: "🐡", class: "ikan", fact: "Ikan karang berwarna cerah" },

  // SERANGGA
  { id: "s1", name: "Kupu-kupu", emoji: "🦋", class: "serangga", fact: "Serangga — metamorfosis sempurna" },
  { id: "s2", name: "Lebah", emoji: "🐝", class: "serangga", fact: "Serangga penghasil madu" },
  { id: "s3", name: "Semut", emoji: "🐜", class: "serangga", fact: "Serangga sosial berkasta" },
  { id: "s4", name: "Capung", emoji: "🪲", class: "serangga", fact: "Serangga terbang tercepat" },
];

export const CLASS_CONFIG: Record<AnimalClass, { label: string; emoji: string; color: string }> = {
  mamalia: { label: "Mamalia", emoji: "🦁", color: "#ff9944" },
  reptil: { label: "Reptil", emoji: "🐍", color: "#4adeab" },
  burung: { label: "Burung", emoji: "🐦", color: "#6c8eff" },
  amfibi: { label: "Amfibi", emoji: "🐸", color: "#a78bff" },
  ikan: { label: "Ikan", emoji: "🐟", color: "#22d3ee" },
  serangga: { label: "Serangga", emoji: "🦋", color: "#ffaa5e" },
};

export function getGameAnimals(count = 6): Animal[] {
  const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5);
  // Ensure variety: take max 2 per class
  const result: Animal[] = [];
  const classCount: Record<string, number> = {};
  for (const a of shuffled) {
    if ((classCount[a.class] ?? 0) < 2 && result.length < count) {
      result.push(a);
      classCount[a.class] = (classCount[a.class] ?? 0) + 1;
    }
  }
  return result;
}
