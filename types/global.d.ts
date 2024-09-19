export {};

declare global {
  interface Goods {
    filter(arg0: (good: Goods) => boolean): any;
    map(arg0: (good: Goods) => Goods): any;
    find(arg0: (folder: Goods) => boolean): unknown;
    NomCode: string;
    NomNaim: string;
    RoditelCode: string;
    slug: string;
    IsGropup: string;
    Quantity: number;
    Akcionniy: string;
    Vigr7712: string;
    ZapretProdazhiNARD: string;
    Price: string;
    inCart: number;
    [key: string]: any;

    [Symbol.iterator](): Iterator<Goods>;
  }

  interface Favs {
    filter(arg0: (fav: Favs) => boolean): any;
    map(arg0: (fav: Favs) => Goods): any;
    find(arg0: (fav: Favs) => boolean): unknown;
    NomCode: string;
    push(item: Favs): number; // Add push method to interface
  }

  interface Ostatki {
    NomCode: string;
    Sklad: string;
    quantity: string;
    Rezerv: string;
  }

  interface Contragents {
    Aktivenb2b: boolean;
    EmailDlyaRassylky: string;
    KodTipSpecCen: string;
    Kontragent: string;
    NePokazyvatSklandRegion: string;
    OsnmanagerCode: string;
    Priznak: number;
    Tip: number;
    UNP: string;
    priceCurrency: string;
    Gorod: string;
  }

  interface Tree {
    id: string;
    title: string;
    slug: string;
    children?: Tree[];
  }

  interface Prices {
    Cena: string;
    NomCode: string;
    TipCenCode: string;
    ValutaCode: string;
  }

  interface LoginResponse {
    Kontragent: any[];
    Ответ: string;
  }

  interface Kursy {
    Cena: string;
    Kurs: number;
    Kratnost: number;
    Valuta: string;
  }
}

// Ensure that this file is included in your tsconfig.json file under "include"
