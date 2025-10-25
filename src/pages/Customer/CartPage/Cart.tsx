import React from "react";
import {
  Card,
  CardBody,
  Image,
  Divider,
  CheckboxGroup,
  Checkbox,
  cn,
  Button,
} from "@heroui/react";
import useIsMobile from "@/lib/isMobile";
import { AddToCart } from "@/components/icons";
import { Link } from "@heroui/link";
type Product = {
  id: string;
  name: string;
  weight: string;
  priceVariant: string;
  quantity: string;
  totalKilos: string;
  subtotal: string;
  image: string;
};

interface ProductCheckboxProps {
  product: Product;
  value: string;
}

export const ProductCheckbox: React.FC<ProductCheckboxProps> = ({
  product,
  value,
}) => {
  return (
    <Checkbox
      aria-label={product.name}
      classNames={{
        base: cn(
          "inline-flex max-w-full w-full bg-content1 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg p-0 border-2 border-transparent"
        ),
        label: "w-full",
        wrapper: "flex flex-col ml-3",
      }}
      value={value}
      color="success"
    >
      <Card className="w-full shadow-none border-none bg-transparent">
        <CardBody className="flex flex-row gap-3 items-stretch">
          {/* image column */}
          <div className="relative w-[130px] shrink-0 self-stretch overflow-hidden rounded-sm">
            <Image
              alt={product.name}
              src={product.image}
              removeWrapper
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* content column */}
          <div className="flex flex-col justify-start items-start text-left flex-1">
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-sm sm:text-base text-default-700">
                {product.name}
              </span>
            </div>
            <Divider className="my-2" />
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-default-500">Price Variant</span>
              <span className="text-sm text-default-600">
                {product.priceVariant}
              </span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-default-500">Quantity</span>
              <span className="text-sm text-default-600">
                {product.quantity}
              </span>
            </div>

            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-default-500">Subtotal</span>
              <span className="text-sm text-default-600">
                {product.subtotal}
              </span>
            </div>
            <span className="block w-full text-end text-default-500 text-sm mt-3 z-10">
              <Link
                underline="hover"
                href="https://www.facebook.com/"
                size="sm"
                color="success"
              >
                Edit Details &gt;
              </Link>
            </span>
          </div>
        </CardBody>
      </Card>
    </Checkbox>
  );
};

export default function Cart() {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const products: Product[] = [
    {
      id: "product1",
      name: "Product Name",
      weight: "23 kilo / Item",
      priceVariant: "Wholesale",
      quantity: "4 items",
      totalKilos: "400 kilos",
      subtotal: "₱4,232.22",
      image: "https://heroui.com/images/hero-card-complete.jpeg",
    },
    {
      id: "product2",
      name: "Premium Rice",
      weight: "50 kilo / Item",
      priceVariant: "Retail",
      quantity: "2 items",
      totalKilos: "100 kilos",
      subtotal: "₱2,000.00",
      image: "https://i.pravatar.cc/300?u=a042581f4e29026707d",
    },
    {
      id: "product1",
      name: "Product Name",
      weight: "23 kilo / Item",
      priceVariant: "Wholesale",
      quantity: "4 items",
      totalKilos: "400 kilos",
      subtotal: "₱4,232.22",
      image: "https://heroui.com/images/hero-card-complete.jpeg",
    },
    {
      id: "product2",
      name: "Premium Rice",
      weight: "50 kilo / Item",
      priceVariant: "Retail",
      quantity: "2 items",
      totalKilos: "100 kilos",
      subtotal: "₱2,000.00",
      image: "https://i.pravatar.cc/300?u=a042581f4e29026707d",
    },
  ];
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex justify-between items-center w-full md:w-3/4 md:mx-auto px-5">
        <h2 className="text-3xl font-semibold">My Cart</h2>
        <span className="text-default-500 text-sm">3 items in Cart</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-3/4 md:mx-auto p-5">
        <CheckboxGroup
          value={selectedProducts}
          onChange={setSelectedProducts}
          className="sm:w-3/4 mb-3"
        >
          {products.map((p) => (
            <ProductCheckbox key={p.id} product={p} value={p.id} />
          ))}
        </CheckboxGroup>

        <Card
          className="w-full sm:w-1/4 self-start sticky top-30 bottom-23 z-10"
          isBlurred={isMobile}
        >
          <CardBody className="gap-1">
            <span className="mb-2">Order Summary</span>
            <div className="w-full flex flex-row mb-2 justify-between items-center">
              <span className="text-xs text-default-500">Subtotal</span>
              <span className="text-sm text-default-600">₱23,123.32</span>
            </div>
            <Button
              color="success"
              startContent={<AddToCart className="size-6" />}
            >
              Proceed to Checkout
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
