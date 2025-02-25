import { Input } from "@/components/ui/input";
import { OTPInput } from "input-otp";

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export function VerificationInput({ value, onChange, isDisabled }: VerificationInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={6}
      containerClassName="flex items-center gap-2 has-[:disabled]:opacity-50"
      render={({ slots }) => (
        <>
          {slots.map((slot, idx) => (
            <Input
              key={idx}
              {...slot}
              className="w-10 h-12 text-center text-lg"
              disabled={isDisabled}
            />
          ))}
        </>
      )}
    />
  );
}
