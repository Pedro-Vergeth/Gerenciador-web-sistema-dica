import { GRUPO_ALIMENTAR_OPTIONS, type GrupoAlimentarOption } from '../types/foods.ts';

type FoodGroupSelectProps = {
  value: GrupoAlimentarOption | '';
  onChange: (value: GrupoAlimentarOption | '') => void;
  disabled?: boolean;
  label?: string;
};

export default function FoodGroupSelect({ value, onChange, disabled = false, label = 'Grupo alimentar' }: FoodGroupSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as GrupoAlimentarOption | '')}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500"
      >
        <option value="">Selecione o grupo alimentar</option>
        {GRUPO_ALIMENTAR_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}