import { useMemo, useState } from "react";
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { Calendar as CalendarIcon } from "@untitledui/icons";
import { useDateFormatter } from "react-aria";
import type { DateRangePickerProps as AriaDateRangePickerProps, DateValue } from "react-aria-components";
import {
    Button as AriaButton,
    DateRangePicker as AriaDateRangePicker,
    Dialog as AriaDialog,
    Group as AriaGroup,
    Popover as AriaPopover,
    useLocale,
} from "react-aria-components";
import { InputDateBase } from "@/components/base/input/input-date";
import { cx } from "@/utils/cx";
import { RangeCalendar, RangePresetButton } from "./range-calendar";

const now = today(getLocalTimeZone());

const highlightedDates = [today(getLocalTimeZone())];

interface DateRangePickerProps extends AriaDateRangePickerProps<DateValue> {
    /** Called when the Apply button is clicked. */
    onApply?: () => void;
    /** Called when the Cancel button is clicked. */
    onCancel?: () => void;
}

export const DateRangePicker = ({
    value: valueProp,
    defaultValue,
    onChange,
    onApply,
    onCancel,
    ...props
}: DateRangePickerProps) => {
    const { locale } = useLocale();
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);
    const [focusedValue, setFocusedValue] = useState<DateValue | null>(null);

    const formattedStartDate = value?.start
        ? formatter.format(value.start.toDate(getLocalTimeZone()))
        : "Select date";
    const formattedEndDate = value?.end
        ? formatter.format(value.end.toDate(getLocalTimeZone()))
        : "Select date";

    const presets = useMemo(
        () => ({
            today: { label: "Today", value: { start: now, end: now } },
            yesterday: {
                label: "Yesterday",
                value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) },
            },
            thisWeek: {
                label: "This week",
                value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) },
            },
            lastWeek: {
                label: "Last week",
                value: {
                    start: startOfWeek(now, locale).subtract({ weeks: 1 }),
                    end: endOfWeek(now, locale).subtract({ weeks: 1 }),
                },
            },
            thisMonth: {
                label: "This month",
                value: { start: startOfMonth(now), end: endOfMonth(now) },
            },
            lastMonth: {
                label: "Last month",
                value: {
                    start: startOfMonth(now).subtract({ months: 1 }),
                    end: endOfMonth(now.subtract({ months: 1 })),
                },
            },
            thisYear: {
                label: "This year",
                value: {
                    start: startOfMonth(now.set({ month: 1 })),
                    end: endOfMonth(now.set({ month: 12 })),
                },
            },
            lastYear: {
                label: "Last year",
                value: {
                    start: startOfMonth(now.set({ month: 1 }).subtract({ years: 1 })),
                    end: endOfMonth(now.set({ month: 12 }).subtract({ years: 1 })),
                },
            },
            allTime: {
                label: "All time",
                value: {
                    start: now.set({ year: 2000, month: 1, day: 1 }),
                    end: now,
                },
            },
        }),
        [locale],
    );

    return (
        <AriaDateRangePicker
            aria-label="Date range picker"
            shouldCloseOnSelect={false}
            {...props}
            value={value}
            onChange={setValue}
        >
            <AriaGroup>
                {({ isInvalid }) => (
                    <AriaButton
                        className={cx(
                            "flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                            isInvalid && "border-red-400 ring-2 ring-red-400/60",
                        )}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        {!value ? (
                            <span className="text-white/60">Select dates</span>
                        ) : (
                            `${formattedStartDate} – ${formattedEndDate}`
                        )}
                    </AriaButton>
                )}
            </AriaGroup>

            <AriaPopover
                placement="bottom right"
                offset={8}
                className={({ isEntering, isExiting }) =>
                    cx(
                        "z-50 origin-(--trigger-anchor-point) will-change-transform",
                        isEntering &&
                        "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                        isExiting &&
                        "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                    )
                }
            >
                <AriaDialog
                    aria-label="Date range picker"
                    className="max-h-[85vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-900/95 text-white shadow-2xl backdrop-blur-xl outline-none"
                >
                    {({ close }) => (
                        <div className="flex flex-col lg:flex-row">
                            {/* Presets: a row of chips on small screens, a left column on large screens */}
                            <div className="flex flex-row flex-wrap gap-1 border-b border-white/10 p-3 lg:w-40 lg:flex-col lg:border-b-0 lg:border-r">
                                {Object.values(presets).map((preset) => (
                                    <RangePresetButton
                                        key={preset.label}
                                        value={preset.value}
                                        onClick={() => {
                                            setValue(preset.value);
                                            setFocusedValue(preset.value.start);
                                        }}
                                    >
                                        {preset.label}
                                    </RangePresetButton>
                                ))}
                            </div>

                            <div className="flex flex-col">
                                <RangeCalendar
                                    focusedValue={focusedValue}
                                    onFocusChange={setFocusedValue}
                                    highlightedDates={highlightedDates}
                                    presets={{
                                        lastWeek: presets.lastWeek,
                                        lastMonth: presets.lastMonth,
                                        lastYear: presets.lastYear,
                                    }}
                                />

                                <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="hidden items-center gap-2 md:flex">
                                        <InputDateBase slot="start" size="sm" />
                                        <span className="text-white/50">–</span>
                                        <InputDateBase slot="end" size="sm" />
                                    </div>

                                    <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
                                        <button
                                            type="button"
                                            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                                            onClick={() => {
                                                onCancel?.();
                                                close();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                                            onClick={() => {
                                                onApply?.();
                                                close();
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDateRangePicker>
    );
};