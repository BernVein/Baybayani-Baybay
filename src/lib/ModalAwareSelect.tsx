"use client";

import {
  forwardRef,
  type ForwardedRef,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Select, type SelectProps } from "@heroui/react";
import { JSX } from "react/jsx-runtime";

type ModalAwareSelectProps<T extends object> = SelectProps<T>;

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        try {
          (ref as any).current = value;
        } catch (error) {
          console.error("Failed to assign ref", error);
        }
      }
    }
  };
}

function ModalAwareSelectInner<T extends object>(
  { popoverProps, onOpenChange, ...props }: ModalAwareSelectProps<T>,
  forwardedRef: ForwardedRef<HTMLSelectElement>,
) {
  const triggerRef = useRef<HTMLSelectElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  const computeContainer = useCallback(() => {
    if (!triggerRef.current) return null;
    const wrapper = triggerRef.current.closest(
      '[data-slot="wrapper"]',
    ) as HTMLElement | null;
    const dialog = triggerRef.current.closest(
      '[role="dialog"]',
    ) as HTMLElement | null;

    return wrapper ?? dialog ?? null;
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!popoverProps?.portalContainer) {
        if (isOpen) {
          setPortalContainer((current) => current ?? computeContainer());
        } else {
          setPortalContainer(null);
        }
      }
      onOpenChange?.(isOpen);
    },
    [computeContainer, onOpenChange, popoverProps?.portalContainer],
  );

  useEffect(() => {
    if (popoverProps?.portalContainer) {
      setPortalContainer(null);

      return;
    }
    const container = computeContainer();

    if (container) {
      setPortalContainer(container);
    }
  }, [computeContainer, popoverProps?.portalContainer]);

  useEffect(() => {
    if (!portalContainer) return;
    const previousOverflow = portalContainer.style.overflow;

    portalContainer.style.overflow = "visible";

    return () => {
      portalContainer.style.overflow = previousOverflow;
    };
  }, [portalContainer]);

  const mergedPopoverProps = useMemo(() => {
    if (!portalContainer || popoverProps?.portalContainer) {
      return popoverProps;
    }

    return {
      ...popoverProps,
      portalContainer,
    };
  }, [popoverProps, portalContainer]);

  const mergedRef = useMemo(
    () => mergeRefs(forwardedRef, triggerRef),
    [forwardedRef],
  );

  return (
    <Select
      ref={mergedRef}
      popoverProps={mergedPopoverProps}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
}

export const ModalAwareSelect = forwardRef(ModalAwareSelectInner) as <
  T extends object,
>(
  props: ModalAwareSelectProps<T> & {
    ref?: React.ForwardedRef<HTMLSelectElement>;
  },
) => JSX.Element;

export default ModalAwareSelect;
