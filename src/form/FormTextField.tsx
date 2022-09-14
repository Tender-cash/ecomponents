import React from "react";
import { Controller, ValidationRule } from "react-hook-form";
import { Column } from "../Column";
import { Input, InputProps } from "../Input";
import { Typography } from "../Typography";
import { UseControllerProps } from "react-hook-form/dist/types/controller";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

type Rules = {
  required?: boolean | ValidationRule<boolean>;
  min?: number | ValidationRule<number>;
  max?: number | ValidationRule<number>;
  minLength?: number | ValidationRule<number>;
  maxLength?: number | ValidationRule<number>;
  pattern?: RegExp | ValidationRule<RegExp>;
  validate?: RegisterOptions["validate"];
};

type FormTextInputProps = Omit<
  InputProps,
  "value" | "onChange" | "onBlur" | "label" | "ref"
> & {
  control: any;
  name: string;
  label: React.ReactNode;
  type?: "address" | "text" | "password" | "email" | "number";
  rules?: Rules;
};

function configureProps(
  props: FormTextInputProps
): Omit<FormTextInputProps, "rules"> & { rules: UseControllerProps["rules"] } {
  let { rules = {}, type, label, name } = props;

  if (rules.required === true) {
    rules = {
      ...rules,
      required: {
        value: true,
        message: `${label || name} is required`,
      },
    };
  }

  if (typeof rules.min === "number") {
    rules = {
      ...rules,
      min: { value: rules.min, message: `Minimum value is ${rules.min}` },
    };
  }

  if (typeof rules.max === "number") {
    rules = {
      ...rules,
      max: { value: rules.max, message: `Maximum value is ${rules.max}` },
    };
  }

  if (typeof rules.maxLength === "number") {
    rules = {
      ...rules,
      maxLength: {
        value: rules.maxLength,
        message: `Max length is ${rules.maxLength}`,
      },
    };
  }

  if (typeof rules.minLength === "number") {
    rules = {
      ...rules,
      minLength: {
        value: rules.minLength,
        message: `Max length is ${rules.minLength}`,
      },
    };
  }

  if (type === "address") {
    props = { ...props, type: "text" };
    rules = {
      ...rules,
      pattern: {
        value: /^0x[a-fA-F0-9]{40}$/,
        message: "Not a valid ETH address",
      },
    };
  }

  return { ...props, rules };
}

export const FormTextField = (originalProps: FormTextInputProps) => {
  const { rules, control, name, label, ...props } =
    configureProps(originalProps);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: fieldProps, fieldState: { error } }) => {
        return (
          <Column gap="sm">
            <Typography color={props.color}>{label}</Typography>
            <Input {...props} {...fieldProps} error={!!error || props.error} />
            {!!error ? (
              <Typography color="error" variant="h5">
                {error.message}
              </Typography>
            ) : null}
          </Column>
        );
      }}
    />
  );
};
