import { GeoJsonNeighborhoodCollection } from '../types/dengue';

/**
 * GeoJSON com os principais bairros e distritos sanitários de São Luís - MA.
 * Coordenadas centradas na Ilha de Upaon-Açu (São Luís).
 * Padrão GeoJSON WGS84 [longitude, latitude].
 */
export const SAO_LUIS_BAIRROS_GEOJSON: GeoJsonNeighborhoodCollection = {
  type: 'FeatureCollection',
  name: 'Bairros de São Luís - MA',
  features: [
    // 1. Centro Histórico / Praia Grande
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Centro Histórico / Praia Grande',
        POPULACAO: 32000,
        id: 'centro-historico',
        name: 'Centro Histórico / Praia Grande',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3090, -2.5280],
            [-44.3015, -2.5265],
            [-44.2980, -2.5330],
            [-44.3040, -2.5390],
            [-44.3120, -2.5350],
            [-44.3090, -2.5280]
          ]
        ]
      }
    },
    // 2. Ponta d'Areia
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: "Ponta d'Areia",
        POPULACAO: 16700,
        id: 'ponta-dareia',
        name: "Ponta d'Areia",
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Litorânea Norte'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3210, -2.5020],
            [-44.3090, -2.4930],
            [-44.3000, -2.4970],
            [-44.3030, -2.5090],
            [-44.3180, -2.5110],
            [-44.3210, -2.5020]
          ]
        ]
      }
    },
    // 3. São Francisco
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'São Francisco',
        POPULACAO: 24500,
        id: 'sao-francisco',
        name: 'São Francisco',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3020, -2.5090],
            [-44.2920, -2.5060],
            [-44.2880, -2.5150],
            [-44.2970, -2.5210],
            [-44.3050, -2.5160],
            [-44.3020, -2.5090]
          ]
        ]
      }
    },
    // 4. Renascença (I e II)
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Renascença',
        POPULACAO: 22300,
        id: 'renascenca',
        name: 'Renascença',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3000, -2.4970],
            [-44.2790, -2.4890],
            [-44.2710, -2.5020],
            [-44.2830, -2.5150],
            [-44.3030, -2.5090],
            [-44.3000, -2.4970]
          ]
        ]
      }
    },
    // 5. Calhau
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Calhau',
        POPULACAO: 25100,
        id: 'calhau',
        name: 'Calhau',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Litorânea Norte'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2790, -2.4890],
            [-44.2560, -2.4820],
            [-44.2530, -2.4950],
            [-44.2710, -2.5020],
            [-44.2790, -2.4890]
          ]
        ]
      }
    },
    // 6. Olho d'Água
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: "Olho d'Água",
        POPULACAO: 15400,
        id: 'olho-dagua',
        name: "Olho d'Água",
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Litorânea Norte'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2560, -2.4820],
            [-44.2320, -2.4780],
            [-44.2270, -2.4910],
            [-44.2530, -2.4950],
            [-44.2560, -2.4820]
          ]
        ]
      }
    },
    // 7. Cohama
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Cohama',
        POPULACAO: 28400,
        id: 'cohama',
        name: 'Cohama',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Noroeste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2710, -2.5020],
            [-44.2530, -2.4950],
            [-44.2460, -2.5140],
            [-44.2640, -2.5200],
            [-44.2710, -2.5020]
          ]
        ]
      }
    },
    // 8. Vinhais
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Vinhais',
        POPULACAO: 31200,
        id: 'vinhais',
        name: 'Vinhais',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Noroeste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2640, -2.5180],
            [-44.2470, -2.5140],
            [-44.2420, -2.5280],
            [-44.2580, -2.5320],
            [-44.2640, -2.5180]
          ]
        ]
      }
    },
    // 9. Bequimão
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Bequimão',
        POPULACAO: 27500,
        id: 'bequimao',
        name: 'Bequimão',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2680, -2.5280],
            [-44.2530, -2.5260],
            [-44.2490, -2.5390],
            [-44.2630, -2.5420],
            [-44.2680, -2.5280]
          ]
        ]
      }
    },
    // 10. Maranhão Novo
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Maranhão Novo',
        POPULACAO: 17200,
        id: 'maranhao-novo',
        name: 'Maranhão Novo',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2730, -2.5360],
            [-44.2610, -2.5340],
            [-44.2580, -2.5460],
            [-44.2700, -2.5480],
            [-44.2730, -2.5360]
          ]
        ]
      }
    },
    // 11. Ipase
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Ipase',
        POPULACAO: 13900,
        id: 'ipase',
        name: 'Ipase',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2750, -2.5250],
            [-44.2650, -2.5220],
            [-44.2620, -2.5340],
            [-44.2720, -2.5360],
            [-44.2750, -2.5250]
          ]
        ]
      }
    },
    // 12. Turu
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Turu',
        POPULACAO: 72400,
        id: 'turu',
        name: 'Turu',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Norte'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2460, -2.4960],
            [-44.2180, -2.4920],
            [-44.2120, -2.5120],
            [-44.2380, -2.5170],
            [-44.2460, -2.4960]
          ]
        ]
      }
    },
    // 13. Parque Vitória
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Parque Vitória',
        POPULACAO: 34500,
        id: 'parque-vitoria',
        name: 'Parque Vitória',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Norte'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2250, -2.5130],
            [-44.2040, -2.5080],
            [-44.1980, -2.5260],
            [-44.2180, -2.5300],
            [-44.2250, -2.5130]
          ]
        ]
      }
    },
    // 14. Cohatrac (I, II, III, IV e Primavera)
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Cohatrac',
        POPULACAO: 63100,
        id: 'cohatrac',
        name: 'Cohatrac',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Leste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2190, -2.5280],
            [-44.1950, -2.5240],
            [-44.1880, -2.5440],
            [-44.2100, -2.5490],
            [-44.2190, -2.5280]
          ]
        ]
      }
    },
    // 15. Cohab Anil
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Cohab Anil',
        POPULACAO: 38200,
        id: 'cohab-anil',
        name: 'Cohab Anil',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Leste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2360, -2.5310],
            [-44.2160, -2.5280],
            [-44.2110, -2.5460],
            [-44.2290, -2.5510],
            [-44.2360, -2.5310]
          ]
        ]
      }
    },
    // 16. Forquilha
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Forquilha',
        POPULACAO: 22100,
        id: 'forquilha',
        name: 'Forquilha',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Leste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2220, -2.5450],
            [-44.2030, -2.5420],
            [-44.1970, -2.5580],
            [-44.2160, -2.5620],
            [-44.2220, -2.5450]
          ]
        ]
      }
    },
    // 17. Planalto Anil
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Planalto Anil',
        POPULACAO: 19400,
        id: 'planalto-anil',
        name: 'Planalto Anil',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Leste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2340, -2.5440],
            [-44.2210, -2.5420],
            [-44.2170, -2.5560],
            [-44.2290, -2.5590],
            [-44.2340, -2.5440]
          ]
        ]
      }
    },
    // 18. Angelim
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Angelim',
        POPULACAO: 21800,
        id: 'angelim',
        name: 'Angelim',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2490, -2.5250],
            [-44.2340, -2.5230],
            [-44.2310, -2.5370],
            [-44.2450, -2.5400],
            [-44.2490, -2.5250]
          ]
        ]
      }
    },
    // 19. Anil
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Anil',
        POPULACAO: 23600,
        id: 'anil',
        name: 'Anil',
        layer: 'Distrito Cohab',
        distrito: 'Distrito Cohab',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2460, -2.5380],
            [-44.2310, -2.5360],
            [-44.2270, -2.5500],
            [-44.2420, -2.5530],
            [-44.2460, -2.5380]
          ]
        ]
      }
    },
    // 20. Cidade Operária
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Cidade Operária',
        POPULACAO: 85200,
        id: 'cidade-operaria',
        name: 'Cidade Operária',
        layer: 'Distrito Tirirical',
        distrito: 'Distrito Tirirical',
        zona: 'Urbana Leste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2040, -2.5580],
            [-44.1780, -2.5520],
            [-44.1720, -2.5760],
            [-44.1960, -2.5820],
            [-44.2040, -2.5580]
          ]
        ]
      }
    },
    // 21. Cidade Olímpica
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Cidade Olímpica',
        POPULACAO: 52000,
        id: 'cidade-olimpica',
        name: 'Cidade Olímpica',
        layer: 'Distrito Tirirical',
        distrito: 'Distrito Tirirical',
        zona: 'Urbana Leste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.1950, -2.5780],
            [-44.1710, -2.5720],
            [-44.1650, -2.5950],
            [-44.1870, -2.6020],
            [-44.1950, -2.5780]
          ]
        ]
      }
    },
    // 22. São Cristóvão
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'São Cristóvão',
        POPULACAO: 29800,
        id: 'sao-cristovao',
        name: 'São Cristóvão',
        layer: 'Distrito Tirirical',
        distrito: 'Distrito Tirirical',
        zona: 'Urbana Sudeste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2310, -2.5590],
            [-44.2120, -2.5550],
            [-44.2060, -2.5720],
            [-44.2250, -2.5760],
            [-44.2310, -2.5590]
          ]
        ]
      }
    },
    // 23. Tirirical
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Tirirical',
        POPULACAO: 25400,
        id: 'tirirical',
        name: 'Tirirical',
        layer: 'Distrito Tirirical',
        distrito: 'Distrito Tirirical',
        zona: 'Urbana Sudeste'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2370, -2.5720],
            [-44.2150, -2.5690],
            [-44.2080, -2.5920],
            [-44.2300, -2.5960],
            [-44.2370, -2.5720]
          ]
        ]
      }
    },
    // 24. Monte Castelo
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Monte Castelo',
        POPULACAO: 23100,
        id: 'monte-castelo',
        name: 'Monte Castelo',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2960, -2.5310],
            [-44.2820, -2.5280],
            [-44.2780, -2.5410],
            [-44.2910, -2.5440],
            [-44.2960, -2.5310]
          ]
        ]
      }
    },
    // 25. João Paulo
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'João Paulo',
        POPULACAO: 19800,
        id: 'joao-paulo',
        name: 'João Paulo',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2830, -2.5370],
            [-44.2690, -2.5350],
            [-44.2650, -2.5470],
            [-44.2780, -2.5500],
            [-44.2830, -2.5370]
          ]
        ]
      }
    },
    // 26. Bairro de Fátima
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Bairro de Fátima',
        POPULACAO: 16700,
        id: 'bairro-de-fatima',
        name: 'Bairro de Fátima',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2950, -2.5400],
            [-44.2830, -2.5380],
            [-44.2790, -2.5490],
            [-44.2900, -2.5520],
            [-44.2950, -2.5400]
          ]
        ]
      }
    },
    // 27. Liberdade
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Liberdade',
        POPULACAO: 28900,
        id: 'liberdade',
        name: 'Liberdade',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3050, -2.5320],
            [-44.2940, -2.5300],
            [-44.2910, -2.5400],
            [-44.3010, -2.5430],
            [-44.3050, -2.5320]
          ]
        ]
      }
    },
    // 28. Madre Deus
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Madre Deus',
        POPULACAO: 14200,
        id: 'madre-deus',
        name: 'Madre Deus',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3080, -2.5370],
            [-44.2980, -2.5360],
            [-44.2950, -2.5450],
            [-44.3060, -2.5480],
            [-44.3080, -2.5370]
          ]
        ]
      }
    },
    // 29. Camboa
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Camboa',
        POPULACAO: 12500,
        id: 'camboa',
        name: 'Camboa',
        layer: 'Distrito Centro',
        distrito: 'Distrito Centro',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3020, -2.5240],
            [-44.2930, -2.5210],
            [-44.2900, -2.5310],
            [-44.2990, -2.5330],
            [-44.3020, -2.5240]
          ]
        ]
      }
    },
    // 30. Alemanha
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Alemanha',
        POPULACAO: 18400,
        id: 'alemanha',
        name: 'Alemanha',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2810, -2.5440],
            [-44.2690, -2.5420],
            [-44.2660, -2.5540],
            [-44.2770, -2.5570],
            [-44.2810, -2.5440]
          ]
        ]
      }
    },
    // 31. Caratatiua
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Caratatiua',
        POPULACAO: 15300,
        id: 'caratatiua',
        name: 'Caratatiua',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2760, -2.5510],
            [-44.2630, -2.5490],
            [-44.2600, -2.5600],
            [-44.2720, -2.5630],
            [-44.2760, -2.5510]
          ]
        ]
      }
    },
    // 32. Vila Palmeira
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Vila Palmeira',
        POPULACAO: 26400,
        id: 'vila-palmeira',
        name: 'Vila Palmeira',
        layer: 'Distrito Bequimão',
        distrito: 'Distrito Bequimão',
        zona: 'Urbana Central'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2720, -2.5580],
            [-44.2580, -2.5550],
            [-44.2540, -2.5690],
            [-44.2680, -2.5720],
            [-44.2720, -2.5580]
          ]
        ]
      }
    },
    // 33. Coroadinho
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Coroadinho',
        POPULACAO: 41800,
        id: 'coroadinho',
        name: 'Coroadinho',
        layer: 'Distrito Coroadinho',
        distrito: 'Distrito Coroadinho',
        zona: 'Urbana Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2850, -2.5550],
            [-44.2680, -2.5520],
            [-44.2630, -2.5700],
            [-44.2790, -2.5740],
            [-44.2850, -2.5550]
          ]
        ]
      }
    },
    // 34. Sacavém
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Sacavém',
        POPULACAO: 24800,
        id: 'sacavem',
        name: 'Sacavém',
        layer: 'Distrito Coroadinho',
        distrito: 'Distrito Coroadinho',
        zona: 'Urbana Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2880, -2.5460],
            [-44.2760, -2.5440],
            [-44.2720, -2.5580],
            [-44.2840, -2.5610],
            [-44.2880, -2.5460]
          ]
        ]
      }
    },
    // 35. Bom Jesus
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Bom Jesus',
        POPULACAO: 17800,
        id: 'bom-jesus',
        name: 'Bom Jesus',
        layer: 'Distrito Coroadinho',
        distrito: 'Distrito Coroadinho',
        zona: 'Urbana Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2790, -2.5680],
            [-44.2630, -2.5650],
            [-44.2580, -2.5800],
            [-44.2740, -2.5840],
            [-44.2790, -2.5680]
          ]
        ]
      }
    },
    // 36. Anjo da Guarda
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Anjo da Guarda',
        POPULACAO: 46500,
        id: 'anjo-da-guarda',
        name: 'Anjo da Guarda',
        layer: 'Distrito Itaqui-Bacanga',
        distrito: 'Distrito Itaqui-Bacanga',
        zona: 'Península Itaqui'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3290, -2.5630],
            [-44.3120, -2.5580],
            [-44.3080, -2.5750],
            [-44.3240, -2.5790],
            [-44.3290, -2.5630]
          ]
        ]
      }
    },
    // 37. Vila Embratel
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Vila Embratel',
        POPULACAO: 36200,
        id: 'vila-embratel',
        name: 'Vila Embratel',
        layer: 'Distrito Itaqui-Bacanga',
        distrito: 'Distrito Itaqui-Bacanga',
        zona: 'Península Itaqui'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3160, -2.5600],
            [-44.2980, -2.5560],
            [-44.2940, -2.5740],
            [-44.3110, -2.5780],
            [-44.3160, -2.5600]
          ]
        ]
      }
    },
    // 38. Sá Viana
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Sá Viana',
        POPULACAO: 18200,
        id: 'sa-viana',
        name: 'Sá Viana',
        layer: 'Distrito Itaqui-Bacanga',
        distrito: 'Distrito Itaqui-Bacanga',
        zona: 'Península Itaqui'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3060, -2.5480],
            [-44.2920, -2.5450],
            [-44.2880, -2.5600],
            [-44.3020, -2.5630],
            [-44.3060, -2.5480]
          ]
        ]
      }
    },
    // 39. Fumacê / Tamancão
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Fumacê / Tamancão',
        POPULACAO: 14600,
        id: 'fumace-tamancao',
        name: 'Fumacê / Tamancão',
        layer: 'Distrito Itaqui-Bacanga',
        distrito: 'Distrito Itaqui-Bacanga',
        zona: 'Península Itaqui'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3350, -2.5720],
            [-44.3180, -2.5680],
            [-44.3140, -2.5850],
            [-44.3310, -2.5890],
            [-44.3350, -2.5720]
          ]
        ]
      }
    },
    // 40. Porto do Itaqui
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Porto do Itaqui',
        POPULACAO: 6500,
        id: 'porto-do-itaqui',
        name: 'Porto do Itaqui',
        layer: 'Distrito Itaqui-Bacanga',
        distrito: 'Distrito Itaqui-Bacanga',
        zona: 'Portuária / Industrial'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3580, -2.5550],
            [-44.3320, -2.5500],
            [-44.3270, -2.5800],
            [-44.3520, -2.5850],
            [-44.3580, -2.5550]
          ]
        ]
      }
    },
    // 41. Vila Nova
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Vila Nova',
        POPULACAO: 16100,
        id: 'vila-nova',
        name: 'Vila Nova',
        layer: 'Distrito Itaqui-Bacanga',
        distrito: 'Distrito Itaqui-Bacanga',
        zona: 'Península Itaqui'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3240, -2.5800],
            [-44.3060, -2.5760],
            [-44.3020, -2.5960],
            [-44.3190, -2.6000],
            [-44.3240, -2.5800]
          ]
        ]
      }
    },
    // 42. Maracanã
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Maracanã',
        POPULACAO: 21500,
        id: 'maracana',
        name: 'Maracanã',
        layer: 'Distrito Zona Rural',
        distrito: 'Distrito Zona Rural',
        zona: 'Zona Rural Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2980, -2.5950],
            [-44.2620, -2.5880],
            [-44.2540, -2.6280],
            [-44.2880, -2.6340],
            [-44.2980, -2.5950]
          ]
        ]
      }
    },
    // 43. Vila Esperança
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Vila Esperança',
        POPULACAO: 13800,
        id: 'vila-esperanca',
        name: 'Vila Esperança',
        layer: 'Distrito Zona Rural',
        distrito: 'Distrito Zona Rural',
        zona: 'Zona Rural Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2620, -2.6100],
            [-44.2320, -2.6050],
            [-44.2250, -2.6380],
            [-44.2550, -2.6430],
            [-44.2620, -2.6100]
          ]
        ]
      }
    },
    // 44. Tibiri
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Tibiri',
        POPULACAO: 15900,
        id: 'tibiri',
        name: 'Tibiri',
        layer: 'Distrito Zona Rural',
        distrito: 'Distrito Zona Rural',
        zona: 'Zona Rural Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2320, -2.6020],
            [-44.2050, -2.5980],
            [-44.1980, -2.6280],
            [-44.2240, -2.6330],
            [-44.2320, -2.6020]
          ]
        ]
      }
    },
    // 45. Quebra Pote
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Quebra Pote',
        POPULACAO: 11200,
        id: 'quebra-pote',
        name: 'Quebra Pote',
        layer: 'Distrito Zona Rural',
        distrito: 'Distrito Zona Rural',
        zona: 'Zona Rural Extremo Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.2750, -2.6450],
            [-44.2250, -2.6380],
            [-44.2150, -2.6780],
            [-44.2650, -2.6840],
            [-44.2750, -2.6450]
          ]
        ]
      }
    },
    // 46. Distrito Industrial
    {
      type: 'Feature',
      properties: {
        NM_BAIRRO: 'Distrito Industrial',
        POPULACAO: 8400,
        id: 'distrito-industrial',
        name: 'Distrito Industrial',
        layer: 'Distrito Zona Rural',
        distrito: 'Distrito Zona Rural',
        zona: 'Zona Industrial Sul'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.3250, -2.6050],
            [-44.2950, -2.5980],
            [-44.2880, -2.6380],
            [-44.3180, -2.6440],
            [-44.3250, -2.6050]
          ]
        ]
      }
    }
  ]
};
