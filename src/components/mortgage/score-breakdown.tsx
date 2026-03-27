'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScoreFactor } from '@/types/mortgage';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Scale, 
  Eye, 
  Building2, 
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

interface ScoreBreakdownProps {
  scoreFactors: ScoreFactor[];
  totalScore: number;
}

const FACTOR_ICONS: Record<string, typeof TrendingUp> = {
  economic_cost: TrendingUp,
  flexibility: Scale,
  transparency: Eye,
  bank_reliability: Building2,
  user_fit: User,
};

const FACTOR_COLORS: Record<string, string> = {
  economic_cost: 'text-emerald-600',
  flexibility: 'text-blue-600',
  transparency: 'text-purple-600',
  bank_reliability: 'text-amber-600',
  user_fit: 'text-rose-600',
};

const FACTOR_BG_COLORS: Record<string, string> = {
  economic_cost: 'bg-emerald-100',
  flexibility: 'bg-blue-100',
  transparency: 'bg-purple-100',
  bank_reliability: 'bg-amber-100',
  user_fit: 'bg-rose-100',
};

export function ScoreBreakdown({ scoreFactors, totalScore }: ScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Regular';
    return 'Mejorable';
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            Análisis detallado
          </CardTitle>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            {isExpanded ? 'Ocultar' : 'Ver detalles'}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Total Score */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
            <div>
              <p className="text-sm text-slate-500">Puntuación total</p>
              <p className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}/100
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`${getScoreColor(totalScore)} border-current`}
            >
              {getScoreLabel(totalScore)}
            </Badge>
          </div>

          {/* Individual Factors */}
          <div className="space-y-4">
            {scoreFactors.map((factor) => {
              const Icon = FACTOR_ICONS[factor.id] || TrendingUp;
              const colorClass = FACTOR_COLORS[factor.id] || 'text-slate-600';
              const bgClass = FACTOR_BG_COLORS[factor.id] || 'bg-slate-100';

              return (
                <div key={factor.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${bgClass}`}>
                        <Icon className={`h-4 w-4 ${colorClass}`} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900">
                          {factor.name}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          ({Math.round(factor.weight * 100)}% peso)
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(factor.score)}`}>
                      {factor.score}/100
                    </span>
                  </div>
                  
                  <Progress 
                    value={factor.score} 
                    className="h-2"
                  />
                  
                  <p className="text-xs text-slate-500">
                    {factor.explanation}
                  </p>
                  
                  {factor.details && factor.details.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {factor.details.map((detail, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-600"
                        >
                          {detail}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
