'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ScoredOffer, 
  MortgageType, 
  MORTGAGE_TYPE_LABELS,
  ConfidenceLevel 
} from '@/types/mortgage';
import { formatCurrency, formatPercentage, CURRENT_EURIBOR } from '@/lib/calculations';
import { BANKS } from '@/lib/adapters/banks';
import { ScoreBreakdown } from './score-breakdown';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Star, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Award,
  Info
} from 'lucide-react';

interface OfferCardProps {
  scoredOffer: ScoredOffer;
  rank: number;
}

export function OfferCard({ scoredOffer, rank }: OfferCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { offer, calculation, totalScore, pros, cons, recommendation, alerts, isBestOption, scoreFactors } = scoredOffer;

  const bank = BANKS.find(b => b.id === offer.bankId);
  
  // Get mortgage type badge color
  const getTypeColor = (type: MortgageType) => {
    switch (type) {
      case MortgageType.FIJA: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case MortgageType.VARIABLE: return 'bg-blue-100 text-blue-700 border-blue-200';
      case MortgageType.MIXTA: return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get confidence level badge
  const getConfidenceBadge = () => {
    switch (offer.confidence) {
      case ConfidenceLevel.VERIFIED:
        return <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Verificado</Badge>;
      case ConfidenceLevel.ESTIMATED:
        return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Estimado</Badge>;
      case ConfidenceLevel.OUTDATED:
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Desactualizado</Badge>;
      default:
        return <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">Pendiente</Badge>;
    }
  };

  // Get rate display
  const getRateDisplay = () => {
    if (offer.mortgageType === MortgageType.FIJA) {
      return (
        <div>
          <span className="text-sm text-slate-500">TIN Fijo</span>
          <p className="text-lg font-semibold text-slate-900">{formatPercentage(offer.rateCondition.tin)}</p>
        </div>
      );
    }
    if (offer.mortgageType === MortgageType.VARIABLE) {
      const spread = offer.rateCondition.spread ?? 0.75;
      return (
        <div>
          <span className="text-sm text-slate-500">Euríbor + {spread}%</span>
          <p className="text-lg font-semibold text-slate-900">{formatPercentage(CURRENT_EURIBOR + spread)}</p>
          <span className="text-xs text-slate-400">TIN actual</span>
        </div>
      );
    }
    if (offer.mortgageType === MortgageType.MIXTA) {
      const fixedYears = offer.rateCondition.fixedPeriodYears ?? 10;
      const fixedRate = offer.rateCondition.fixedPeriodTin ?? offer.rateCondition.tin;
      return (
        <div>
          <span className="text-sm text-slate-500">Fijo {fixedYears} años</span>
          <p className="text-lg font-semibold text-slate-900">{formatPercentage(fixedRate)}</p>
          <span className="text-xs text-slate-400">luego variable</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`relative overflow-hidden transition-all ${
      isBestOption 
        ? 'ring-2 ring-emerald-500 border-emerald-200' 
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Best Option Badge */}
      {isBestOption && (
        <div className="absolute top-0 right-0">
          <div className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <Award className="h-3 w-3" />
            Mejor opción
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
              rank === 1 ? 'bg-amber-100 text-amber-700' :
              rank === 2 ? 'bg-slate-100 text-slate-600' :
              rank === 3 ? 'bg-orange-100 text-orange-700' :
              'bg-slate-50 text-slate-500'
            }`}>
              {rank}
            </div>
            
            <div>
              <CardTitle className="text-lg text-slate-900">
                {bank?.name || 'Banco'}
              </CardTitle>
              <p className="text-sm text-slate-500">{offer.productName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getConfidenceBadge()}
            <Badge className={getTypeColor(offer.mortgageType)} variant="outline">
              {MORTGAGE_TYPE_LABELS[offer.mortgageType]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Monthly Payment */}
          <div className="p-3 rounded-lg bg-emerald-50">
            <span className="text-sm text-emerald-600">Cuota mensual</span>
            <p className="text-xl font-bold text-emerald-700">
              {formatCurrency(calculation.monthlyPayment)}
            </p>
          </div>

          {/* TAE */}
          <div className="p-3 rounded-lg bg-slate-50">
            <span className="text-sm text-slate-600">TAE</span>
            <p className="text-xl font-bold text-slate-900">
              {formatPercentage(calculation.tae)}
            </p>
          </div>

          {/* Total Cost */}
          <div className="p-3 rounded-lg bg-slate-50">
            <span className="text-sm text-slate-600">Coste total</span>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(calculation.totalCost)}
            </p>
          </div>

          {/* Score */}
          <div className="p-3 rounded-lg bg-slate-50">
            <span className="text-sm text-slate-600">Puntuación</span>
            <p className={`text-xl font-bold ${getScoreColor(totalScore)}`}>
              {totalScore}/100
            </p>
          </div>
        </div>

        {/* Rate Details */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg border border-slate-100 bg-white">
          {getRateDisplay()}
          
          <div>
            <span className="text-sm text-slate-500">Plazo máximo</span>
            <p className="text-lg font-semibold text-slate-900">{offer.maxTermYears} años</p>
          </div>
          
          <div>
            <span className="text-sm text-slate-500">LTV máximo</span>
            <p className="text-lg font-semibold text-slate-900">{offer.maxLtv}%</p>
          </div>
        </div>

        {/* Scenarios for Variable/Mixed */}
        {calculation.scenarios && calculation.scenarios.length > 1 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Escenarios de tipo</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {calculation.scenarios.map((scenario, idx) => (
                <div key={idx} className={`p-2 rounded ${
                  idx === 0 ? 'bg-white' :
                  idx === 1 ? 'bg-amber-100' : 'bg-orange-100'
                }`}>
                  <p className="text-xs text-slate-500">{scenario.name}</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(scenario.monthlyPayment)}/mes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Pros */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Ventajas</span>
            </div>
            <ul className="space-y-1">
              {pros.slice(0, 3).map((pro, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Consideraciones</span>
            </div>
            <ul className="space-y-1">
              {cons.slice(0, 3).map((con, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Alerts */}
        {alerts && alerts.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Avisos</span>
            </div>
            <ul className="space-y-1">
              {alerts.map((alert, idx) => (
                <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                  <Info className="h-3 w-3 mt-1 flex-shrink-0" />
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expand Button */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Ocultar detalles
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver análisis completo
            </>
          )}
        </Button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 pt-4">
            <Separator />
            
            {/* Score Breakdown */}
            <ScoreBreakdown scoreFactors={scoreFactors} totalScore={totalScore} />
            
            {/* Recommendation */}
            {recommendation && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Recomendación</span>
                </div>
                <p className="text-sm text-slate-600">{recommendation}</p>
              </div>
            )}

            {/* Commissions */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Comisiones</h4>
              <div className="grid grid-cols-2 gap-2">
                {offer.commissions.map((commission, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-50 text-sm">
                    <span className="text-slate-500">{commission.type.replace(/_/g, ' ')}</span>
                    <p className="font-medium">
                      {commission.percentage ? `${commission.percentage}%` : 
                       commission.fixedAmount ? formatCurrency(commission.fixedAmount) : 'Gratis'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Products */}
            {offer.linkedProducts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Productos vinculados</h4>
                <div className="flex flex-wrap gap-2">
                  {offer.linkedProducts.map((product, idx) => (
                    <Badge 
                      key={idx} 
                      variant={product.required ? "default" : "outline"}
                      className={product.required ? "bg-slate-100 text-slate-700" : "text-slate-500"}
                    >
                      {product.type.replace(/_/g, ' ')}
                      {product.required && ' (obligatorio)'}
                      {product.bonusTin > 0 && ` -${product.bonusTin}%`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* External Link */}
            {offer.productUrl && (
              <a
                href={offer.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <ExternalLink className="h-4 w-4" />
                Ver condiciones oficiales en {bank?.name}
              </a>
            )}

            {/* Data Source */}
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Fuente: {offer.source} • Actualizado: {new Date(offer.updatedAt).toLocaleDateString('es-ES')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
