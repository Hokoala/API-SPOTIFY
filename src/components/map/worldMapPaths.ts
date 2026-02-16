export interface CountryPath {
    name: string
    x: number
    y: number
}

// Country center coordinates on a 1000x500 equirectangular projection
// x = (lon + 180) / 360 * 1000, y = (90 - lat) / 180 * 500
export const COUNTRY_POSITIONS: Record<string, CountryPath> = {
    US: { name: "Etats-Unis", x: 286, y: 142 },
    CA: { name: "Canada", x: 290, y: 124 },
    MX: { name: "Mexique", x: 225, y: 196 },
    BR: { name: "Bresil", x: 367, y: 294 },
    AR: { name: "Argentine", x: 338, y: 346 },
    CO: { name: "Colombie", x: 294, y: 237 },
    CL: { name: "Chili", x: 303, y: 343 },
    PE: { name: "Perou", x: 286, y: 283 },
    VE: { name: "Venezuela", x: 314, y: 221 },
    GB: { name: "Royaume-Uni", x: 500, y: 107 },
    FR: { name: "France", x: 507, y: 114 },
    DE: { name: "Allemagne", x: 537, y: 104 },
    ES: { name: "Espagne", x: 490, y: 138 },
    IT: { name: "Italie", x: 535, y: 134 },
    PT: { name: "Portugal", x: 475, y: 143 },
    NL: { name: "Pays-Bas", x: 514, y: 104 },
    BE: { name: "Belgique", x: 513, y: 109 },
    SE: { name: "Suede", x: 550, y: 85 },
    NO: { name: "Norvege", x: 530, y: 84 },
    DK: { name: "Danemark", x: 535, y: 95 },
    FI: { name: "Finlande", x: 569, y: 83 },
    IE: { name: "Irlande", x: 483, y: 102 },
    CH: { name: "Suisse", x: 521, y: 120 },
    AT: { name: "Autriche", x: 546, y: 116 },
    PL: { name: "Pologne", x: 558, y: 105 },
    RU: { name: "Russie", x: 604, y: 95 },
    UA: { name: "Ukraine", x: 585, y: 110 },
    TR: { name: "Turquie", x: 592, y: 139 },
    JP: { name: "Japon", x: 888, y: 151 },
    KR: { name: "Coree du Sud", x: 853, y: 146 },
    CN: { name: "Chine", x: 823, y: 139 },
    IN: { name: "Inde", x: 714, y: 171 },
    AU: { name: "Australie", x: 914, y: 348 },
    NZ: { name: "Nouvelle-Zelande", x: 986, y: 365 },
    ZA: { name: "Afrique du Sud", x: 578, y: 322 },
    NG: { name: "Nigeria", x: 521, y: 225 },
    EG: { name: "Egypte", x: 586, y: 167 },
    MA: { name: "Maroc", x: 481, y: 156 },
    DZ: { name: "Algerie", x: 508, y: 148 },
    KE: { name: "Kenya", x: 603, y: 254 },
    IL: { name: "Israel", x: 597, y: 161 },
    SA: { name: "Arabie Saoudite", x: 630, y: 181 },
    AE: { name: "Emirats Arabes Unis", x: 652, y: 181 },
    PH: { name: "Philippines", x: 836, y: 210 },
    ID: { name: "Indonesie", x: 797, y: 267 },
    TH: { name: "Thailande", x: 779, y: 212 },
    VN: { name: "Vietnam", x: 794, y: 192 },
    MY: { name: "Malaisie", x: 783, y: 241 },
    PK: { name: "Pakistan", x: 703, y: 157 },
    BD: { name: "Bangladesh", x: 751, y: 184 },
    CU: { name: "Cuba", x: 271, y: 186 },
    JM: { name: "Jamaique", x: 287, y: 200 },
    PR: { name: "Porto Rico", x: 316, y: 199 },
    RO: { name: "Roumanie", x: 572, y: 127 },
    GR: { name: "Grece", x: 566, y: 145 },
    CZ: { name: "Republique Tcheque", x: 540, y: 111 },
    HU: { name: "Hongrie", x: 553, y: 118 },
}

// Simplified continent outlines (equirectangular projection, 1000x500)
export const CONTINENT_PATHS = [
    // North America
    "M28,69 L111,56 L200,50 L278,50 L333,78 L353,119 L319,181 L272,181 L231,178 L208,161 L175,158 L153,114 L42,83 Z",
    // Central America
    "M175,158 L208,161 L231,178 L225,196 L210,220 L195,230 L180,210 Z",
    // South America
    "M278,217 L314,221 L333,236 L403,264 L403,311 L383,314 L350,342 L339,356 L311,403 L292,375 L272,300 L286,256 Z",
    // Europe
    "M472,150 L472,89 L500,83 L528,100 L569,53 L589,56 L611,81 L583,125 L575,147 L556,153 L500,150 Z",
    // Africa
    "M450,208 L453,153 L486,150 L528,147 L589,164 L619,217 L642,244 L642,283 L611,311 L597,344 L578,342 L550,347 L533,322 L528,267 L503,236 L478,236 L453,217 Z",
    // Asia (mainland)
    "M572,133 L611,131 L667,97 L722,97 L778,125 L833,125 L875,111 L903,139 L861,167 L833,189 L806,222 L792,247 L767,233 L722,231 L689,183 L653,181 L625,167 L600,161 L578,150 Z",
    // India subcontinent
    "M689,183 L714,171 L740,175 L769,192 L750,228 L722,231 L689,183 Z",
    // Southeast Asia
    "M769,192 L794,192 L810,210 L836,210 L810,240 L783,241 L769,235 Z",
    // Indonesia
    "M780,255 L800,260 L830,265 L850,270 L830,280 L797,275 L780,265 Z",
    // Australia
    "M814,278 L861,283 L894,286 L914,300 L928,328 L925,356 L911,369 L881,356 L861,339 L836,344 L817,342 L814,319 L819,306 Z",
    // Japan
    "M875,130 L888,140 L895,155 L890,165 L880,158 L875,145 Z",
    // UK/Ireland
    "M485,95 L495,90 L505,95 L505,112 L495,117 L485,112 Z",
]

export function countryFlag(code: string): string {
    return code
        .toUpperCase()
        .split("")
        .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
        .join("")
}
