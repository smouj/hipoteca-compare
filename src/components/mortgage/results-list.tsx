'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScoredOffer, MortgageType, ComparisonFilter, MORTGAGE_TYPE_LABELS } from '@/types/mortgage';
import { formatCurrency, CURRENT_EURIBOR } from '@/lib/calculations';
import { OfferCard } from './offer-card';
import { 
  Filter, 
  Download, 
  Printer, 
  ArrowUpDown, 
  X,
  SlidersHorizontal,
  TrendingUp,
  Building2,
  Calculator
} from 'lucide-react';

interface ResultsListProps {
  scoredOffers: ScoredOffer[];
  onReset: () => void;
}

type SortOption = 'score' | 'monthlyPayment' | 'totalCost' | 'tae';

export function ResultsList({ scoredOffers, onReset }: ResultsListProps) {
  const [filters, setFilters] = useState<ComparisonFilter>({});
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting
  const filteredOffers = useMemo(() => {
    let result = [...scoredOffers];

    // Apply filters
    if (filters.mortgageTypes && filters.mortgageTypes.length > 0) {
      result = result.filter(o => filters.mortgageTypes!.includes(o.offer.mortgageType));
    }

    if (filters.maxMonthlyPayment) {
      result = result.filter(o => o.calculation.monthlyPayment <= filters.maxMonthlyPayment!);
    }

    if (filters.noOpeningCommission) {
      result = result.filter(o => {
        const opening = o.offer.commissions.find(c => c.type === 'APERTURA');
        return !opening || opening.percentage === 0;
      });
    }

    if (filters.noMandatoryLinkedProducts) {
      result = result.filter(o => 
        !o.offer.linkedProducts.some(p => p.required)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'monthlyPayment':
          return a.calculation.monthlyPayment - b.calculation.monthlyPayment;
        case 'totalCost':
          return a.calculation.totalCost - b.calculation.totalCost;
        case 'tae':
          return a.calculation.tae - b.calculation.tae;
        case 'score':
        default:
          return b.totalScore - a.totalScore;
      }
    });

    return result;
  }, [scoredOffers, filters, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    if (scoredOffers.length === 0) return null;
    
    const payments = scoredOffers.map(o => o.calculation.monthlyPayment);
    const costs = scoredOffers.map(o => o.calculation.totalCost);
    
    return {
      bestPayment: Math.min(...payments),
      worstPayment: Math.max(...payments),
      bestCost: Math.min(...costs),
      worstCost: Math.max(...costs),
      avgScore: Math.round(scoredOffers.reduce((sum, o) => sum + o.totalScore, 0) / scoredOffers.length),
    };
  }, [scoredOffers]);

  // Handle filter changes
  const handleMortgageTypeFilter = (type: MortgageType, checked: boolean) => {
    const current = filters.mortgageTypes || [];
    setFilters({
      ...filters,
      mortgageTypes: checked 
        ? [...current, type]
        : current.filter(t => t !== type),
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = 
    (filters.mortgageTypes && filters.mortgageTypes.length > 0) ||
    filters.maxMonthlyPayment !== undefined ||
    filters.noOpeningCommission ||
    filters.noMandatoryLinkedProducts;

  // Export functionality
  const handleExport = () => {
    const data = filteredOffers.map((o, idx) => ({
      rank: idx + 1,
      bank: o.offer.bankId,
      product: o.offer.productName,
      type: MORTGAGE_TYPE_LABELS[o.offer.mortgageType],
      monthlyPayment: o.calculation.monthlyPayment,
      tae: o.calculation.tae,
      totalCost: o.calculation.totalCost,
      score: o.totalScore,
    }));

    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hipoteca-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resultados de la comparativa</h2>
          <p className="text-slate-500">
            {filteredOffers.length} de {scoredOffers.length} hipotecas encontradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            Nueva búsqueda
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Calculator className="h-4 w-4" />
                <span className="text-sm">Mejor cuota</span>
              </div>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(stats.bestPayment)}/mes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Hipotecas analizadas</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{scoredOffers.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Euríbor actual</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{CURRENT_EURIBOR}%</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Puntuación media</span>
              </div>
              <p className="text-xl font-bold text-amber-700">{stats.avgScore}/100</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="space-y-4">
            {/* Sort */}
            <div>
              <Label className="text-sm font-medium">Ordenar por</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Puntuación (mejor primero)
                    </div>
                  </SelectItem>
                  <SelectItem value="monthlyPayment">Cuota mensual (menor primero)</SelectItem>
                  <SelectItem value="totalCost">Coste total (menor primero)</SelectItem>
                  <SelectItem value="tae">TAE (menor primero)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Mortgage Type */}
            <div>
              <Label className="text-sm font-medium">Tipo de hipoteca</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {Object.entries(MORTGAGE_TYPE_LABELS).map(([type, label]) => (
                  <Label key={type} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.mortgageTypes?.includes(type as MortgageType) ?? false}
                      onCheckedChange={(checked) => 
                        handleMortgageTypeFilter(type as MortgageType, checked as boolean)
                      }
                    />
                    <span className="text-sm">{label}</span>
                  </Label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Max Payment */}
            <div>
              <Label htmlFor="maxPayment" className="text-sm font-medium">
                Cuota máxima mensual
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="maxPayment"
                  type="number"
                  placeholder="Sin límite"
                  value={filters.maxMonthlyPayment || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    maxMonthlyPayment: e.target.value ? parseInt(e.target.value) : undefined,
                  })}
                  className="pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
              </div>
            </div>

            <Separator />

            {/* Additional Filters */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.noOpeningCommission ?? false}
                  onCheckedChange={(checked) => setFilters({
                    ...filters,
                    noOpeningCommission: checked as boolean,
                  })}
                />
                <span className="text-sm">Sin comisión de apertura</span>
              </Label>

              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.noMandatoryLinkedProducts ?? false}
                  onCheckedChange={(checked) => setFilters({
                    ...filters,
                    noMandatoryLinkedProducts: checked as boolean,
                  })}
                />
                <span className="text-sm">Sin productos vinculados obligatorios</span>
              </Label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.mortgageTypes?.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              {MORTGAGE_TYPE_LABELS[type]}
              <button onClick={() => handleMortgageTypeFilter(type, false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.maxMonthlyPayment && (
            <Badge variant="secondary" className="gap-1">
              Max {formatCurrency(filters.maxMonthlyPayment)}/mes
              <button onClick={() => setFilters({ ...filters, maxMonthlyPayment: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.noOpeningCommission && (
            <Badge variant="secondary" className="gap-1">
              Sin comisión apertura
              <button onClick={() => setFilters({ ...filters, noOpeningCommission: false })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.noMandatoryLinkedProducts && (
            <Badge variant="secondary" className="gap-1">
              Sin vinculaciones
              <button onClick={() => setFilters({ ...filters, noMandatoryLinkedProducts: false })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer, index) => (
            <OfferCard 
              key={offer.offer.id} 
              scoredOffer={offer} 
              rank={index + 1} 
            />
          ))
        ) : (
          <Card className="p-8 text-center">
            <div className="text-slate-400 mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600">No hay resultados</h3>
              <p className="text-sm text-slate-500">
                Ninguna hipoteca coincide con los filtros seleccionados
              </p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-4">
          <p className="text-xs text-slate-500 text-center">
            Los datos mostrados son informativos y pueden no reflejar las condiciones exactas de cada banco.
            Las condiciones finales pueden variar según el perfil del solicitante. 
            Consulta siempre con el banco antes de tomar una decisión.
            Euríbor de referencia: {CURRENT_EURIBOR}% (Marzo 2026)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
