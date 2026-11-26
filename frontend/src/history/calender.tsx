
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import type { DateValue } from "react-aria-components";

type DateRangeValue = {
    start: DateValue;
    end: DateValue;
};

type DateRangePickerControlledDemoProps = {
    value: DateRangeValue | null;
    setValue: (value: DateRangeValue | null) => void;
};

export const DateRangePickerControlledDemo = ({ value, setValue }: DateRangePickerControlledDemoProps) => {
    return <DateRangePicker aria-label="Date range picker" shouldCloseOnSelect={false} value={value} onChange={setValue} />;
};