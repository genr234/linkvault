import { CornerDownLeft, Delete } from "lucide-react";
import { Button } from "./ui/button";

interface NumpadProps {
  onSubmit: () => void;
  value: string;
  onChange: (number: string) => void;
}

export const Numpad = ({ onSubmit, onChange, value }: NumpadProps) => {
  function handleClick(
    n: string,
    onChange: (number: string) => void,
    value: string
  ) {
    if (value === "") {
      onChange(n);
    } else {
      onChange(value + n);
    }
  }
  return (
    <div className="grid grid-cols-3 gap-4 w-48">
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("1", onChange, value)}
      >
        1
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("2", onChange, value)}
      >
        2
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("3", onChange, value)}
      >
        3
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("4", onChange, value)}
      >
        4
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("5", onChange, value)}
      >
        5
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("6", onChange, value)}
      >
        6
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("7", onChange, value)}
      >
        7
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("8", onChange, value)}
      >
        8
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("9", onChange, value)}
      >
        9
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={() => {
          onChange(value.slice(0, -1));
        }}
      >
        <Delete />
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleClick("0", onChange, value)}
      >
        0
      </Button>
      <Button
        type="button"
        variant="default"
        onClick={() => {
          onSubmit();
          onChange("");
        }}
      >
        <CornerDownLeft />
      </Button>
    </div>
  );
};
