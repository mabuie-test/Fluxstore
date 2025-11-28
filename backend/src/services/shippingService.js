class ShippingService {
  constructor() {
    this.etaMap = {
      local: 2,
      regional: 5,
      international: 12
    };
  }

  estimateEta(region) {
    return this.etaMap[region] || this.etaMap.regional;
  }

  estimateShippingCost(products, region) {
    const templateCost = products.reduce((acc, product) => {
      const template = product.shippingTemplates?.find((t) => t.region === region);
      if (template?.cost) return acc + template.cost;
      return acc + (product.dimensions?.weightKg || 1) * 50; // fallback weight-based cost
    }, 0);
    return templateCost || 100; // baseline service fee
  }

  resolveTemplateEta(products, region) {
    const explicitEta = products.map((p) => p.shippingTemplates?.find((t) => t.region === region)?.etaDays).filter(Boolean);
    if (explicitEta.length) return Math.max(...explicitEta);
    return this.estimateEta(region);
  }
}

export const shippingService = new ShippingService();
