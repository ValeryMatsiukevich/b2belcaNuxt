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
    filter(predicate: (fav: Favs) => boolean): Favs[];
    map<U>(mapper: (fav: Favs) => U): U[];
    find(predicate: (fav: Favs) => boolean): Favs | undefined;
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
  interface Orders {
    Zakaz: string;
    Дата: string;
    Status: string;
  }

  interface Order {
    Comment: string;
    SummaDokumenta: string;
    Valuta: string;
    products: any[];
  }
  interface Managers {
    ManagerCode: string;
    FiszLico: string;
    ManagerTel: string;
    Telephones: string;
    TelVnutr: string;
    EMail: string;
  }

  interface orderInfotronic {
    Number: string;
    Date: string;
    Ref_Key: string;
    Товары: any[];
  }

  interface infotronic1c {
    Артикул: string;
    Ref_Key: string;
  }
  interface Nom_Ost {
    Code: string;
    Articul: string;
    Naim: string;
    NaimFull: string;
    EdIzm: string;
    RoditelCode: string;
    RoditelUID: string;
    isGroup: string;
    RynochnayaBN: string;
    OptBN: string;
    MelkiyOptBN: string;
    DilerBN: string;
    Quantity: string;
    Sebes: string;
    UID: string;
  }

  interface Balance {
    Organizaciya: string;
    Summa: number;
    SummaNal: number;
    UNP: string;
  }

  interface Invoices {
    Date: string;
    DneyOtsrochki: number;
    dniOplaty: number;
    NUM:string;
    Summa: number;
    SummaUSD: number;
    UNP: string;
    Valuta: string;
  }
}


