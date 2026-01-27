import { CartIcon, SearchIcon, FilterIcon, PlusIcon } from "@/components/icons";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Autocomplete,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Spinner,
    AutocompleteItem,
} from "@heroui/react";
import { OrderSummary } from "@/pages/Admin/OrdersComponent/OrderSummary";
import { OrderTableMobile } from "@/pages/Admin/OrdersComponent/OrderTableMobile";
import { OrderTableDesktop } from "@/pages/Admin/OrdersComponent/OrderTableDesktop";
import useIsMobile from "@/lib/isMobile";
import { useFetchNavbarItems } from "@/data/supabase/Customer/Products/useFetchNavbarItems";
import { useState } from "react";

export default function Orders() {
    const isMobile = useIsMobile();
    const {
        isOpen: isOpenAddOrder,
        onOpen: onOpenAddOrder,
        onOpenChange: onOpenChangeAddOrder,
    } = useDisclosure();
    const [searchValue, setSearchValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const { items: fetchedItems, loading } = useFetchNavbarItems();
    const searchItems = fetchedItems.map((i) => ({
        label: i.item_title,
        key: `${i.item_id}`,
    }));
    return (
        <>
            <div className="flex flex-col gap-8 p-4 h-full">
                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                    <div className="flex flex-row items-center gap-2">
                        <CartIcon className="w-10" />
                        <div className="text-3xl font-semibold">Orders</div>
                    </div>
                    <div className="flex flex-row gap-1 items-center text-muted-foreground">
                        <div className="text-base text-default-500">
                            Logged in as{" "}
                        </div>
                        <div className="text-lg font-semibold">
                            Admin Bern Vein
                        </div>
                    </div>
                </div>
                <div className="hidden sm:block shrink-0">
                    <OrderSummary />
                </div>

                <div className="flex flex-row items-center justify-between shrink-0">
                    {/* Search Row */}
                    <Input
                        placeholder="Search user / item"
                        className="w-1/2 sm:w-1/4"
                        startContent={<SearchIcon />}
                    />
                    <div className="flex flex-row gap-2 items-center">
                        <Button
                            className="capitalize"
                            startContent={<PlusIcon className="w-5" />}
                            isIconOnly={isMobile}
                            onPress={onOpenAddOrder}
                        >
                            {isMobile ? "" : "Add Order"}
                        </Button>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    className="capitalize"
                                    startContent={
                                        <FilterIcon className="w-5" />
                                    }
                                    isIconOnly={isMobile}
                                >
                                    {isMobile ? "" : "Filter Status"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                closeOnSelect={false}
                                selectionMode="multiple"
                            >
                                <DropdownItem key="pending">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span>Pending</span>
                                    </div>
                                </DropdownItem>
                                <DropdownItem key="ready">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span>Ready</span>
                                    </div>
                                </DropdownItem>
                                <DropdownItem key="completed">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
                                        <span>Completed</span>
                                    </div>
                                </DropdownItem>
                                <DropdownItem key="cancel">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-300" />
                                        <span className="text-danger">
                                            Cancel
                                        </span>
                                    </div>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                {/* TABLE ROW */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <OrderTableMobile />
                    <OrderTableDesktop />
                </div>
            </div>
            <Modal
                isOpen={isOpenAddOrder}
                onOpenChange={onOpenChangeAddOrder}
                disableAnimation
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-semibold">
                                        Add Order
                                    </span>
                                    <span className="text-sm text-default-500 italic">
                                        Changes here are temporary. The order
                                        will be officially added only when you
                                        click the{" "}
                                        <span className="text-success-500 font-semibold">
                                            Add Order
                                        </span>{" "}
                                        button below.
                                    </span>
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex flex-col gap-2">
                                <p className="text-sm text-default-500">
                                    Note: When adding an order, the name will
                                    automatically be set to{" "}
                                    <span className="font-semibold text-default-700">
                                        Bern Vein Balermo
                                    </span>
                                    , the admin currently logged in.
                                </p>
                                <Autocomplete
                                    isDisabled={loading}
                                    fullWidth
                                    className="w-full opacity-90"
                                    defaultItems={searchItems}
                                    placeholder={
                                        loading
                                            ? "Gathering items..."
                                            : "Search products..."
                                    }
                                    startContent={
                                        loading ? (
                                            <Spinner
                                                size="sm"
                                                color="success"
                                            />
                                        ) : (
                                            <SearchIcon className="size-5 text-default-500" />
                                        )
                                    }
                                    variant="flat"
                                    value={searchValue}
                                    onValueChange={(val) => {
                                        setSearchValue(val);

                                        if (val.trim() === "") {
                                            setShowSuggestions(false);
                                        } else {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    allowsCustomValue
                                    onKeyDown={(
                                        e: React.KeyboardEvent<HTMLInputElement>,
                                    ) => {
                                        if (e.key === "Enter") {
                                            (
                                                e.target as HTMLInputElement
                                            ).blur();
                                        }
                                    }}
                                    onClear={() => {
                                        setSearchValue("");
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {showSuggestions
                                        ? searchItems
                                              .slice(0, 20)
                                              .map((item) => (
                                                  <AutocompleteItem
                                                      key={item.key}
                                                      onClick={() => {
                                                          setSearchValue(
                                                              item.label,
                                                          );
                                                          setTimeout(() => {
                                                              (
                                                                  document.activeElement as HTMLInputElement
                                                              )?.blur();
                                                          }, 100);
                                                      }}
                                                  >
                                                      {item.label}
                                                  </AutocompleteItem>
                                              ))
                                        : null}
                                </Autocomplete>
                            </ModalBody>

                            <ModalFooter className="justify-between items-center">
                                <span className="text-sm text-default-500 italic">
                                    <span className="text-red-500">*</span>{" "}
                                    Required field
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button color="success">Add Order</Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
