'use client';

import { AlertCircle, Lightbulb, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorAlertProps {
  error: string;
}

/**
 * Component to display detailed error messages with formatted output
 * Supports markdown-like formatting in error messages
 */
export function ErrorAlert({ error }: ErrorAlertProps) {
  // Parse the error message to extract structured content
  const lines = error.split('\n');
  const title = lines[0] || error;
  const hasDetails = lines.length > 1;

  // Extract sections
  let principalMotivo = '';
  let sugerencias: string[] = [];
  let analisis = '';

  for (const line of lines) {
    if (line.startsWith('**Principal motivo:**')) {
      principalMotivo = line.replace('**Principal motivo:**', '').trim();
    } else if (line.match(/^\d+\./)) {
      sugerencias.push(line.trim());
    } else if (line.startsWith('*Análisis:')) {
      analisis = line.replace('*Análisis:', '').replace(/\*$/, '').trim();
    }
  }

  return (
    <div className="space-y-4">
      {/* Main error alert */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <p className="font-medium text-base mb-1">{title}</p>
        </AlertDescription>
      </Alert>

      {/* Structured details */}
      {hasDetails && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Primary reason */}
          {principalMotivo && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Motivo principal</span>
              </div>
              <p className="text-sm text-red-700">{principalMotivo}</p>
            </div>
          )}

          {/* Suggestions */}
          {sugerencias.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-800">Sugerencias</span>
              </div>
              <ul className="text-sm text-emerald-700 space-y-1">
                {sugerencias.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-medium">{i + 1}.</span>
                    <span>{s.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Analysis detail */}
      {analisis && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 italic">{analisis}</span>
          </div>
        </div>
      )}
    </div>
  );
}
