// ============================================
// Spanish Banks Data
// Information based on March 2026 data
// ============================================

import { Bank } from '@/types/mortgage';

export const BANKS: Bank[] = [
  {
    id: 'santander',
    name: 'Banco Santander',
    entityCode: '0049',
    website: 'https://www.bancosantander.es',
    assetsSize: 1867515, // Millions of euros
    officeCount: 2400,
    creditRating: 'A-',
    isOnlineOnly: false,
    description: 'Mayor banco de España por activos, con presencia internacional',
  },
  {
    id: 'bbva',
    name: 'BBVA',
    entityCode: '0182',
    website: 'https://www.bbva.es',
    assetsSize: 859576,
    officeCount: 2100,
    creditRating: 'A',
    isOnlineOnly: false,
    description: 'Segundo banco español con fuerte presencia en Latinoamérica',
  },
  {
    id: 'caixabank',
    name: 'CaixaBank',
    entityCode: '2100',
    website: 'https://www.caixabank.es',
    assetsSize: 664040,
    officeCount: 4200,
    creditRating: 'A-',
    isOnlineOnly: false,
    description: 'Líder en banca retail en España, amplia red de oficinas',
  },
  {
    id: 'bankinter',
    name: 'Bankinter',
    entityCode: '0128',
    website: 'https://www.bankinter.com',
    assetsSize: 95000,
    officeCount: 350,
    creditRating: 'BBB+',
    isOnlineOnly: false,
    description: 'Banco medio con excelente servicio digital y atención al cliente',
  },
  {
    id: 'sabadell',
    name: 'Banco Sabadell',
    entityCode: '0081',
    website: 'https://www.bancsabadell.com',
    assetsSize: 175000,
    officeCount: 1100,
    creditRating: 'BBB',
    isOnlineOnly: false,
    description: 'Banco tradicional con fuerte presencia en Cataluña y Levante',
  },
  {
    id: 'unicaja',
    name: 'Unicaja Banco',
    entityCode: '2103',
    website: 'https://www.unicajabanco.es',
    assetsSize: 115000,
    officeCount: 1300,
    creditRating: 'BBB-',
    isOnlineOnly: false,
    description: 'Banco andaluz con presencia nacional, especializado en banca personal',
  },
  {
    id: 'ibercaja',
    name: 'Ibercaja',
    entityCode: '2085',
    website: 'https://www.ibercaja.es',
    assetsSize: 42000,
    officeCount: 850,
    isOnlineOnly: false,
    description: 'Banco aragonés con buena red de oficinas en el norte de España',
  },
  {
    id: 'kutxabank',
    name: 'Kutxabank',
    entityCode: '2095',
    website: 'https://www.kutxabank.es',
    assetsSize: 38000,
    officeCount: 650,
    isOnlineOnly: false,
    description: 'Banco vasco con fuerte presencia en el País Vasco',
  },
  {
    id: 'abanca',
    name: 'Abanca',
    entityCode: '2080',
    website: 'https://www.abanca.es',
    assetsSize: 65000,
    officeCount: 500,
    isOnlineOnly: false,
    description: 'Banco gallego con presencia creciente en toda España',
  },
  {
    id: 'ing',
    name: 'ING',
    entityCode: '1465',
    website: 'https://www.ing.es',
    assetsSize: 85000,
    officeCount: 0,
    creditRating: 'A+',
    isOnlineOnly: true,
    description: 'Banco online pionero en España, sin comisiones',
  },
];

/**
 * Get bank by ID
 */
export function getBankById(id: string): Bank | undefined {
  return BANKS.find(bank => bank.id === id);
}

/**
 * Get all banks sorted by assets size
 */
export function getBanksBySize(): Bank[] {
  return [...BANKS].sort((a, b) => b.assetsSize - a.assetsSize);
}

/**
 * Get online-only banks
 */
export function getOnlineBanks(): Bank[] {
  return BANKS.filter(bank => bank.isOnlineOnly);
}

/**
 * Get traditional banks with physical offices
 */
export function getTraditionalBanks(): Bank[] {
  return BANKS.filter(bank => !bank.isOnlineOnly && bank.officeCount && bank.officeCount > 0);
}
