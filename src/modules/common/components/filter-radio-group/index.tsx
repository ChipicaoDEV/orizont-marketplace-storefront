import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange} className="flex flex-col gap-y-2">
        {items?.map((i) => (
          <div
            key={i.value}
            className="group flex items-center"
          >
            <RadioGroup.Item
              checked={i.value === value}
              className="hidden"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "relative flex items-center gap-x-3 py-2 px-4 rounded-xl cursor-pointer transition-all duration-200 border border-transparent w-full",
                {
                  "bg-black text-white shadow-xl shadow-black/10": i.value === value,
                  "text-gray-500 hover:text-gray-900 hover:bg-gray-50": i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              <div className={clx(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                {
                  "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]": i.value === value,
                  "bg-gray-300 group-hover:bg-gray-400": i.value !== value,
                }
              )} />
              <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                {i.label}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
