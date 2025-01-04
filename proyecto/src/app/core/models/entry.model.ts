export class Entry {
    entryName: string;
    index?: string;
    note?: string;
    annotation?: string;
    grammar?: string;
    audioEnglish?: string; // Propiedad para el audio en inglés
    audioUSA?: string; // Propiedad para el audio en USA
    creator?: string; // Opcional
    lastUpdate?: string; // Opcional
  
    constructor() {
      this.entryName = '';
      this.index = '';
      this.note = '';
      this.annotation = '';
      this.grammar = '';
      this.audioEnglish = '';
      this.audioUSA = '';
      this.creator = '';
      this.lastUpdate = '';
    }
  }
  