import {
  Card,
  Chip,
  CardBody,
  CardFooter,
  Image,
  Button,
  Divider,
  NumberInput,
  Tooltip,
} from "@heroui/react";

export default function ItemCard() {
  const list = [
    {
      title: "Orange",
      img: "https://picsum.photos/300/300",
      price: "$5.50",
      stocks: "232",
      soldBy: "Kilo",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Tangerine",
      img: "https://picsum.photos/300/300",
      price: "$3.00",
      stocks: "2232",
      soldBy: "Piece",

      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Raspberry",
      img: "https://picsum.photos/300/300",
      stocks: "102",
      soldBy: "Bulk",

      price: "$10.00",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
    {
      title: "Lemon",
      img: "https://picsum.photos/300/300",
      price: "$5.30",
      stocks: "932",
      soldBy: "Shit",

      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
    },
  ];
  const splitDescription = (text: string) => {
    return text
      .split(" ") // Split the description into words
      .reduce((acc: string[][], word, index) => {
        if (index % 5 === 0) acc.push([]); // Start a new line after 5 words
        acc[acc.length - 1].push(word); // Add word to the current line
        return acc;
      }, [])
      .map((line, index) => (
        <div key={index} className="text-sm">
          {line.join(" ")} {/* Join the words to form a line */}
        </div>
      ));
  };

  return (
    <div className="gap-5 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
        <Card
          key={index}
          shadow="sm"
          onPress={() => console.log("item pressed")}
        >
          <CardBody className="overflow-visible p-0">
            <div className="relative">
              <Image
                isZoomed
                alt={item.title}
                className="w-full object-cover h-[140px] rounded-lg shadow-sm"
                src={item.img}
                width="100%"
              />
              <Chip
                className="absolute top-2 left-2 z-10"
                color="default"
                size="sm"
              >
                Default
              </Chip>
            </div>
          </CardBody>

          <CardFooter className="text-small">
            <div className="flex flex-col w-full">
              {/* Product Name and Price */}
              <div className="flex justify-between w-full flex-col sm:flex-row items-center sm:items-baseline">
                <b>{item.title}</b>
                <p className="text-default-500 flex items-baseline mt-2 sm:mt-0 justify-center sm:justify-start">
                  <span className="mr-1">{item.price}</span>
                  <span className="font-bold text-sm">/ {item.soldBy}</span>
                  {/* Bold "/kg" text */}
                </p>
              </div>

              <Divider className="my-2" />
              <span className="text-left text-xs font-light">
                <Tooltip
                  showArrow={true}
                  content={
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">
                        Full Description
                      </div>
                      <div className="text-tiny">
                        {splitDescription(item.description)}
                      </div>
                    </div>
                  }
                >
                  <span className="text-left text-xs font-light">
                    {item.description.split(" ").slice(0, 10).join(" ")}
                    {item.description.split(" ").length > 10 && " ..."}
                  </span>
                </Tooltip>
              </span>
              <Divider className="my-3" />

              <div className="flex justify-between w-full flex-col sm:flex-row sm:items-center">
                <div className="w-full sm:w-1/2">
                  <NumberInput
                    className="max-w-xs"
                    placeholder="Enter quantity"
                    size="sm"
                    labelPlacement="outside"
                  />
                </div>
                <div className="w-full sm:w-1/2 text-right mt-2 sm:mt-0">
                  <span className="text-xs font-light">
                    Stocks: {item.stocks}
                  </span>
                </div>
              </div>

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
