export type AnimalClass = "mamalia" | "reptil" | "burung" | "amfibi" | "ikan" | "serangga";

export interface Animal {
  id: string;
  name: string;
  class: AnimalClass;
  fact: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const ANIMALS: Animal[] = [
  // MAMALIA
  { id: "a1", name: "Singa", class: "mamalia", fact: "Mamalia: menyusui anaknya", difficulty: "easy" },
  { id: "a2", name: "Lumba-lumba", class: "mamalia", fact: "Mamalia: bernapas dengan paru-paru", difficulty: "medium" },
  { id: "a3", name: "Kelelawar", class: "mamalia", fact: "Mamalia terbang satu-satunya", difficulty: "medium" },
  { id: "a4", name: "Gajah", class: "mamalia", fact: "Mamalia darat terbesar", difficulty: "easy" },
  { id: "a5", name: "Kanguru", class: "mamalia", fact: "Mamalia berkantung khas Australia", difficulty: "easy" },
  { id: "a6", name: "Panda", class: "mamalia", fact: "Mamalia ordo karnivora pemakan bambu", difficulty: "medium" },

  // REPTIL
  { id: "r1", name: "Buaya", class: "reptil", fact: "Reptil: berdarah dingin dan bersisik", difficulty: "easy" },
  { id: "r2", name: "Ular", class: "reptil", fact: "Reptil melata tanpa kaki", difficulty: "easy" },
  { id: "r3", name: "Kadal", class: "reptil", fact: "Reptil: memiliki kemampuan regenerasi ekor", difficulty: "medium" },
  { id: "r4", name: "Kura-kura", class: "reptil", fact: "Reptil terlindung cangkang tulang keras", difficulty: "easy" },
  { id: "r5", name: "Bunglon", class: "reptil", fact: "Reptil: mampu mengubah warna kulit (kamuflase)", difficulty: "hard" },

  // BURUNG
  { id: "b1", name: "Elang", class: "burung", fact: "Burung karnivora dengan penglihatan tajam", difficulty: "easy" },
  { id: "b2", name: "Pinguin", class: "burung", fact: "Burung perenang handal di kutub", difficulty: "easy" },
  { id: "b3", name: "Merak", class: "burung", fact: "Burung jantan memiliki bulu ekor indah", difficulty: "medium" },
  { id: "b4", name: "Bebek", class: "burung", fact: "Burung air dengan selaput pada kaki", difficulty: "easy" },
  { id: "b5", name: "Kakatua", class: "burung", fact: "Burung cerdas yang mampu menirukan suara", difficulty: "medium" },

  // AMFIBI
  { id: "f1", name: "Katak", class: "amfibi", fact: "Amfibi: hidup di darat dan air tawar", difficulty: "easy" },
  { id: "f2", name: "Salamander", class: "amfibi", fact: "Amfibi berekor dengan regenerasi jaringan", difficulty: "hard" },
  { id: "f3", name: "Kodok", class: "amfibi", fact: "Amfibi dengan kulit berkutil dan selalu lembap", difficulty: "medium" },

  // IKAN
  { id: "i1", name: "Hiu", class: "ikan", fact: "Ikan bertulang rawan predator lautan", difficulty: "easy" },
  { id: "i2", name: "Ikan Pari", class: "ikan", fact: "Ikan bertulang rawan dengan sirip melebar", difficulty: "medium" },
  { id: "i3", name: "Ikan Mas", class: "ikan", fact: "Ikan air tawar bernapas dengan insang", difficulty: "easy" },
  { id: "i4", name: "Ikan Badut", class: "ikan", fact: "Ikan terumbu karang hidup bersimbiosis", difficulty: "medium" },

  // SERANGGA
  { id: "s1", name: "Kupu-kupu", class: "serangga", fact: "Serangga: mengalami metamorfosis sempurna", difficulty: "easy" },
  { id: "s2", name: "Lebah", class: "serangga", fact: "Serangga penghasil madu dan penyerbuk bunga", difficulty: "easy" },
  { id: "s3", name: "Semut", class: "serangga", fact: "Serangga sosial berkoloni dengan kasta", difficulty: "medium" },
  { id: "s4", name: "Capung", class: "serangga", fact: "Serangga pemangsa terbang berkecepatan tinggi", difficulty: "hard" },
];

export const CLASS_CONFIG: Record<
  AnimalClass,
  { label: string; iconKey: "paw" | "shield" | "feather" | "droplet" | "fish" | "bug"; color: string }
> = {
  mamalia: { label: "Mamalia", iconKey: "paw", color: "#ff9944" },
  reptil: { label: "Reptil", iconKey: "shield", color: "#4adeab" },
  burung: { label: "Burung", iconKey: "feather", color: "#6c8eff" },
  amfibi: { label: "Amfibi", iconKey: "droplet", color: "#a78bff" },
  ikan: { label: "Ikan", iconKey: "fish", color: "#22d3ee" },
  serangga: { label: "Serangga", iconKey: "bug", color: "#ffaa5e" },
};

export function getGameAnimals(
  count = 12,
  difficulty?: "easy" | "medium" | "hard"
): Animal[] {
  const filtered = difficulty
    ? ANIMALS.filter((a) => (difficulty === "hard" ? true : a.difficulty === difficulty || a.difficulty === "easy"))
    : ANIMALS;
  const pool = filtered.length >= count ? filtered : ANIMALS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const result: Animal[] = [];
  const classCount: Record<string, number> = {};
  for (const a of shuffled) {
    if ((classCount[a.class] ?? 0) < 3 && result.length < count) {
      result.push(a);
      classCount[a.class] = (classCount[a.class] ?? 0) + 1;
    }
  }

  // If still less than count, fill remaining
  if (result.length < count) {
    for (const a of shuffled) {
      if (!result.includes(a) && result.length < count) {
        result.push(a);
      }
    }
  }

  return result;
}
