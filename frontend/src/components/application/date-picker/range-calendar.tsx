import { useEffect, useState } from "react";
import type { DateValue, RangeValue } from "react-aria-components";
import {
  Button as AriaButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar as AriaRangeCalendar,
  Button,
} from "react-aria-components";
import { cx } from "@/utils/cx";

function useVisibleMonths() {
  const [months, setMonths] = useState(2);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMonths(mq.matches ? 1 : 2);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return months;
}

type Preset = { label: string; value: RangeValue<DateValue> };

type RangeCalendarProps = {
  focusedValue: DateValue | null;
  onFocusChange: (value: DateValue) => void;
  highlightedDates?: DateValue[];
  presets?: Record<string, Preset>;
};

const navButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

export const RangeCalendar = ({ focusedValue, onFocusChange }: RangeCalendarProps) => {
  const visibleMonths = useVisibleMonths();

  return (
    <AriaRangeCalendar
      focusedValue={focusedValue ?? undefined}
      onFocusChange={onFocusChange}
      visibleDuration={{ months: visibleMonths }}
      className="p-4 text-white"
    >
      <header
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 16 }}
      >
        <AriaButton slot="previous" className={navButton}>‹</AriaButton>
        <Heading
          style={{ flex: 1, textAlign: "center", whiteSpace: "nowrap" }}
          className="text-base font-semibold text-white"
        />
        <AriaButton slot="next" className={navButton}>›</AriaButton>
      </header>

      <div style={{ display: "flex", gap: 24 }}>
        {Array.from({ length: visibleMonths }, (_, index) => (
          <CalendarGrid key={index} offset={{ months: index }} className="border-separate border-spacing-1">
            <CalendarGridHeader>
              {(day) => (
                <CalendarHeaderCell className="pb-2 text-center text-xs font-medium text-white/50">
                  {day}
                </CalendarHeaderCell>
              )}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => (
                <CalendarCell
                  date={date}
                  className={cx(
                    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm text-white outline-none transition",
                    "data-[hovered]:bg-white/10",
                    "data-[selected]:rounded-none data-[selected]:bg-white/15",
                    "data-[selection-start]:rounded-full data-[selection-start]:bg-white data-[selection-start]:font-semibold data-[selection-start]:text-slate-900",
                    "data-[selection-end]:rounded-full data-[selection-end]:bg-white data-[selection-end]:font-semibold data-[selection-end]:text-slate-900",
                    "data-[outside-month]:invisible",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:text-white/20",
                    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-white/60",
                    "data-[today]:underline data-[today]:underline-offset-4",
                  )}
                />
              )}
            </CalendarGridBody>
          </CalendarGrid>
        ))}
      </div>
    </AriaRangeCalendar>
  );
};

type RangePresetButtonProps = {
  value: RangeValue<DateValue>;
  onClick: () => void;
  children: React.ReactNode;
};

export const RangePresetButton = ({ onClick, children }: RangePresetButtonProps) => (
  <Button
    onPress={onClick}
    className="rounded-lg px-3 py-1.5 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
  >
    {children}
  </Button>
);