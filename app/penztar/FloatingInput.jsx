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
          className="bg-white rounded border border-gray-300 p-2 pt-5 w-full peer placeholder-transparent text-gray-900 focus:border-black focus:outline-none transition-colors text-sm"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          min={min}
        />
        <label
          className="absolute left-2 top-3.5 text-gray-400 text-sm transition-all duration-200 pointer-events-none
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-500
          peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="text-red-600 text-xs font-medium pl-1">{error}</p>
      )}
    </div>
  );
}
