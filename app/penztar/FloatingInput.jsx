"use client";
export default function FloatingInput({
  name,
  type = "text",
  label,
  value,
  onChange,
  error,
  min,
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          className="bg-neutral-800 rounded-lg border border-teal-900 p-2 pt-5 w-full peer placeholder-transparent text-teal-50"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          min={min}
        />
        <label
          className="absolute left-2 top-3.5 text-teal-500 text-sm transition-all duration-200
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
        peer-focus:top-1 peer-focus:text-xs
        peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
