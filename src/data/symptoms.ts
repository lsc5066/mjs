export const symptoms = [
  {
    category: '통증',
    items: [
      { id: 'headache', name: '두통', requiresUrgentCare: false },
      { id: 'stomachache', name: '복통', requiresUrgentCare: false },
      { id: 'sore-throat', name: '인후통', requiresUrgentCare: false },
    ]
  },
  {
    category: '상처/외상',
    items: [
      { id: 'cut', name: '베임', requiresUrgentCare: false },
      { id: 'scrape', name: '찰과상', requiresUrgentCare: false },
      { id: 'sprain', name: '삐임', requiresUrgentCare: false },
    ]
  },
  {
    category: '응급상황',
    items: [
      { id: 'fever-high', name: '고열(38.5도 이상)', requiresUrgentCare: true },
      { id: 'bleeding', name: '심한 출혈', requiresUrgentCare: true },
      { id: 'breathing', name: '호흡 곤란', requiresUrgentCare: true },
    ]
  }
]; 