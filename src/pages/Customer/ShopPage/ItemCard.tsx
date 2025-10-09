import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@heroui/react";

export default function ItemCard() {
  const list = [
    {
      title: "Orange",
      img: "https://picsum.photos/300/300",
      price: "$5.50",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Tangerine",
      img: "https://picsum.photos/300/300",
      price: "$3.00",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Raspberry",
      img: "https://picsum.photos/300/300",
      price: "$10.00",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Lemon",
      img: "https://picsum.photos/300/300",
      price: "$5.30",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Avocado",
      img: "https://picsum.photos/300/300",
      price: "$15.70",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Lemon 2",
      img: "https://picsum.photos/300/300",
      price: "$8.00",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Banana",
      img: "https://picsum.photos/300/300",
      price: "$7.50",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Watermelon",
      img: "https://picsum.photos/300/300",
      price: "$12.20",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
  ];

  return (
    <div className="gap-5 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
        <Card
          key={index}
          shadow="sm"
          onPress={() => console.log("item pressed")}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              isZoomed
              alt={item.title}
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
              src={item.img}
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small">
            <div className="flex flex-col w-full">
              {/* Product Name and Price */}
              <div className="flex justify-between w-full">
                <b>{item.title}</b>
                <p className="text-default-500 flex items-baseline">
                  <span className="mr-1">{item.price}</span>
                  <span className="font-bold text-sm">/ kg</span>
                  {/* Bold "/kg" text */}
                </p>
              </div>
              <span className="text-left text-xs font-light">
                {item.description}
              </span>
              {/* Button that takes full width */}
              <Button color="primary" variant="solid" className="w-full mt-2">
                Add to Cart
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
