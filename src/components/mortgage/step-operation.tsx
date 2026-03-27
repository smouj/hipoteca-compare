'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  OperationType, 
  PropertyType, 
  FormData, 
  OPERATION_TYPE_LABELS, 
  PROPERTY_TYPE_LABELS 
} from '@/types/mortgage';
import { formatCurrency } from '@/lib/calculations';
import { Home, Building2, RefreshCw, ArrowRightLeft, MapPin } from 'lucide-react';

interface StepOperationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const OPERATION_OPTIONS = [
  { 
    value: OperationType.PURCHASE, 
    label: 'Compra de vivienda',
    description: 'Adquirir una propiedad',
    icon: Home 
  },
  { 
    value: OperationType.REFINANCE, 
    label: 'Refinanciación',
    description: 'Mejorar condiciones de tu hipoteca actual',
    icon: RefreshCw 
  },
  { 
    value: OperationType.SUBROGATION, 
    label: 'Subrogación',
    description: 'Cambiar tu hipoteca a otro banco',
    icon: ArrowRightLeft 
  },
];

const PROPERTY_OPTIONS = [
  { 
    value: PropertyType.USUAL_RESIDENCE, 
    label: 'Vivienda habitual',
    description: 'Tu residencia principal' 
  },
  { 
    value: PropertyType.SECOND_RESIDENCE, 
    label: 'Segunda vivienda',
    description: 'Para uso vacacional o inversión' 
  },
  { 
    value: PropertyType.NEW_CONSTRUCTION, 
    label: 'Obra nueva',
    description: 'Vivienda de nueva construcción' 
  },
];

// Spanish provinces for location select
const SPANISH_PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
  'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas',
  'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense',
  'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia',
  'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid',
  'Vizcaya', 'Zamora', 'Zaragoza'
];

export function StepOperation({ formData, updateFormData, errors }: StepOperationProps) {
  const [priceInput, setPriceInput] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Sync priceInput with formData after mount to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    if (formData.propertyPrice > 0) {
      setPriceInput(formData.propertyPrice.toString());
    }
  }, []);

  // Update priceInput if formData changes externally
  useEffect(() => {
    if (isMounted && formData.propertyPrice > 0 && priceInput === '') {
      setPriceInput(formData.propertyPrice.toString());
    }
  }, [formData.propertyPrice, isMounted, priceInput]);

  const handlePriceChange = (value: string) => {
    // Remove non-numeric characters except dots and commas
    const numericValue = value.replace(/[^\d.,]/g, '');
    setPriceInput(numericValue);
    
    // Parse to number (handle Spanish format with dots as thousands separator)
    const cleanValue = numericValue.replace(/\./g, '').replace(',', '.');
    const numberValue = parseFloat(cleanValue) || 0;
    updateFormData({ propertyPrice: numberValue });
  };

  const displayPrice = priceInput || '';
  const isPurchase = formData.operationType === OperationType.PURCHASE;

  return (
    <div className="space-y-6">
      {/* Operation Type */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Tipo de operación</h3>
          <p className="text-sm text-slate-500">Selecciona el tipo de operación que deseas realizar</p>
        </div>
        <RadioGroup
          value={formData.operationType}
          onValueChange={(value) => updateFormData({ operationType: value as OperationType })}
          className="grid gap-4 md:grid-cols-3"
        >
          {OPERATION_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.operationType === option.value;
            return (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`relative flex flex-col items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover:border-slate-300 ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-500">{option.description}</div>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </Label>
            );
          })}
        </RadioGroup>
        {errors.operationType && (
          <p className="text-sm text-red-500">{errors.operationType}</p>
        )}
      </div>

      {/* Property Details */}
      {isPurchase && (
        <>
          {/* Property Price */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="price" className="text-base font-semibold text-slate-900">
                Precio de la propiedad
              </Label>
              <p className="text-sm text-slate-500">Indica el precio de compra o valor de tasación</p>
            </div>
            <div className="relative">
              <Input
                id="price"
                type="text"
                value={displayPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="250.000"
                className={`text-lg h-12 pr-16 ${errors.propertyPrice ? 'border-red-500' : ''}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
            </div>
            {formData.propertyPrice > 0 && isMounted && (
              <p className="text-sm text-slate-600">
                Valor: <span className="font-medium">{formatCurrency(formData.propertyPrice)}</span>
              </p>
            )}
            {errors.propertyPrice && (
              <p className="text-sm text-red-500">{errors.propertyPrice}</p>
            )}
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-slate-900">Tipo de vivienda</Label>
              <p className="text-sm text-slate-500">Selecciona el tipo de propiedad</p>
            </div>
            <RadioGroup
              value={formData.propertyType}
              onValueChange={(value) => updateFormData({ propertyType: value as PropertyType })}
              className="grid gap-3 md:grid-cols-3"
            >
              {PROPERTY_OPTIONS.map((option) => {
                const isSelected = formData.propertyType === option.value;
                return (
                  <Label
                    key={option.value}
                    htmlFor={`prop-${option.value}`}
                    className={`flex flex-col gap-1 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`prop-${option.value}`} className="sr-only" />
                    <div className="font-medium text-slate-900">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.description}</div>
                  </Label>
                );
              })}
            </RadioGroup>
            {errors.propertyType && (
              <p className="text-sm text-red-500">{errors.propertyType}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location" className="text-base font-semibold text-slate-900">
                Ubicación
              </Label>
              <p className="text-sm text-slate-500">Provincia donde se encuentra la propiedad</p>
            </div>
            <Select
              value={formData.propertyLocation}
              onValueChange={(value) => updateFormData({ propertyLocation: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona una provincia">
                  {formData.propertyLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{formData.propertyLocation}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SPANISH_PROVINCES.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* For refinance/subrogation, show different fields */}
      {!isPurchase && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-800 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {formData.operationType === OperationType.REFINANCE ? 'Refinanciación' : 'Subrogación'}
            </CardTitle>
            <CardDescription className="text-amber-700">
              {formData.operationType === OperationType.REFINANCE 
                ? 'Mejora las condiciones de tu hipoteca actual con el mismo banco o uno nuevo.'
                : 'Transfiere tu hipoteca a otro banco para obtener mejores condiciones.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800">
              Introduce el valor actual de tasación de tu vivienda en el siguiente paso.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
