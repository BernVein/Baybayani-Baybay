import { TrashIcon, PlusIcon } from "@/components/icons";
import { Button, Divider, Card, CardBody } from "@heroui/react";

export function ItemHasVariant({ onOpenAddVar }: { onOpenAddVar: () => void }) {
    return (
        <>
            <Divider />
            <div className="flex flex-row justify-between">
                <span className="text-lg font-semibold">Item Variants</span>
                <Button
                    startContent={<PlusIcon className="w-5" />}
                    onPress={onOpenAddVar}
                >
                    Add Variant
                </Button>
            </div>

            {[1].map((_, index) => (
                <div key={index} className="space-y-2">
                    <Card>
                        <CardBody>
                            <p>
                                Make beautiful websites regardless of your
                                design experience.
                            </p>
                        </CardBody>
                    </Card>
                    <div className="flex justify-end">
                        {true && (
                            <div className="flex justify-end">
                                <Button
                                    startContent={<TrashIcon className="w-5" />}
                                    color="danger"
                                    className="mt-2"
                                >
                                    Remove Variant
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}
