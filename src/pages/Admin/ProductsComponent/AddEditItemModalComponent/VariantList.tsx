import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";

import { PencilIcon, TrashIcon } from "@/components/icons";
import { Item } from "@/model/Item";
import { DeleteVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/VariantListComponent/DeleteVariantModal";
import { AddEditVariantModal } from "@/pages/Admin/ProductsComponent/AddEditItemModalComponent/AddEditVariantModal";

export function VariantList({
  itemHasVariant,
  item,
  setItem,
}: {
  itemHasVariant: boolean;
  item: Item;
  setItem: React.Dispatch<React.SetStateAction<Item>>;
}) {
  const {
    isOpen: isOpenDeleteVar,
    onOpen: onOpenDeleteVar,
    onOpenChange: onOpenChangeDeleteVar,
  } = useDisclosure();
  const {
    isOpen: isOpenAddVar,
    onOpen: onOpenAddVar,
    onOpenChange: onOpenChangeAddVar,
  } = useDisclosure();

  const [selectedVarIndex, setSelectedVarIndex] = useState<number | null>(null);
  const [selectedVarName, setSelectedVarName] = useState<string | null>(null);

  return (
    <>
      {item.item_variants.length === 0 && itemHasVariant ? (
        <p className="text-sm text-default-400 italic text-center py-4">
          No variants added yet.
        </p>
      ) : (
        item.item_variants.map((v, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row justify-between items-start">
              <div className="flex flex-col">
                <h4 className="text-large font-bold">
                  {itemHasVariant ? (
                    <>
                      {v.variant_name || "Default Variant"}
                      <p className="text-tiny text-default-400">
                        Variant {index + 1}
                      </p>
                    </>
                  ) : (
                    <>Item Additional Info</>
                  )}
                </h4>
              </div>
              <div className="ml-auto flex flex-row gap-2">
                <Button
                  isIconOnly
                  className="ml-auto"
                  size="sm"
                  startContent={<PencilIcon className="w-5" />}
                  onPress={() => {
                    setSelectedVarIndex(index);
                    setSelectedVarName(v.variant_name ?? null);
                    onOpenAddVar();
                  }}
                />
                <Button
                  isIconOnly
                  className="ml-auto"
                  color="danger"
                  size="sm"
                  startContent={<TrashIcon className="w-5" />}
                  onPress={() => {
                    setSelectedVarIndex(index);
                    setSelectedVarName(v.variant_name ?? null);
                    onOpenDeleteVar();
                  }}
                />
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="py-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex justify-between">
                <span className="text-default-500">Stocks:</span>
                <span className="font-medium">
                  {v.variant_stock_latest_movement.effective_stocks != null
                    ? v.variant_stock_latest_movement.effective_stocks.toLocaleString()
                    : "0"}{" "}
                  {item.item_sold_by}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Date Delivered:</span>
                <span className="font-medium">
                  {v.variant_stock_latest_movement.stock_delivery_date
                    ? new Date(
                        v.variant_stock_latest_movement.stock_delivery_date,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Total Buying Price:</span>
                <span className="font-medium">
                  {v.variant_stock_latest_movement.stock_adjustment_amount !=
                  null
                    ? `₱${v.variant_stock_latest_movement.stock_adjustment_amount.toLocaleString(
                        "en-PH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Retail Price:</span>
                <span className="font-medium">
                  {v.variant_price_retail != null
                    ? `₱${v.variant_price_retail.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Low Stock Alert:</span>
                <span className="font-medium">
                  {v.variant_low_stock_threshold?.toLocaleString()}{" "}
                  {item.item_sold_by}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Wholesale Price:</span>

                {v.variant_last_price_wholesale != null &&
                v.variant_last_price_wholesale > 0 ? (
                  <span className="font-medium">
                    ₱
                    {v.variant_last_price_wholesale.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                ) : (
                  <span className="text-xs italic text-default-400">N/A</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-default-500">Supplier:</span>
                <span className="font-medium truncate ml-2">
                  {v.variant_stock_latest_movement.stock_supplier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Wholesale Min Qty:</span>

                {v.variant_wholesale_item != null &&
                v.variant_wholesale_item > 0 ? (
                  <span className="font-medium truncate ml-2">
                    {v.variant_wholesale_item.toLocaleString()}{" "}
                    {item.item_sold_by}
                  </span>
                ) : (
                  <span className="text-xs italic text-default-400 ml-2">
                    N/A
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        ))
      )}
      <DeleteVariantModal
        isOpenDeleteVar={isOpenDeleteVar}
        itemHasVariant={itemHasVariant}
        selectedVarIndex={selectedVarIndex}
        selectedVarName={selectedVarName}
        setItem={setItem}
        setSelectedVarIndex={setSelectedVarIndex}
        onOpenChangeDeleteVar={onOpenChangeDeleteVar}
      />
      <AddEditVariantModal
        defaultVariant={
          selectedVarIndex !== null
            ? item.item_variants[selectedVarIndex]
            : null
        }
        isOpenAddVar={isOpenAddVar}
        itemHasVariant={itemHasVariant}
        itemUnitOfMeasure={item.item_sold_by}
        onAddEditVariant={(newVariant) => {
          if (selectedVarIndex !== null) {
            // edit existing variant
            setItem((prev) => {
              const variants = [...prev.item_variants];

              variants[selectedVarIndex] = newVariant;

              return { ...prev, item_variants: variants };
            });
          } else {
            // add new variant
            setItem((prev) => ({
              ...prev,
              item_variants: [
                ...prev.item_variants,
                {
                  ...newVariant,
                  name: itemHasVariant
                    ? newVariant.variant_name
                    : prev.item_title,
                },
              ],
            }));
          }
        }}
        onOpenChangeAddVar={onOpenChangeAddVar}
      />
    </>
  );
}
