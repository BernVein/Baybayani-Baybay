import { MessageIcon } from "@/components/icons";
import { MessageList } from "@/pages/Admin/MessagesComponent/MessageList";
import { useDisclosure } from "@heroui/react";
import { EditUserModal } from "@/pages/Admin/UsersComponent/EditUserModal";
import { MessageContentDesktop } from "@/pages/Admin/MessagesComponent/MessageContentDesktop";
import { useState } from "react";

export default function Messages() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null,
    );

    return (
        <>
            <div className="flex flex-col gap-8 p-4 h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                    <div className="flex flex-row items-center gap-2">
                        <MessageIcon className="w-10" />
                        <div className="text-3xl font-semibold">Messages</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center text-muted-foreground">
                        <div className="text-base text-default-200">
                            Logged in as{" "}
                        </div>
                        <div className="text-lg font-semibold">
                            Admin Bern Vein
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 flex-1 min-h-0">
                    <MessageList
                        onSelect={() => setSelectedMessageId("selected")}
                        className={
                            selectedMessageId
                                ? "hidden sm:flex sm:w-2/3 h-full"
                                : "flex w-full sm:w-1/3 h-full"
                        }
                    />
                    <MessageContentDesktop
                        onOpen={onOpen}
                        onBack={() => setSelectedMessageId(null)}
                        className={
                            selectedMessageId
                                ? "flex w-full h-full"
                                : "hidden sm:flex sm:w-2/3 h-full"
                        }
                    />
                </div>
            </div>
            <EditUserModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
}
