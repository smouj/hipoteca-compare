'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FormData, 
  Borrower, 
  EmploymentType, 
  MaritalStatus,
  EmploymentSector,
  EMPLOYMENT_TYPE_LABELS,
  MARITAL_STATUS_LABELS,
  EMPLOYMENT_SECTOR_LABELS,
  createDefaultBorrower,
} from '@/types/mortgage';
import { formatCurrency } from '@/lib/calculations';
import { 
  User, Users, Briefcase, EuroIcon, Calendar, CreditCard, Wallet, 
  PlusCircle, Trash2, ChevronDown, ChevronUp, FileText, Phone, Mail,
  Building, Heart, Baby
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface StepBorrowerProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const EMPLOYMENT_OPTIONS = [
  { 
    value: EmploymentType.INDEFINITE_CONTRACT, 
    label: 'Contrato indefinido',
    description: 'Trabajo estable con contrato fijo',
    icon: '📋'
  },
  { 
    value: EmploymentType.CIVIL_SERVANT, 
    label: 'Funcionario',
    description: 'Empleado público en propiedad',
    icon: '🏛️'
  },
  { 
    value: EmploymentType.SELF_EMPLOYED, 
    label: 'Autónomo',
    description: 'Trabajo por cuenta propia',
    icon: '💼'
  },
  { 
    value: EmploymentType.TEMPORARY_CONTRACT, 
    label: 'Contrato temporal',
    description: 'Trabajo con contrato de duración determinada',
    icon: '📄'
  },
  { 
    value: EmploymentType.RETIRED, 
    label: 'Jubilado/Pensionista',
    description: 'Ingresos por pensión',
    icon: '👴'
  },
];

const MARITAL_STATUS_OPTIONS = [
  { value: MaritalStatus.SINGLE, label: 'Soltero/a', icon: '👤' },
  { value: MaritalStatus.MARRIED, label: 'Casado/a', icon: '💍' },
  { value: MaritalStatus.CIVIL_UNION, label: 'Pareja de hecho', icon: '💑' },
  { value: MaritalStatus.DIVORCED, label: 'Divorciado/a', icon: '💔' },
  { value: MaritalStatus.WIDOWED, label: 'Viudo/a', icon: '🖤' },
];

const EXTRA_PAYMENT_OPTIONS = [
  { value: 0, label: 'Sin pagas extra' },
  { value: 1, label: '1 paga extra' },
  { value: 2, label: '2 pagas extra' },
  { value: 3, label: '3 pagas extra' },
  { value: 4, label: '4 pagas extra' },
];

const ACTIVITY_SECTORS = [
  'Tecnología',
  'Sanidad',
  'Educación',
  'Finanzas',
  'Comercio',
  'Hostelería',
  'Construcción',
  'Industria',
  'Servicios',
  'Administración Pública',
  'Agricultura',
  'Transporte',
  'Otros',
];

export function StepBorrower({ formData, updateFormData, errors }: StepBorrowerProps) {
  const [expandedBorrowers, setExpandedBorrowers] = useState<string[]>([]);
  
  // Ensure borrowers array exists and is properly initialized
  const borrowers = formData.borrowers || [createDefaultBorrower(1)];
  
  // Calculate totals
  const totalMonthlyIncome = borrowers.reduce((sum, b) => 
    sum + b.monthlyNetIncome + b.additionalMonthlyIncome, 0
  );
  const totalAnnualIncome = borrowers.reduce((sum, b) => sum + b.annualIncome, 0);
  const totalDebtPayments = borrowers.reduce((sum, b) => sum + b.monthlyDebtPayments, 0);
  const totalSavings = borrowers.reduce((sum, b) => sum + b.availableSavings, 0);

  const toggleBorrowerExpand = (borrowerId: string) => {
    setExpandedBorrowers(prev => 
      prev.includes(borrowerId) 
        ? prev.filter(id => id !== borrowerId)
        : [...prev, borrowerId]
    );
  };

  const addBorrower = () => {
    const newOrder = borrowers.length + 1;
    const newBorrower = createDefaultBorrower(newOrder);
    newBorrower.id = uuidv4();
    updateFormData({ 
      borrowers: [...borrowers, newBorrower],
      numberOfBorrowers: newOrder 
    });
    setExpandedBorrowers(prev => [...prev, newBorrower.id]);
  };

  const removeBorrower = (borrowerId: string) => {
    if (borrowers.length <= 1) return;
    const updatedBorrowers = borrowers
      .filter(b => b.id !== borrowerId)
      .map((b, index) => ({ ...b, order: index + 1, isPrincipal: index === 0 }));
    updateFormData({ 
      borrowers: updatedBorrowers,
      numberOfBorrowers: updatedBorrowers.length 
    });
  };

  const updateBorrower = (borrowerId: string, updates: Partial<Borrower>) => {
    const updatedBorrowers = borrowers.map(b => {
      if (b.id !== borrowerId) return b;
      
      const updated = { ...b, ...updates };
      
      // Recalculate derived fields
      if (updates.monthlyNetIncome !== undefined || updates.extraPaymentsPerYear !== undefined) {
        updated.annualIncome = (updated.monthlyNetIncome + updated.additionalMonthlyIncome) * 
          (12 + updated.extraPaymentsPerYear);
      }
      
      // Calculate age from date of birth
      if (updates.dateOfBirth !== undefined && updates.dateOfBirth) {
        const birthDate = new Date(updates.dateOfBirth);
        const today = new Date();
        updated.age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      }
      
      return updated;
    });
    
    updateFormData({ borrowers: updatedBorrowers });
    
    // Also update legacy fields for backwards compatibility
    const principalBorrower = updatedBorrowers.find(b => b.isPrincipal);
    if (principalBorrower) {
      updateFormData({
        employmentType: principalBorrower.employmentType,
        employmentMonths: principalBorrower.employmentMonths,
        monthlyIncome: principalBorrower.monthlyNetIncome,
        additionalIncome: principalBorrower.additionalMonthlyIncome,
        extraPaymentsPerYear: principalBorrower.extraPaymentsPerYear,
        monthlyDebtPayments: principalBorrower.monthlyDebtPayments,
        availableSavings: principalBorrower.availableSavings,
        age: principalBorrower.age,
        coBorrowerIncome: updatedBorrowers.length > 1 ? 
          updatedBorrowers.filter(b => !b.isPrincipal).reduce((sum, b) => sum + b.monthlyNetIncome, 0) : 0,
        coBorrowerAge: updatedBorrowers.length > 1 ? 
          updatedBorrowers.find(b => !b.isPrincipal)?.age || 0 : 0,
        coBorrowerEmploymentType: updatedBorrowers.length > 1 ? 
          updatedBorrowers.find(b => !b.isPrincipal)?.employmentType || EmploymentType.INDEFINITE_CONTRACT : EmploymentType.INDEFINITE_CONTRACT,
      });
    }
  };

  const handleIncomeChange = (borrowerId: string, field: string, value: string) => {
    const numericValue = value.replace(/[^\d.,]/g, '');
    const cleanValue = numericValue.replace(/\./g, '').replace(',', '.');
    const numberValue = parseFloat(cleanValue) || 0;
    updateBorrower(borrowerId, { [field]: numberValue });
  };

  const renderBorrowerCard = (borrower: Borrower, index: number) => {
    const isExpanded = expandedBorrowers.includes(borrower.id) || index === 0;
    const isPrincipal = borrower.isPrincipal;
    
    return (
      <Card key={borrower.id} className={`border-slate-200 ${isPrincipal ? 'ring-2 ring-emerald-100' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isPrincipal ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {isPrincipal ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                  {isPrincipal ? 'Titular principal' : `Cotitular ${index}`}
                  {borrower.fullName && <span className="text-sm font-normal text-slate-500">- {borrower.fullName}</span>}
                </CardTitle>
                <CardDescription>
                  {borrower.monthlyNetIncome > 0 ? formatCurrency(borrower.monthlyNetIncome) + '/mes' : 'Completar datos'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isPrincipal && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBorrower(borrower.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBorrowerExpand(borrower.id)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-6">
            {/* ===== PERSONAL DATA ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText className="h-4 w-4" />
                Datos personales
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor={`fullName-${borrower.id}`}>Nombre completo</Label>
                  <Input
                    id={`fullName-${borrower.id}`}
                    type="text"
                    value={borrower.fullName}
                    onChange={(e) => updateBorrower(borrower.id, { fullName: e.target.value })}
                    placeholder="Nombre y apellidos"
                    className="h-11"
                  />
                </div>
                
                {/* Document ID */}
                <div className="space-y-2">
                  <Label htmlFor={`documentId-${borrower.id}`}>DNI/NIE</Label>
                  <Input
                    id={`documentId-${borrower.id}`}
                    type="text"
                    value={borrower.documentId}
                    onChange={(e) => updateBorrower(borrower.id, { documentId: e.target.value.toUpperCase() })}
                    placeholder="12345678A"
                    className="h-11"
                  />
                </div>
                
                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor={`dateOfBirth-${borrower.id}`}>Fecha de nacimiento</Label>
                  <Input
                    id={`dateOfBirth-${borrower.id}`}
                    type="date"
                    value={borrower.dateOfBirth}
                    onChange={(e) => updateBorrower(borrower.id, { dateOfBirth: e.target.value })}
                    className="h-11"
                  />
                </div>
                
                {/* Age (calculated) */}
                <div className="space-y-2">
                  <Label>Edad</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={borrower.age || ''}
                      onChange={(e) => updateBorrower(borrower.id, { age: parseInt(e.target.value) || 0 })}
                      placeholder="35"
                      className="h-11 pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">años</span>
                  </div>
                </div>
                
                {/* Marital Status */}
                <div className="space-y-2">
                  <Label>Estado civil</Label>
                  <Select
                    value={borrower.maritalStatus}
                    onValueChange={(value) => updateBorrower(borrower.id, { maritalStatus: value as MaritalStatus })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Matrimonial Regime */}
                {borrower.maritalStatus === MaritalStatus.MARRIED && (
                  <div className="space-y-2">
                    <Label>Régimen económico</Label>
                    <Select
                      value={borrower.matrimonialRegime || ''}
                      onValueChange={(value) => updateBorrower(borrower.id, { matrimonialRegime: value as any })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GANANCIALES">Gananciales</SelectItem>
                        <SelectItem value="SEPARACION_BIENES">Separación de bienes</SelectItem>
                        <SelectItem value="PARTICIPACION">Participación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Dependents */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Baby className="h-4 w-4" />
                    Personas a cargo
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={borrower.dependents || 0}
                    onChange={(e) => updateBorrower(borrower.id, { dependents: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="h-11"
                  />
                </div>
                
                {/* Phone & Email */}
                <div className="space-y-2">
                  <Label htmlFor={`phone-${borrower.id}`} className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  <Input
                    id={`phone-${borrower.id}`}
                    type="tel"
                    value={borrower.phone || ''}
                    onChange={(e) => updateBorrower(borrower.id, { phone: e.target.value })}
                    placeholder="600123456"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`email-${borrower.id}`} className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id={`email-${borrower.id}`}
                    type="email"
                    value={borrower.email || ''}
                    onChange={(e) => updateBorrower(borrower.id, { email: e.target.value })}
                    placeholder="email@ejemplo.com"
                    className="h-11"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* ===== EMPLOYMENT DATA ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Briefcase className="h-4 w-4" />
                Situación laboral
              </div>
              
              <RadioGroup
                value={borrower.employmentType}
                onValueChange={(value) => updateBorrower(borrower.id, { employmentType: value as EmploymentType })}
                className="grid gap-2 md:grid-cols-3"
              >
                {EMPLOYMENT_OPTIONS.map((option) => {
                  const isSelected = borrower.employmentType === option.value;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`emp-${borrower.id}-${option.value}`}
                      className={`flex items-center gap-2 rounded-lg border-2 p-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/50' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={`emp-${borrower.id}-${option.value}`} className="sr-only" />
                      <span className="text-lg">{option.icon}</span>
                      <div className="text-xs">
                        <div className="font-medium text-slate-900">{option.label}</div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employment Sector */}
                <div className="space-y-2">
                  <Label>Sector de actividad</Label>
                  <Select
                    value={borrower.activitySector || ''}
                    onValueChange={(value) => updateBorrower(borrower.id, { activitySector: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Company Name */}
                {(borrower.employmentType === EmploymentType.INDEFINITE_CONTRACT || 
                  borrower.employmentType === EmploymentType.TEMPORARY_CONTRACT) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Nombre de la empresa
                    </Label>
                    <Input
                      type="text"
                      value={borrower.companyName || ''}
                      onChange={(e) => updateBorrower(borrower.id, { companyName: e.target.value })}
                      placeholder="Empresa S.L."
                      className="h-11"
                    />
                  </div>
                )}
                
                {/* Employment Months */}
                {(borrower.employmentType === EmploymentType.INDEFINITE_CONTRACT || 
                  borrower.employmentType === EmploymentType.TEMPORARY_CONTRACT) && (
                  <div className="space-y-2">
                    <Label>Antigüedad en el empleo</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={600}
                        value={borrower.employmentMonths || ''}
                        onChange={(e) => updateBorrower(borrower.id, { employmentMonths: parseInt(e.target.value) || 0 })}
                        placeholder="24"
                        className="h-11 pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">meses</span>
                    </div>
                  </div>
                )}
                
                {/* Job Title */}
                <div className="space-y-2">
                  <Label>Cargo/Profesión</Label>
                  <Input
                    type="text"
                    value={borrower.jobTitle || ''}
                    onChange={(e) => updateBorrower(borrower.id, { jobTitle: e.target.value })}
                    placeholder="Ingeniero, Administrativo..."
                    className="h-11"
                  />
                </div>
                
                {/* Civil Servant Specific */}
                {borrower.employmentType === EmploymentType.CIVIL_SERVANT && (
                  <>
                    <div className="space-y-2">
                      <Label>Cuerpo/Escala</Label>
                      <Input
                        type="text"
                        value={borrower.civilServantBody || ''}
                        onChange={(e) => updateBorrower(borrower.id, { civilServantBody: e.target.value })}
                        placeholder="Cuerpo de Maestros, EPO, etc."
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nivel administrativo</Label>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={borrower.civilServantLevel || ''}
                        onChange={(e) => updateBorrower(borrower.id, { civilServantLevel: parseInt(e.target.value) || undefined })}
                        placeholder="18"
                        className="h-11"
                      />
                    </div>
                  </>
                )}
                
                {/* Self-Employed Specific */}
                {borrower.employmentType === EmploymentType.SELF_EMPLOYED && (
                  <>
                    <div className="space-y-2">
                      <Label>Años de actividad</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          max={50}
                          value={borrower.selfEmployedYears || ''}
                          onChange={(e) => updateBorrower(borrower.id, { selfEmployedYears: parseInt(e.target.value) || undefined })}
                          placeholder="5"
                          className="h-11 pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">años</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Beneficio neto último año</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={borrower.selfEmployedNetProfit || ''}
                          onChange={(e) => handleIncomeChange(borrower.id, 'selfEmployedNetProfit', e.target.value)}
                          placeholder="35000"
                          className="h-11 pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">€/año</span>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Retired Specific */}
                {borrower.employmentType === EmploymentType.RETIRED && (
                  <div className="space-y-2">
                    <Label>Tipo de pensión</Label>
                    <Select
                      value={borrower.pensionType || ''}
                      onValueChange={(value) => updateBorrower(borrower.id, { pensionType: value as any })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JUBILACION">Jubilación</SelectItem>
                        <SelectItem value="VIUDEDAD">Viudedad</SelectItem>
                        <SelectItem value="INCAPACIDAD">Incapacidad</SelectItem>
                        <SelectItem value="ORFANDAD">Orfandad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* ===== INCOME DATA ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <EuroIcon className="h-4 w-4 text-emerald-600" />
                Ingresos
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Net Income */}
                <div className="space-y-2">
                  <Label>Ingresos netos mensuales</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={borrower.monthlyNetIncome > 0 ? borrower.monthlyNetIncome.toString() : ''}
                      onChange={(e) => handleIncomeChange(borrower.id, 'monthlyNetIncome', e.target.value)}
                      placeholder="2.500"
                      className="h-11 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
                  </div>
                </div>
                
                {/* Extra Payments */}
                <div className="space-y-2">
                  <Label>Pagas extraordinarias</Label>
                  <Select
                    value={borrower.extraPaymentsPerYear.toString()}
                    onValueChange={(value) => updateBorrower(borrower.id, { extraPaymentsPerYear: parseInt(value) })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXTRA_PAYMENT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Additional Income */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Ingresos adicionales
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={borrower.additionalMonthlyIncome > 0 ? borrower.additionalMonthlyIncome.toString() : ''}
                      onChange={(e) => handleIncomeChange(borrower.id, 'additionalMonthlyIncome', e.target.value)}
                      placeholder="0"
                      className="h-11 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
                  </div>
                </div>
                
                {/* Additional Income Source */}
                <div className="space-y-2">
                  <Label>Origen ingresos adicionales</Label>
                  <Input
                    type="text"
                    value={borrower.additionalIncomeSource || ''}
                    onChange={(e) => updateBorrower(borrower.id, { additionalIncomeSource: e.target.value })}
                    placeholder="Alquiler, rentas..."
                    className="h-11"
                  />
                </div>
                
                {/* Annual Income Display */}
                <div className="md:col-span-2">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-emerald-600">Ingresos anuales estimados</p>
                    <p className="text-xl font-bold text-emerald-700">{formatCurrency(borrower.annualIncome)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* ===== DEBTS & SAVINGS ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Wallet className="h-4 w-4" />
                Deudas y ahorros
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Debt Payments */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-amber-600" />
                    Cuotas de deudas mensuales
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={borrower.monthlyDebtPayments > 0 ? borrower.monthlyDebtPayments.toString() : ''}
                      onChange={(e) => handleIncomeChange(borrower.id, 'monthlyDebtPayments', e.target.value)}
                      placeholder="0"
                      className="h-11 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
                  </div>
                  <p className="text-xs text-slate-500">Préstamos personales, tarjetas, coche...</p>
                </div>
                
                {/* Available Savings */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    Ahorros disponibles
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={borrower.availableSavings > 0 ? borrower.availableSavings.toString() : ''}
                      onChange={(e) => handleIncomeChange(borrower.id, 'availableSavings', e.target.value)}
                      placeholder="60.000"
                      className="h-11 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                  </div>
                  <p className="text-xs text-slate-500">Para entrada, gastos e imprevistos</p>
                </div>
                
                {/* Other Assets */}
                <div className="space-y-2">
                  <Label>Otros patrimonios</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={borrower.otherAssets || ''}
                      onChange={(e) => handleIncomeChange(borrower.id, 'otherAssets', e.target.value)}
                      placeholder="0"
                      className="h-11 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Descripción patrimonio</Label>
                  <Input
                    type="text"
                    value={borrower.otherAssetsDescription || ''}
                    onChange={(e) => updateBorrower(borrower.id, { otherAssetsDescription: e.target.value })}
                    placeholder="Otra vivienda, inversiones..."
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Perfil de los solicitantes</h3>
        <p className="text-sm text-slate-500">Información completa de todos los titulares de la hipoteca</p>
      </div>

      {/* Borrowers List */}
      <div className="space-y-4">
        {borrowers.map((borrower, index) => renderBorrowerCard(borrower, index))}
      </div>

      {/* Add Borrower Button */}
      <Button
        variant="outline"
        onClick={addBorrower}
        className="w-full border-dashed border-2 h-12 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Añadir cotitular
      </Button>

      {/* Income Summary */}
      {totalMonthlyIncome > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-emerald-800 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resumen global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-emerald-600 text-xs">Ingresos mensuales totales</p>
                <p className="text-lg font-bold text-emerald-900">{formatCurrency(totalMonthlyIncome)}</p>
              </div>
              <div>
                <p className="text-emerald-600 text-xs">Ingresos anuales totales</p>
                <p className="text-lg font-bold text-emerald-900">{formatCurrency(totalAnnualIncome)}</p>
              </div>
              <div>
                <p className="text-emerald-600 text-xs">Cuotas de deudas</p>
                <p className="text-lg font-bold text-emerald-900">{formatCurrency(totalDebtPayments)}/mes</p>
              </div>
              <div>
                <p className="text-emerald-600 text-xs">Ahorros totales</p>
                <p className="text-lg font-bold text-emerald-900">{formatCurrency(totalSavings)}</p>
              </div>
            </div>
            
            {totalDebtPayments > 0 && (
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-700">Ratio de endeudamiento actual:</span>
                  <Badge variant={totalDebtPayments / totalMonthlyIncome > 0.35 ? 'destructive' : 'secondary'}>
                    {((totalDebtPayments / totalMonthlyIncome) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xs text-emerald-600 mt-1">
                  Los bancos suelen recomendar no superar el 35% de ratio de endeudamiento
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
