import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Input,
  Button,
} from "@heroui/react";

import { SendIcon, ExclamationCircle } from "@/components/icons";

export function MessageContentDesktop({
  onOpen,
  className,
  onBack,
}: {
  onOpen: () => void;
  className?: string;
  onBack?: () => void;
}) {
  return (
    <Card
      className={`h-[68vh] sm:h-[88vh] ${className || "hidden sm:flex sm:w-2/3"}`}
    >
      <CardHeader className="flex gap-3">
        <div className="flex flex-row gap-2 items-center w-full">
          {onBack && (
            <Button
              isIconOnly
              className="sm:hidden"
              variant="light"
              onPress={onBack}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-2 items-center">
              <Avatar />
              <span className="font-semibold">User 1</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Button isIconOnly variant="light" onPress={onOpen}>
                <ExclamationCircle className="w-7" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col-reverse overflow-y-auto space-y-3-reverse p-3 gap-2">
        {/* Admin message */}
        <div className="flex justify-end gap-2 items-start">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-default-200">Admin Vein</span>
            <div className="max-w-[70%] rounded-lg bg-green-900 text-primary-foreground px-3 py-2 text-sm">
              Let me check that for you right now.
            </div>
          </div>
          <Avatar className="shrink-0" size="sm" />
        </div>

        {/* User message */}
        <div className="flex justify-start gap-2 items-start">
          <Avatar className="shrink-0" size="sm" />
          <div className="max-w-[70%] rounded-lg bg-default-200 px-3 py-2 text-sm">
            It says completed but I haven’t received it yet.
          </div>
        </div>

        {/* Admin message */}
        <div className="flex justify-end gap-2 items-start">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs text-default-600">Admin Alex</span>
            <div className="max-w-[70%] rounded-lg bg-green-900 text-primary-foreground px-3 py-2 text-sm">
              Sure! What seems to be the problem?
            </div>
          </div>
          <Avatar className="shrink-0" size="sm" />
        </div>

        {/* User message */}
        <div className="flex justify-start gap-2 items-start">
          <Avatar className="shrink-0" size="sm" />
          <div className="max-w-[70%] rounded-lg bg-default-200 px-3 py-2 text-sm">
            Hello admin, I have a question about my order.
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex flex-row gap-2">
        <Input placeholder="Type your message..." />
        <Button isIconOnly variant="light">
          <SendIcon className="w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
